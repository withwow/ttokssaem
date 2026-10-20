import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/findid_model.dart';

import './bloc.dart';

class FindidBloc extends Bloc<FindidEvent, FindidState> {
  FindidBloc() : super(FindidInitial()){
    on<Findid>(_findid);
  }
}


void _findid(Findid event, Emitter<FindidState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(FindidWaiting());
  try {
    FindidModel data = await _apiProvider.findid(event.membername, event.contact, event.apiToken);
    emit(FindidSuccess(findidData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(FindidError(errorMessage: ex.toString()));
    }
  }
}