import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/appChecker_model.dart';

import './bloc.dart';

class AppCheckerBloc extends Bloc<AppCheckerEvent, AppCheckerState> {
  AppCheckerBloc() : super(AppCheckerInitial()){
    on<AppChecker>(_appChecker);
  }
}

void _appChecker(AppChecker event, Emitter<AppCheckerState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(AppCheckerWaiting());
  try {
    AppCheckerModel data = await _apiProvider.appChecker(
        event.device,
        event.lists,
        event.apiToken);
    emit(AppCheckerSuccess(appCheckerData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(AppCheckerError(errorMessage: ex.toString()));
    }
  }
}