import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/authcheck_model.dart';

@immutable
abstract class AuthcheckState {}

class AuthcheckInitial extends AuthcheckState {}

class InitialAuthcheckState extends AuthcheckState {}

class AuthcheckError extends AuthcheckState {
  final String errorMessage;

  AuthcheckError({
    required this.errorMessage,
  });
}

class AuthcheckWaiting extends AuthcheckState {}

class AuthcheckSuccess extends AuthcheckState {
  final AuthcheckModel authcheckData;
  AuthcheckSuccess({required this.authcheckData});
}