import 'package:meta/meta.dart';

@immutable
abstract class SelVocaHistListEvent {}

class SelVocaHistList extends SelVocaHistListEvent {
  final int page;
  final int length;
  final String targetid;
  final apiToken;
  SelVocaHistList(
  {
    required this.page,
    required this.length,
    required this.targetid,
    required this.apiToken
  });
}