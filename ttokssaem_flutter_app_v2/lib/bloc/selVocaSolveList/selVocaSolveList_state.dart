import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/selVocaSolveList_model.dart';

@immutable
abstract class SelVocaSolveListState {}

class SelVocaSolveListInitial extends SelVocaSolveListState {}

class InitialSelVocaSolveListState extends SelVocaSolveListState {}

class SelVocaSolveListError extends SelVocaSolveListState {
  final String errorMessage;

  SelVocaSolveListError({
    required this.errorMessage,
  });
}

class SelVocaSolveListWaiting extends SelVocaSolveListState {}

class SelVocaSolveListSuccess extends SelVocaSolveListState {
  final SelVocaSolveListModel selVocaSolveListData;
  SelVocaSolveListSuccess({required this.selVocaSolveListData});
}