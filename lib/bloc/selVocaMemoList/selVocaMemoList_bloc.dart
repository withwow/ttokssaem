import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/selVocaMemoList_model.dart';

import './bloc.dart';

class SelVocaMemoListBloc extends Bloc<SelVocaMemoListEvent, SelVocaMemoListState> {
  SelVocaMemoListBloc() : super(SelVocaMemoListInitial()){
    on<SelVocaMemoList>(_selVocaMemoList);
  }
}

void _selVocaMemoList(SelVocaMemoList event, Emitter<SelVocaMemoListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(SelVocaMemoListWaiting());
  try {
    SelVocaMemoListModel data = await _apiProvider.selVocaMemoList(
        event.page,
        event.length,
        event.memodate,
        event.apiToken);
    emit(SelVocaMemoListSuccess(selVocaMemoListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(SelVocaMemoListError(errorMessage: ex.toString()));
    }
  }
}