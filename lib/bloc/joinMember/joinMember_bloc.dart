import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/joinMember_model.dart';

import './bloc.dart';

class JoinMemberBloc extends Bloc<JoinMemberEvent, JoinMemberState> {
  JoinMemberBloc() : super(JoinMemberInitial()){
    on<JoinMember>(_joinMember);
  }
}

void _joinMember(JoinMember event, Emitter<JoinMemberState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(JoinMemberWaiting());
  try {
    JoinMemberModel data = await _apiProvider.joinMember(
        event.branchid,
        event.memberid,
        event.memberpw,
        event.type,
        event.membername,
        event.schoolname,
        event.grade,
        event.gender,
        event.contact,
        event.email,
        event.pushtoken,
        event.apiToken);
    emit(JoinMemberSuccess(joinMemberData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(JoinMemberError(errorMessage: ex.toString()));
    }
  }
}