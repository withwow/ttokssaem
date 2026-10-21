import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/model/penaltyDetail_model.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import './bloc.dart';

class PenaltyDetailBloc extends Bloc<PenaltyDetailEvent, PenaltyDetailState> {
  PenaltyDetailBloc() : super(PenaltyDetailInitial()) {
    on<SelPenaltyDetail>(_selPenaltyDetail);
  }
}

void _selPenaltyDetail(
    SelPenaltyDetail event, Emitter<PenaltyDetailState> emit) async {
  emit(PenaltyDetailWaiting());
  try {
    final PenaltyDetailModel data = await ApiProvider().selPenaltyDetail(
        event.targetid, event.page, event.length, event.apiToken);
    emit(PenaltyDetailSuccess(
        penaltyDetailData: data, requestId: event.requestId));
  } catch (ex) {
    if (ex != 'cancel') {
      emit(PenaltyDetailError(
          errorMessage: ex.toString(), requestId: event.requestId));
    }
  }
}
