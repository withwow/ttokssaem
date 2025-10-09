import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/finishVocaTest_model.dart';

import './bloc.dart';

class FinishVocaTestBloc extends Bloc<FinishVocaTestEvent, FinishVocaTestState> {
  FinishVocaTestBloc() : super(FinishVocaTestInitial()){
    on<FinishVocaTest>(_finishVocaTest);
  }
}

void _finishVocaTest(FinishVocaTest event, Emitter<FinishVocaTestState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(FinishVocaTestWaiting());
  try {
    FinishVocaTestModel data = await _apiProvider.finishVocaTest(
        event.memodate,
        event.degree,
        event.lists,
        event.apiToken);
    emit(FinishVocaTestSuccess(finishVocaTestData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(FinishVocaTestError(errorMessage: ex.toString()));
    }
  }
}