import 'package:meta/meta.dart';

@immutable
abstract class UpdatePushEvent {}

class UpdatePush extends UpdatePushEvent {
  final String push;
  final apiToken;
  UpdatePush(
  {
    required this.push,
    required this.apiToken
  });
}