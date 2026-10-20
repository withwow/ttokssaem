import 'package:meta/meta.dart';

@immutable
abstract class UpdatePasswordEvent {}

class UpdatePassword extends UpdatePasswordEvent {
  final String cur_pw;
  final String after_pw;
  final apiToken;
  UpdatePassword(
  {
    required this.cur_pw,
    required this.after_pw,
    required this.apiToken
  });
}