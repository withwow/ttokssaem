import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/todayStudyPlanList_model.dart';

@immutable
abstract class TodayStudyPlanListState {}

class TodayStudyPlanListInitial extends TodayStudyPlanListState {}

class InitialTodayStudyPlanListState extends TodayStudyPlanListState {}

class TodayStudyPlanListError extends TodayStudyPlanListState {
  final String errorMessage;

  TodayStudyPlanListError({
    required this.errorMessage,
  });
}

class TodayStudyPlanListWaiting extends TodayStudyPlanListState {}

class TodayStudyPlanListSuccess extends TodayStudyPlanListState {
  final TodayStudyPlanListModel todayStudyPlanListData;
  TodayStudyPlanListSuccess({required this.todayStudyPlanListData});
}