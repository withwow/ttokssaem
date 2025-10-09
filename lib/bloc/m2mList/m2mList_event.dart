import 'package:meta/meta.dart';

@immutable
abstract class M2mListEvent {}

class M2mList extends M2mListEvent {
  final int page;
  final int length;
  final apiToken;
  M2mList(
  {
    required this.page,
    required this.length,
    required this.apiToken
  });
}