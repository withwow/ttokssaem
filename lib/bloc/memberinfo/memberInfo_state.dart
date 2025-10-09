import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/memberInfo_model.dart';

@immutable
abstract class MemberInfoState {}

class MemberInfoInitial extends MemberInfoState {}

class InitialMemberInfoState extends MemberInfoState {}

class MemberInfoError extends MemberInfoState {
  final String errorMessage;

  MemberInfoError({
    required this.errorMessage,
  });
}

class MemberInfoWaiting extends MemberInfoState {}

class MemberInfoSuccess extends MemberInfoState {
  final MemberInfoModel memberInfoData;
  MemberInfoSuccess({required this.memberInfoData});
}