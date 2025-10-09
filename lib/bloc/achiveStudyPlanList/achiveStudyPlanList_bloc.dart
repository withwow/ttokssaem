import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/achiveStudyPlanList_model.dart';

import './bloc.dart';

class AchiveStudyPlanListBloc extends Bloc<AchiveStudyPlanListEvent, AchiveStudyPlanListState> {
  AchiveStudyPlanListBloc() : super(AchiveStudyPlanListInitial()){
    on<AchiveStudyPlanList>(_achiveStudyPlanList);
  }
}

void _achiveStudyPlanList(AchiveStudyPlanList event, Emitter<AchiveStudyPlanListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(AchiveStudyPlanListWaiting());
  try {
    AchiveStudyPlanListModel data = await _apiProvider.achiveStudyPlanList(
        event.targetid,
        event.page,
        event.length,
        event.apiToken);
    emit(AchiveStudyPlanListSuccess(achiveStudyPlanListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(AchiveStudyPlanListError(errorMessage: ex.toString()));
    }
  }
}