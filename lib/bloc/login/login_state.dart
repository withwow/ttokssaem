import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/login_model.dart';

@immutable
abstract class LoginState {}

class LoginInitial extends LoginState {}

class InitialLoginState extends LoginState {}

class LoginError extends LoginState {
  final String errorMessage;

  LoginError({
    required this.errorMessage,
  });
}

class LoginWaiting extends LoginState {}

class LoginSuccess extends LoginState {
  final LoginModel loginData;
  LoginSuccess({required this.loginData});
}