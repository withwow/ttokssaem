import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/withdraw_model.dart';

@immutable
abstract class WithdrawState {}

class WithdrawInitial extends WithdrawState {}

class InitialWithdrawState extends WithdrawState {}

class WithdrawError extends WithdrawState {
  final String errorMessage;

  WithdrawError({
    required this.errorMessage,
  });
}

class WithdrawWaiting extends WithdrawState {}

class WithdrawSuccess extends WithdrawState {
  final WithdrawModel withdrawData;
  WithdrawSuccess({required this.withdrawData});
}