import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/updatePassword_model.dart';

@immutable
abstract class UpdatePasswordState {}

class UpdatePasswordInitial extends UpdatePasswordState {}

class InitialUpdatePasswordState extends UpdatePasswordState {}

class UpdatePasswordError extends UpdatePasswordState {
  final String errorMessage;

  UpdatePasswordError({
    required this.errorMessage,
  });
}

class UpdatePasswordWaiting extends UpdatePasswordState {}

class UpdatePasswordSuccess extends UpdatePasswordState {
  final UpdatePasswordModel updatePasswordData;
  UpdatePasswordSuccess({required this.updatePasswordData});
}