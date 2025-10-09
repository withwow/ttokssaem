import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/appChecker_model.dart';

@immutable
abstract class AppCheckerState {}

class AppCheckerInitial extends AppCheckerState {}

class InitialAppCheckerState extends AppCheckerState {}

class AppCheckerError extends AppCheckerState {
  final String errorMessage;

  AppCheckerError({
    required this.errorMessage,
  });
}

class AppCheckerWaiting extends AppCheckerState {}

class AppCheckerSuccess extends AppCheckerState {
  final AppCheckerModel appCheckerData;
  AppCheckerSuccess({required this.appCheckerData});
}