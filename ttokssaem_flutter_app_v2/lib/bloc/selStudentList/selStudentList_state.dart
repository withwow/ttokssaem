import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/selStudentList_model.dart';

@immutable
abstract class SelStudentListState {}

class SelStudentListInitial extends SelStudentListState {}

class InitialSelStudentListState extends SelStudentListState {}

class SelStudentListError extends SelStudentListState {
  final String errorMessage;

  SelStudentListError({
    required this.errorMessage,
  });
}

class SelStudentListWaiting extends SelStudentListState {}

class SelStudentListSuccess extends SelStudentListState {
  final SelStudentListModel selStudentListData;
  SelStudentListSuccess({required this.selStudentListData});
}