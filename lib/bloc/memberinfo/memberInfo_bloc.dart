import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/memberInfo_model.dart';

import './bloc.dart';

class MemberInfoBloc extends Bloc<MemberInfoEvent, MemberInfoState> {
  MemberInfoBloc() : super(MemberInfoInitial()){
    on<MemberInfo>(_memberInfo);
  }
}

void _memberInfo(MemberInfo event, Emitter<MemberInfoState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(MemberInfoWaiting());
  try {
    MemberInfoModel data = await _apiProvider.memberInfo(event.apiToken);
    emit(MemberInfoSuccess(memberInfoData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(MemberInfoError(errorMessage: ex.toString()));
    }
  }
}