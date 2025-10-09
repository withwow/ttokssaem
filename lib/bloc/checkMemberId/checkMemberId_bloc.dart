import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/checkMemberId_model.dart';

import './bloc.dart';

class CheckMemberIdBloc extends Bloc<CheckMemberIdEvent, CheckMemberIdState> {
  CheckMemberIdBloc() : super(CheckMemberIdInitial()){
    on<CheckMemberId>(_checkMemberId);
  }
}

void _checkMemberId(CheckMemberId event, Emitter<CheckMemberIdState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(CheckMemberIdWaiting());
  try {
    CheckMemberIdModel data = await _apiProvider.checkMemberId(
        event.memberid,
        event.apiToken);
    emit(CheckMemberIdSuccess(checkMemberIdData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(CheckMemberIdError(errorMessage: ex.toString()));
    }
  }
}