import 'package:meta/meta.dart';

@immutable
abstract class JoinMemberEvent {}

class JoinMember extends JoinMemberEvent {
  final String branchid;
  final String memberid;
  final String memberpw;
  final String type;
  final String membername;
  final String schoolname;
  final String grade;
  final String gender;
  final String contact;
  final String email;
  final String pushtoken;
  final apiToken;
  JoinMember(
  {
    required this.branchid,
    required this.memberid,
    required this.memberpw,
    required this.type,
    required this.membername,
    required this.schoolname,
    required this.grade,
    required this.gender,
    required this.contact,
    required this.email,
    required this.pushtoken,
    required this.apiToken
  });
}