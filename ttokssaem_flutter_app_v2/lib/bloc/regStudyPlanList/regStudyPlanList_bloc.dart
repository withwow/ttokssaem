import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/regStudyPlanList_model.dart';

import './bloc.dart';

class RegStudyPlanListBloc extends Bloc<RegStudyPlanListEvent, RegStudyPlanListState> {
  RegStudyPlanListBloc() : super(RegStudyPlanListInitial()){
    on<RegStudyPlanList>(_regStudyPlanList);
  }
}

void _regStudyPlanList(RegStudyPlanList event, Emitter<RegStudyPlanListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(RegStudyPlanListWaiting());
  try {
    RegStudyPlanListModel data = await _apiProvider.regStudyPlanList(
        event.plandate,
        event.lists,
        event.apiToken);
    emit(RegStudyPlanListSuccess(regStudyPlanListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(RegStudyPlanListError(errorMessage: ex.toString()));
    }
  }
}