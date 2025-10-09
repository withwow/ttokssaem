import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/checkMemberId_model.dart';

@immutable
abstract class CheckMemberIdState {}

class CheckMemberIdInitial extends CheckMemberIdState {}

class InitialCheckMemberIdState extends CheckMemberIdState {}

class CheckMemberIdError extends CheckMemberIdState {
  final String errorMessage;

  CheckMemberIdError({
    required this.errorMessage,
  });
}

class CheckMemberIdWaiting extends CheckMemberIdState {}

class CheckMemberIdSuccess extends CheckMemberIdState {
  final CheckMemberIdModel checkMemberIdData;
  CheckMemberIdSuccess({required this.checkMemberIdData});
}