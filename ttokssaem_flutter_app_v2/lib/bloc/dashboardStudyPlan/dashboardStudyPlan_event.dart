import 'package:meta/meta.dart';

@immutable
abstract class DashboardStudyPlanEvent {}

class DashboardStudyPlan extends DashboardStudyPlanEvent {

  final targetid;
  final apiToken;
  DashboardStudyPlan(
  {
    required this.targetid,
    required this.apiToken
  });
}