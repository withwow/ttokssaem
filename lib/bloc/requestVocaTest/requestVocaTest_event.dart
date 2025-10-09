import 'package:meta/meta.dart';

@immutable
abstract class RequestVocaTestEvent {}

class RequestVocaTest extends RequestVocaTestEvent {
  final String memodate;
  final apiToken;
  RequestVocaTest(
  {
    required this.memodate,
    required this.apiToken
  });
}