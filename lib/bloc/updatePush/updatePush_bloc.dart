import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/updatePush_model.dart';

import './bloc.dart';

class UpdatePushBloc extends Bloc<UpdatePushEvent, UpdatePushState> {
  UpdatePushBloc() : super(UpdatePushInitial()){
    on<UpdatePush>(_updatePush);
  }
}

void _updatePush(UpdatePush event, Emitter<UpdatePushState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(UpdatePushWaiting());
  try {
    UpdatePushModel data = await _apiProvider.updatePush(
        event.push,
        event.apiToken);
    emit(UpdatePushSuccess(updatePushData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(UpdatePushError(errorMessage: ex.toString()));
    }
  }
}