import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/requestm2m_model.dart';

import './bloc.dart';

class RequestM2MBloc extends Bloc<RequestM2MEvent, RequestM2MState> {
  RequestM2MBloc() : super(RequestM2MInitial()){
    on<RequestM2M>(_requestM2M);
  }
}

void _requestM2M(RequestM2M event, Emitter<RequestM2MState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(RequestM2MWaiting());
  try {
    RequestM2MModel data = await _apiProvider.requestM2M(
        event.message,
        event.apiToken);
    emit(RequestM2MSuccess(requestM2MData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(RequestM2MError(errorMessage: ex.toString()));
    }
  }
}