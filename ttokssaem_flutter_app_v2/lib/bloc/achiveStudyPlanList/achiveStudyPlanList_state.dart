import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/achiveStudyPlanList_model.dart';

@immutable
abstract class AchiveStudyPlanListState {}

class AchiveStudyPlanListInitial extends AchiveStudyPlanListState {}

class InitialAchiveStudyPlanListState extends AchiveStudyPlanListState {}

class AchiveStudyPlanListError extends AchiveStudyPlanListState {
  final String errorMessage;

  AchiveStudyPlanListError({
    required this.errorMessage,
  });
}

class AchiveStudyPlanListWaiting extends AchiveStudyPlanListState {}

class AchiveStudyPlanListSuccess extends AchiveStudyPlanListState {
  final AchiveStudyPlanListModel achiveStudyPlanListData;
  AchiveStudyPlanListSuccess({required this.achiveStudyPlanListData});
}