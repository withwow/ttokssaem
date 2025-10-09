import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/updateMemberInfo_model.dart';

@immutable
abstract class UpdateMemberInfoState {}

class UpdateMemberInfoInitial extends UpdateMemberInfoState {}

class InitialUpdateMemberInfoState extends UpdateMemberInfoState {}

class UpdateMemberInfoError extends UpdateMemberInfoState {
  final String errorMessage;

  UpdateMemberInfoError({
    required this.errorMessage,
  });
}

class UpdateMemberInfoWaiting extends UpdateMemberInfoState {}

class UpdateMemberInfoSuccess extends UpdateMemberInfoState {
  final UpdateMemberInfoModel updateMemberInfoData;
  UpdateMemberInfoSuccess({required this.updateMemberInfoData});
}