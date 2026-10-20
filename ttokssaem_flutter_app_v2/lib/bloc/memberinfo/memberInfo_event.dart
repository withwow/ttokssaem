import 'package:meta/meta.dart';

@immutable
abstract class MemberInfoEvent {}

class MemberInfo extends MemberInfoEvent {
  final apiToken;
  MemberInfo(
  {
    required this.apiToken,
  });
}