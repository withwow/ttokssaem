import 'package:meta/meta.dart';

@immutable
abstract class SelStudentListEvent {}

class SelStudentList extends SelStudentListEvent {
  final apiToken;
  SelStudentList(
  {
    required this.apiToken
  });
}