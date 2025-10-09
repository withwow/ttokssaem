import 'package:meta/meta.dart';

@immutable
abstract class TodayStudyPlanListEvent {}

class TodayStudyPlanList extends TodayStudyPlanListEvent {
  final String targetid;
  final String plandate;
  final apiToken;
  TodayStudyPlanList(
  {
    required this.targetid,
    required this.plandate,
    required this.apiToken
  });
}