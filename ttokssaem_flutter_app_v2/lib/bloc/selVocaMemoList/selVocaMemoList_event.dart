import 'package:meta/meta.dart';

@immutable
abstract class SelVocaMemoListEvent {}

class SelVocaMemoList extends SelVocaMemoListEvent {
  final int page;
  final int length;
  final String memodate;
  final apiToken;
  SelVocaMemoList(
  {
    required this.page,
    required this.length,
    required this.memodate,
    required this.apiToken
  });
}