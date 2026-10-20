import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/findid_model.dart';

@immutable
abstract class FindidState {}

class FindidInitial extends FindidState {}

class InitialFindidState extends FindidState {}

class FindidError extends FindidState {
  final String errorMessage;

  FindidError({
    required this.errorMessage,
  });
}

class FindidWaiting extends FindidState {}

class FindidSuccess extends FindidState {
  final FindidModel findidData;
  FindidSuccess({required this.findidData});
}