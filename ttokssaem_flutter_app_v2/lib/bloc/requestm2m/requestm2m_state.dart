import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/requestm2m_model.dart';

@immutable
abstract class RequestM2MState {}

class RequestM2MInitial extends RequestM2MState {}

class InitialRequestM2MState extends RequestM2MState {}

class RequestM2MError extends RequestM2MState {
  final String errorMessage;

  RequestM2MError({
    required this.errorMessage,
  });
}

class RequestM2MWaiting extends RequestM2MState {}

class RequestM2MSuccess extends RequestM2MState {
  final RequestM2MModel requestM2MData;
  RequestM2MSuccess({required this.requestM2MData});
}