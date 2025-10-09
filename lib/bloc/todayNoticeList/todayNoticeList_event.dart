import 'package:meta/meta.dart';

@immutable
abstract class TodayNoticeListEvent {}

class TodayNoticeList extends TodayNoticeListEvent {
  final apiToken;
  TodayNoticeList(
  {
    required this.apiToken
  });
}