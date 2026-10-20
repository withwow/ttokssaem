import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/selVocaTestList_model.dart';

import './bloc.dart';

class SelVocaTestListBloc extends Bloc<SelVocaTestListEvent, SelVocaTestListState> {
  SelVocaTestListBloc() : super(SelVocaTestListInitial()){
    on<SelVocaTestList>(_selVocaTestList);
  }
}

void _selVocaTestList(SelVocaTestList event, Emitter<SelVocaTestListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(SelVocaTestListWaiting());
  try {
    SelVocaTestListModel data = await _apiProvider.selVocaTestList(
        event.page,
        event.length,
        event.memodate,
        event.apiToken);
    emit(SelVocaTestListSuccess(selVocaTestListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(SelVocaTestListError(errorMessage: ex.toString()));
    }
  }
}