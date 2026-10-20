import 'package:meta/meta.dart';

@immutable
abstract class StudyPlanListEvent {}

class StudyPlanList extends StudyPlanListEvent {
  final String targetid;
  final String plandate;
  final apiToken;
  StudyPlanList(
  {
    required this.targetid,
    required this.plandate,
    required this.apiToken
  });
}