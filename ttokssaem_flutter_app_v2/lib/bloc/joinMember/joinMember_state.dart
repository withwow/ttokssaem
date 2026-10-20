import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/joinMember_model.dart';

@immutable
abstract class JoinMemberState {}

class JoinMemberInitial extends JoinMemberState {}

class InitialJoinMemberState extends JoinMemberState {}

class JoinMemberError extends JoinMemberState {
  final String errorMessage;

  JoinMemberError({
    required this.errorMessage,
  });
}

class JoinMemberWaiting extends JoinMemberState {}

class JoinMemberSuccess extends JoinMemberState {
  final JoinMemberModel joinMemberData;
  JoinMemberSuccess({required this.joinMemberData});
}