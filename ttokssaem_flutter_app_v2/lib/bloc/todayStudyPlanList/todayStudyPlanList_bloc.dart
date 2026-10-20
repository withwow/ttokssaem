import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/todayStudyPlanList_model.dart';

import './bloc.dart';

class TodayStudyPlanListBloc extends Bloc<TodayStudyPlanListEvent, TodayStudyPlanListState> {
  TodayStudyPlanListBloc() : super(TodayStudyPlanListInitial()){
    on<TodayStudyPlanList>(_todayStudyPlanList);
  }
}

void _todayStudyPlanList(TodayStudyPlanList event, Emitter<TodayStudyPlanListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(TodayStudyPlanListWaiting());
  try {
    TodayStudyPlanListModel data = await _apiProvider.todayStudyPlanList(
        event.targetid,
        event.plandate,
        event.apiToken);
    emit(TodayStudyPlanListSuccess(todayStudyPlanListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(TodayStudyPlanListError(errorMessage: ex.toString()));
    }
  }
}