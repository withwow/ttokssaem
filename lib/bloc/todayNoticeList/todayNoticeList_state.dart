import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';

@immutable
abstract class TodayNoticeListState {}

class TodayNoticeListInitial extends TodayNoticeListState {}

class InitialTodayNoticeListState extends TodayNoticeListState {}

class TodayNoticeListError extends TodayNoticeListState {
  final String errorMessage;

  TodayNoticeListError({
    required this.errorMessage,
  });
}

class TodayNoticeListWaiting extends TodayNoticeListState {}

class TodayNoticeListSuccess extends TodayNoticeListState {
  final NoticeListModel noticeListData;
  TodayNoticeListSuccess({required this.noticeListData});
}