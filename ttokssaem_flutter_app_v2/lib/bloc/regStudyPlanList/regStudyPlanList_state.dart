import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/regStudyPlanList_model.dart';

@immutable
abstract class RegStudyPlanListState {}

class RegStudyPlanListInitial extends RegStudyPlanListState {}

class InitialRegStudyPlanListState extends RegStudyPlanListState {}

class RegStudyPlanListError extends RegStudyPlanListState {
  final String errorMessage;

  RegStudyPlanListError({
    required this.errorMessage,
  });
}

class RegStudyPlanListWaiting extends RegStudyPlanListState {}

class RegStudyPlanListSuccess extends RegStudyPlanListState {
  final RegStudyPlanListModel regStudyPlanListData;
  RegStudyPlanListSuccess({required this.regStudyPlanListData});
}