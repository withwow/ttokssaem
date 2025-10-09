import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/m2mList_model.dart';

import './bloc.dart';

class M2mListBloc extends Bloc<M2mListEvent, M2mListState> {
  M2mListBloc() : super(M2mListInitial()){
    on<M2mList>(_m2mList);
  }
}

void _m2mList(M2mList event, Emitter<M2mListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(M2mListWaiting());
  try {
    M2mListModel data = await _apiProvider.m2mList(
        event.page,
        event.length,
        event.apiToken);
    emit(M2mListSuccess(m2mListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(M2mListError(errorMessage: ex.toString()));
    }
  }
}