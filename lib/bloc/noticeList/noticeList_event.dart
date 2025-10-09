import 'package:meta/meta.dart';

@immutable
abstract class NoticeListEvent {}

class NoticeList extends NoticeListEvent {
  final int page;
  final int length;
  final apiToken;
  NoticeList(
  {
    required this.page,
    required this.length,
    required this.apiToken
  });
}