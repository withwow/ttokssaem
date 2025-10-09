import 'package:meta/meta.dart';

@immutable
abstract class WithdrawEvent {}

class Withdraw extends WithdrawEvent {
  final String memberpw;
  final apiToken;
  Withdraw(
  {
    required this.memberpw,
    required this.apiToken
  });
}