import 'package:meta/meta.dart';

@immutable
abstract class RequestM2MEvent {}

class RequestM2M extends RequestM2MEvent {
  final String message;
  final apiToken;
  RequestM2M(
  {
    required this.message,
    required this.apiToken
  });
}