import 'package:meta/meta.dart';

@immutable
abstract class UpdateMemberInfoEvent {}

class UpdateMemberInfo extends UpdateMemberInfoEvent {
  final String memberpw;
  final String membername;
  final String contact;
  final String email;
  final apiToken;
  UpdateMemberInfo(
  {
    required this.memberpw,
    required this.membername,
    required this.contact,
    required this.email,
    required this.apiToken
  });
}