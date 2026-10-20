import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/updatem2m_model.dart';

@immutable
abstract class UpdateM2MState {}

class UpdateM2MInitial extends UpdateM2MState {}

class InitialUpdateM2MState extends UpdateM2MState {}

class UpdateM2MError extends UpdateM2MState {
  final String errorMessage;

  UpdateM2MError({
    required this.errorMessage,
  });
}

class UpdateM2MWaiting extends UpdateM2MState {}

class UpdateM2MSuccess extends UpdateM2MState {
  final UpdateM2MModel updateM2MData;
  UpdateM2MSuccess({required this.updateM2MData});
}