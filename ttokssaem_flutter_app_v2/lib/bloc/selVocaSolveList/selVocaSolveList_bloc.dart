import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/selVocaSolveList_model.dart';

import './bloc.dart';

class SelVocaSolveListBloc extends Bloc<SelVocaSolveListEvent, SelVocaSolveListState> {
  SelVocaSolveListBloc() : super(SelVocaSolveListInitial()){
    on<SelVocaSolveList>(_selVocaSolveList);
  }
}

void _selVocaSolveList(SelVocaSolveList event, Emitter<SelVocaSolveListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(SelVocaSolveListWaiting());
  try {
    SelVocaSolveListModel data = await _apiProvider.selVocaSolveList(
        event.page,
        event.length,
        event.memodate,
        event.apiToken);
    emit(SelVocaSolveListSuccess(selVocaSolveListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(SelVocaSolveListError(errorMessage: ex.toString()));
    }
  }
}