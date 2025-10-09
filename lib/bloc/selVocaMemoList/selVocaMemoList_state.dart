import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/selVocaMemoList_model.dart';

@immutable
abstract class SelVocaMemoListState {}

class SelVocaMemoListInitial extends SelVocaMemoListState {}

class InitialSelVocaMemoListState extends SelVocaMemoListState {}

class SelVocaMemoListError extends SelVocaMemoListState {
  final String errorMessage;

  SelVocaMemoListError({
    required this.errorMessage,
  });
}

class SelVocaMemoListWaiting extends SelVocaMemoListState {}

class SelVocaMemoListSuccess extends SelVocaMemoListState {
  final SelVocaMemoListModel selVocaMemoListData;
  SelVocaMemoListSuccess({required this.selVocaMemoListData});
}