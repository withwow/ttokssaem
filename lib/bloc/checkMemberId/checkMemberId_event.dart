import 'package:meta/meta.dart';

@immutable
abstract class CheckMemberIdEvent {}

class CheckMemberId extends CheckMemberIdEvent {
  final String memberid;
  final apiToken;
  CheckMemberId(
  {
    required this.memberid,
    required this.apiToken
  });
}