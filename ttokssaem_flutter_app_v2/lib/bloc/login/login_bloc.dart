import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/login_model.dart';

import './bloc.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  LoginBloc() : super(LoginInitial()){
    on<Login>(_login);
  }
}

void _login(Login event, Emitter<LoginState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(LoginWaiting());
  try {
    LoginModel data = await _apiProvider.login(
        event.memberid,
        event.memberpw,
        event.os,
        event.pushtoken,
        event.apiToken);
    emit(LoginSuccess(loginData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(LoginError(errorMessage: ex.toString()));
    }
  }
}