import 'package:meta/meta.dart';

@immutable
abstract class SelVocaTestListEvent {}

class SelVocaTestList extends SelVocaTestListEvent {
  final int page;
  final int length;
  final String memodate;
  final apiToken;
  SelVocaTestList(
  {
    required this.page,
    required this.length,
    required this.memodate,
    required this.apiToken
  });
}