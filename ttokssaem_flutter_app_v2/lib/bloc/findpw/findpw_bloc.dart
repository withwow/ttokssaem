import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/findpw_model.dart';

import './bloc.dart';

class FindpwBloc extends Bloc<FindpwEvent, FindpwState> {
  FindpwBloc() : super(FindpwInitial()){
    on<Findpw>(_findpw);
  }
}


void _findpw(Findpw event, Emitter<FindpwState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(FindpwWaiting());
  try {
    FindpwModel data = await _apiProvider.findpw(event.memberid, event.membername, event.contact, event.apiToken);
    emit(FindpwSuccess(findpwData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(FindpwError(errorMessage: ex.toString()));
    }
  }
}