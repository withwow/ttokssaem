import 'package:meta/meta.dart';

@immutable
abstract class AchiveStudyPlanListEvent {}

class AchiveStudyPlanList extends AchiveStudyPlanListEvent {

  final targetid;
  final int page;
  final int length;
  final apiToken;
  AchiveStudyPlanList(
  {
    required this.targetid,
    required this.page,
    required this.length,
    required this.apiToken
  });
}