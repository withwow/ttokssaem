import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/selStudentList_model.dart';

import './bloc.dart';

class SelStudentListBloc extends Bloc<SelStudentListEvent, SelStudentListState> {
  SelStudentListBloc() : super(SelStudentListInitial()){
    on<SelStudentList>(_selStudentList);
  }
}

void _selStudentList(SelStudentList event, Emitter<SelStudentListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(SelStudentListWaiting());
  try {
    SelStudentListModel data = await _apiProvider.selStudentList(
        event.apiToken);
    emit(SelStudentListSuccess(selStudentListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(SelStudentListError(errorMessage: ex.toString()));
    }
  }
}