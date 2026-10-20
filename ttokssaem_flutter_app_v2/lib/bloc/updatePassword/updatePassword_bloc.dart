import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/updatePassword_model.dart';

import './bloc.dart';

class UpdatePasswordBloc extends Bloc<UpdatePasswordEvent, UpdatePasswordState> {
  UpdatePasswordBloc() : super(UpdatePasswordInitial()){
    on<UpdatePassword>(_updatePassword);
  }
}

void _updatePassword(UpdatePassword event, Emitter<UpdatePasswordState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(UpdatePasswordWaiting());
  try {
    UpdatePasswordModel data = await _apiProvider.updatePassword(
        event.cur_pw,
        event.after_pw,
        event.apiToken);
    emit(UpdatePasswordSuccess(updatePasswordData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(UpdatePasswordError(errorMessage: ex.toString()));
    }
  }
}