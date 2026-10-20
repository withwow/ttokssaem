import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/selVocaTestList_model.dart';

@immutable
abstract class SelVocaTestListState {}

class SelVocaTestListInitial extends SelVocaTestListState {}

class InitialSelVocaTestListState extends SelVocaTestListState {}

class SelVocaTestListError extends SelVocaTestListState {
  final String errorMessage;

  SelVocaTestListError({
    required this.errorMessage,
  });
}

class SelVocaTestListWaiting extends SelVocaTestListState {}

class SelVocaTestListSuccess extends SelVocaTestListState {
  final SelVocaTestListModel selVocaTestListData;
  SelVocaTestListSuccess({required this.selVocaTestListData});
}