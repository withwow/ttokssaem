import 'package:bloc/bloc.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';

import './bloc.dart';

class NoticeListBloc extends Bloc<NoticeListEvent, NoticeListState> {
  NoticeListBloc() : super(NoticeListInitial()){
    on<NoticeList>(_noticeList);
  }
}

void _noticeList(NoticeList event, Emitter<NoticeListState> emit) async {
  ApiProvider _apiProvider = ApiProvider();

  emit(NoticeListWaiting());
  try {
    NoticeListModel data = await _apiProvider.noticeList(
        event.page,
        event.length,
        event.apiToken);
    emit(NoticeListSuccess(noticeListData: data));
  } catch (ex){
    if(ex != 'cancel'){
      emit(NoticeListError(errorMessage: ex.toString()));
    }
  }
}