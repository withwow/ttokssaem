import 'package:meta/meta.dart';

@immutable
abstract class LoginEvent {}

class Login extends LoginEvent {
  final String memberid;
  final String memberpw;
  final String os;
  final String pushtoken;
  final apiToken;
  Login(
  {
    required this.memberid,
    required this.memberpw,
    required this.os,
    required this.pushtoken,
    required this.apiToken
  });
}