import 'package:meta/meta.dart';

@immutable
abstract class UpdateM2MEvent {}

class UpdateM2M extends UpdateM2MEvent {
  final int m2mid;
  final String question;
  final String method;
  final apiToken;
  UpdateM2M(
  {
    required this.m2mid,
    required this.question,
    required this.method,
    required this.apiToken
  });
}