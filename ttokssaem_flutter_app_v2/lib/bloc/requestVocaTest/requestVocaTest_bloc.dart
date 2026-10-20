import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/requestVocaTest_model.dart';

import './bloc.dart';

class RequestVocaTestBloc extends Bloc<RequestVocaTestEvent, RequestVocaTestState> {
  RequestVocaTestBloc() : super(RequestVocaTestInitial()){
    on<RequestVocaTest>(_requestVocaTest);
  }
}

void _requestVocaTest(RequestVocaTest event, Emitter<RequestVocaTestState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(RequestVocaTestWaiting());
  try {
    RequestVocaTestModel data = await _apiProvider.requestVocaTest(
        event.memodate,
        event.apiToken);
    emit(RequestVocaTestSuccess(requestVocaTestData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(RequestVocaTestError(errorMessage: ex.toString()));
    }
  }
}