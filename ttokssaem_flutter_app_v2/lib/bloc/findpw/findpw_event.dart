import 'package:meta/meta.dart';

@immutable
abstract class FindpwEvent {}

class Findpw extends FindpwEvent {
  final String memberid;
  final String membername;
  final String contact;
  final apiToken;
  Findpw(
      {
        required this.memberid,
        required this.membername,
        required this.contact,
        required this.apiToken
      });
}