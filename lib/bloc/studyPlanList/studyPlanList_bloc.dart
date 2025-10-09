import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/studyPlanList_model.dart';

import './bloc.dart';

class StudyPlanListBloc extends Bloc<StudyPlanListEvent, StudyPlanListState> {
  StudyPlanListBloc() : super(StudyPlanListInitial()){
    on<StudyPlanList>(_studyPlanList);
  }
}

void _studyPlanList(StudyPlanList event, Emitter<StudyPlanListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(StudyPlanListWaiting());
  try {
    StudyPlanListModel data = await _apiProvider.studyPlanList(
        event.targetid,
        event.plandate,
        event.apiToken);
    emit(StudyPlanListSuccess(studyPlanListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(StudyPlanListError(errorMessage: ex.toString()));
    }
  }
}