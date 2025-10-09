import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';

@immutable
abstract class NoticeListState {}

class NoticeListInitial extends NoticeListState {}

class InitialNoticeListState extends NoticeListState {}

class NoticeListError extends NoticeListState {
  final String errorMessage;

  NoticeListError({
    required this.errorMessage,
  });
}

class NoticeListWaiting extends NoticeListState {}

class NoticeListSuccess extends NoticeListState {
  final NoticeListModel noticeListData;
  NoticeListSuccess({required this.noticeListData});
}