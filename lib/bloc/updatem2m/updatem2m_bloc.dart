import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/updatem2m_model.dart';

import './bloc.dart';

class UpdateM2MBloc extends Bloc<UpdateM2MEvent, UpdateM2MState> {
  UpdateM2MBloc() : super(UpdateM2MInitial()){
    on<UpdateM2M>(_updateM2M);
  }
}

void _updateM2M(UpdateM2M event, Emitter<UpdateM2MState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(UpdateM2MWaiting());
  try {
    UpdateM2MModel data = await _apiProvider.updateM2M(
        event.m2mid,
        event.question,
        event.method,
        event.apiToken);
    emit(UpdateM2MSuccess(updateM2MData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(UpdateM2MError(errorMessage: ex.toString()));
    }
  }
}