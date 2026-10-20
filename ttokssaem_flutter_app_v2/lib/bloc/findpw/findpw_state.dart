import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/findpw_model.dart';

@immutable
abstract class FindpwState {}

class FindpwInitial extends FindpwState {}

class InitialFindpwState extends FindpwState {}

class FindpwError extends FindpwState {
  final String errorMessage;

  FindpwError({
    required this.errorMessage,
  });
}

class FindpwWaiting extends FindpwState {}

class FindpwSuccess extends FindpwState {
  final FindpwModel findpwData;
  FindpwSuccess({required this.findpwData});
}