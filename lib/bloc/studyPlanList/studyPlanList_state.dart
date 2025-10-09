import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/studyPlanList_model.dart';

@immutable
abstract class StudyPlanListState {}

class StudyPlanListInitial extends StudyPlanListState {}

class InitialStudyPlanListState extends StudyPlanListState {}

class StudyPlanListError extends StudyPlanListState {
  final String errorMessage;

  StudyPlanListError({
    required this.errorMessage,
  });
}

class StudyPlanListWaiting extends StudyPlanListState {}

class StudyPlanListSuccess extends StudyPlanListState {
  final StudyPlanListModel studyPlanListData;
  StudyPlanListSuccess({required this.studyPlanListData});
}