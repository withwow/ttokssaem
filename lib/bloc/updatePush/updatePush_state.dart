import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/updatePush_model.dart';

@immutable
abstract class UpdatePushState {}

class UpdatePushInitial extends UpdatePushState {}

class InitialUpdatePushState extends UpdatePushState {}

class UpdatePushError extends UpdatePushState {
  final String errorMessage;

  UpdatePushError({
    required this.errorMessage,
  });
}

class UpdatePushWaiting extends UpdatePushState {}

class UpdatePushSuccess extends UpdatePushState {
  final UpdatePushModel updatePushData;
  UpdatePushSuccess({required this.updatePushData});
}