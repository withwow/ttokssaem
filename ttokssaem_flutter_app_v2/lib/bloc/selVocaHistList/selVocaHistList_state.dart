import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/selVocaHistList_model.dart';

@immutable
abstract class SelVocaHistListState {}

class SelVocaHistListInitial extends SelVocaHistListState {}

class InitialSelVocaHistListState extends SelVocaHistListState {}

class SelVocaHistListError extends SelVocaHistListState {
  final String errorMessage;

  SelVocaHistListError({
    required this.errorMessage,
  });
}

class SelVocaHistListWaiting extends SelVocaHistListState {}

class SelVocaHistListSuccess extends SelVocaHistListState {
  final SelVocaHistListModel selVocaHistListData;
  SelVocaHistListSuccess({required this.selVocaHistListData});
}