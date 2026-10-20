import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/withdraw_model.dart';

import './bloc.dart';

class WithdrawBloc extends Bloc<WithdrawEvent, WithdrawState> {
  WithdrawBloc() : super(WithdrawInitial()){
    on<Withdraw>(_withdraw);
  }
}

void _withdraw(Withdraw event, Emitter<WithdrawState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(WithdrawWaiting());
  try {
    WithdrawModel data = await _apiProvider.withdraw(
        event.memberpw,
        event.apiToken);
    emit(WithdrawSuccess(withdrawData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(WithdrawError(errorMessage: ex.toString()));
    }
  }
}