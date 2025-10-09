import 'package:meta/meta.dart';

@immutable
abstract class SelVocaSolveListEvent {}

class SelVocaSolveList extends SelVocaSolveListEvent {
  final int page;
  final int length;
  final String memodate;
  final apiToken;
  SelVocaSolveList(
  {
    required this.page,
    required this.length,
    required this.memodate,
    required this.apiToken
  });
}