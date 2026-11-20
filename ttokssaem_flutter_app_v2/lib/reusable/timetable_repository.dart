import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'package:ttokssaem_flutter_app/model/timetable_model.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';

/*
 * 수능/평시 시간표 저장소
 *  - 수능/평시 여부는 "학습계획 날짜(plandate)" 기준으로 서버가 판정한다.
 *    (어드민 > 시간표 기간 관리에서 등록한 기간. 매년 소스 수정 없이 동작)
 *  - plandate 별로 메모리에 캐시하고, 마지막 응답은 기기에 저장해 두었다가 서버 조회 실패 시 사용한다.
 *  - 저장값도 쓸 수 없으면 내장 평시 시간표를 쓴다.
 */
class TimetableRepository {
  TimetableRepository._();
  static final TimetableRepository instance = TimetableRepository._();

  static const String _storageKey = 'timetable_last';
  static const Duration _cacheTtl = Duration(minutes: 10);

  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final Map<String, TimetableModel> _cache = {};
  final Map<String, DateTime> _cachedAt = {};

  // 02시까지는 전날 (앱 공통 규칙)
  static String todayPlandate() {
    DateTime twohoursago = DateTime.now().subtract(const Duration(hours: 2));
    return DateFormat('yyyyMMdd').format(twohoursago);
  }

  static String yesterdayPlandate() {
    DateTime yesterday = DateTime.now().subtract(const Duration(hours: 26)); // 24 + 2(새벽 2시)
    return DateFormat('yyyyMMdd').format(yesterday);
  }

  // 캐시에 있으면 바로 (화면을 다시 그릴 때 깜빡임 방지)
  TimetableModel? peek(String plandate) => _cache[_normalize(plandate)];

  // 포그라운드 복귀 등에서 다시 받아오도록
  void invalidate() {
    _cache.clear();
    _cachedAt.clear();
  }

  Future<TimetableModel> get(String plandate, {CancelToken? apiToken, bool force = false}) async {
    final String key = _normalize(plandate);

    final cachedAt = _cachedAt[key];
    if (!force && _cache.containsKey(key) && cachedAt != null && DateTime.now().difference(cachedAt) < _cacheTtl) {
      return _cache[key]!;
    }

    try {
      final TimetableModel data = await ApiProvider().timetable(key, apiToken ?? CancelToken());
      if (data.slots.isEmpty) throw 'empty timetable';
      _cache[key] = data;
      _cachedAt[key] = DateTime.now();
      _save(data);
      return data;
    } catch (ex) {
      if (kDebugMode) {
        print('timetable fallback ($key) : $ex');
      }
      final TimetableModel fallback = await _fallback(key);
      // 실패한 결과는 짧게만 쓰도록 캐시하지 않는다
      return fallback;
    }
  }

  String _normalize(String plandate) {
    String value = plandate.replaceAll('-', '').trim();
    return value.length == 8 ? value : todayPlandate();
  }

  Future<void> _save(TimetableModel data) async {
    try {
      await _storage.write(key: _storageKey, value: jsonEncode(data.toJson()));
    } catch (ex) {
      if (kDebugMode) {
        print('timetable save error : $ex');
      }
    }
  }

  /*
   * 저장된 마지막 응답으로 판단
   *  - 저장된 응답이 수능 기간이고 plandate 가 그 기간 안이면 그 시간표
   *  - 저장된 응답이 평시면 그 평시 시간표 (기간 밖 날짜)
   *  - 그 외는 내장 평시 시간표
   */
  Future<TimetableModel> _fallback(String plandate) async {
    try {
      final String? saved = await _storage.read(key: _storageKey);
      if (saved != null && saved.isNotEmpty) {
        final TimetableModel last = TimetableModel.fromJson(jsonDecode(saved));
        if (last.slots.isNotEmpty) {
          final bool inPeriod = last.startdate.isNotEmpty &&
              last.enddate.isNotEmpty &&
              plandate.compareTo(last.startdate) >= 0 &&
              plandate.compareTo(last.enddate) <= 0;
          if (last.mode != TimetableModel.MODE_NORMAL && inPeriod) {
            return TimetableModel(plandate, last.mode, last.title, last.startdate, last.enddate, last.slots);
          }
          if (last.mode == TimetableModel.MODE_NORMAL) {
            return TimetableModel(plandate, last.mode, '', '', '', last.slots);
          }
        }
      }
    } catch (ex) {
      if (kDebugMode) {
        print('timetable read error : $ex');
      }
    }
    return TimetableModel.normal(plandate);
  }
}
