import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/selVocaHistList_model.dart';

import './bloc.dart';

class SelVocaHistListBloc extends Bloc<SelVocaHistListEvent, SelVocaHistListState> {
  SelVocaHistListBloc() : super(SelVocaHistListInitial()){
    on<SelVocaHistList>(_selVocaHistList);
  }
}

void _selVocaHistList(SelVocaHistList event, Emitter<SelVocaHistListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(SelVocaHistListWaiting());
  try {
    SelVocaHistListModel data = await _apiProvider.selVocaHistList(
        event.page,
        event.length,
        event.targetid,
        event.apiToken);
    emit(SelVocaHistListSuccess(selVocaHistListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(SelVocaHistListError(errorMessage: ex.toString()));
    }
  }
}