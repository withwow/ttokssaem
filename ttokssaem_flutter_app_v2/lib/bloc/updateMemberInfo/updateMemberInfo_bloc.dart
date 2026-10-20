import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/updateMemberInfo_model.dart';

import './bloc.dart';

class UpdateMemberInfoBloc extends Bloc<UpdateMemberInfoEvent, UpdateMemberInfoState> {
  UpdateMemberInfoBloc() : super(UpdateMemberInfoInitial()){
    on<UpdateMemberInfo>(_updateMemberInfo);
  }
}

void _updateMemberInfo(UpdateMemberInfo event, Emitter<UpdateMemberInfoState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(UpdateMemberInfoWaiting());
  try {
    UpdateMemberInfoModel data = await _apiProvider.updateMemberInfo(
        event.memberpw,
        event.membername,
        event.contact,
        event.email,
        event.apiToken);
    emit(UpdateMemberInfoSuccess(updateMemberInfoData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(UpdateMemberInfoError(errorMessage: ex.toString()));
    }
  }
}