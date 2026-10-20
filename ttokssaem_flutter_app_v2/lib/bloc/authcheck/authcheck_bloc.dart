import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/authcheck_model.dart';

import './bloc.dart';

class AuthcheckBloc extends Bloc<AuthcheckEvent, AuthcheckState> {
  AuthcheckBloc() : super(AuthcheckInitial()){
    on<Authcheck>(_authcheck);
  }
}


void _authcheck(Authcheck event, Emitter<AuthcheckState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(AuthcheckWaiting());
  try {
    AuthcheckModel data = await _apiProvider.authcheck(event.apiToken);
    emit(AuthcheckSuccess(authcheckData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(AuthcheckError(errorMessage: ex.toString()));
    }
  }
}