import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/todayStudyPlanList_model.dart';

@immutable
abstract class RegStudyPlanListEvent {}

class RegStudyPlanList extends RegStudyPlanListEvent {
  final String plandate;
  final List<TodayStudyPlanDataModel> lists;
  final apiToken;
  RegStudyPlanList(
  {
    required this.plandate,
    required this.lists,
    required this.apiToken
  });
}