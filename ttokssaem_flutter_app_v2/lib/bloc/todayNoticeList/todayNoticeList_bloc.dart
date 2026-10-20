import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';

import './bloc.dart';

class TodayNoticeListBloc extends Bloc<TodayNoticeListEvent, TodayNoticeListState> {
  TodayNoticeListBloc() : super(TodayNoticeListInitial()){
    on<TodayNoticeList>(_todayNoticeList);
  }
}

void _todayNoticeList(TodayNoticeList event, Emitter<TodayNoticeListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(TodayNoticeListWaiting());
  try {
    NoticeListModel data = await _apiProvider.todayNoticeList(
        event.apiToken);
    emit(TodayNoticeListSuccess(noticeListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(TodayNoticeListError(errorMessage: ex.toString()));
    }
  }
}