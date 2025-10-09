import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/m2mList_model.dart';

@immutable
abstract class M2mListState {}

class M2mListInitial extends M2mListState {}

class InitialM2mListState extends M2mListState {}

class M2mListError extends M2mListState {
  final String errorMessage;

  M2mListError({
    required this.errorMessage,
  });
}

class M2mListWaiting extends M2mListState {}

class M2mListSuccess extends M2mListState {
  final M2mListModel m2mListData;
  M2mListSuccess({required this.m2mListData});
}