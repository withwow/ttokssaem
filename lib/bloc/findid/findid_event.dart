import 'package:meta/meta.dart';

@immutable
abstract class FindidEvent {}

class Findid extends FindidEvent {
  final String membername;
  final String contact;
  final apiToken;
  Findid(
      {
        required this.membername,
        required this.contact,
        required this.apiToken
      });
}