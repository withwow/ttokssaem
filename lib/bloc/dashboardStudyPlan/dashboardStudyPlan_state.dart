import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/dashboardStudyPlan_model.dart';

@immutable
abstract class DashboardStudyPlanState {}

class DashboardStudyPlanInitial extends DashboardStudyPlanState {}

class InitialDashboardStudyPlanState extends DashboardStudyPlanState {}

class DashboardStudyPlanError extends DashboardStudyPlanState {
  final String errorMessage;

  DashboardStudyPlanError({
    required this.errorMessage,
  });
}

class DashboardStudyPlanWaiting extends DashboardStudyPlanState {}

class DashboardStudyPlanSuccess extends DashboardStudyPlanState {
  final DashboardStudyPlanModel dashboardStudyPlanData;
  DashboardStudyPlanSuccess({required this.dashboardStudyPlanData});
}