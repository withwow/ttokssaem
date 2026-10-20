import 'package:meta/meta.dart';

@immutable
abstract class AuthcheckEvent {}

class Authcheck extends AuthcheckEvent {
  final apiToken;
  Authcheck(
  {
    required this.apiToken
  });
}