import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/dashboardStudyPlan_model.dart';

import './bloc.dart';

class DashboardStudyPlanBloc extends Bloc<DashboardStudyPlanEvent, DashboardStudyPlanState> {
  DashboardStudyPlanBloc() : super(DashboardStudyPlanInitial()){
    on<DashboardStudyPlan>(_dashboardStudyPlan);
  }
}

void _dashboardStudyPlan(DashboardStudyPlan event, Emitter<DashboardStudyPlanState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(DashboardStudyPlanWaiting());
  try {
    DashboardStudyPlanModel data = await _apiProvider.dashboardStudyPlan(
        event.targetid,
        event.apiToken);
    emit(DashboardStudyPlanSuccess(dashboardStudyPlanData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(DashboardStudyPlanError(errorMessage: ex.toString()));
    }
  }
}