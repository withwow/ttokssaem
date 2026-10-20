import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/requestVocaTest_model.dart';

@immutable
abstract class RequestVocaTestState {}

class RequestVocaTestInitial extends RequestVocaTestState {}

class InitialRequestVocaTestState extends RequestVocaTestState {}

class RequestVocaTestError extends RequestVocaTestState {
  final String errorMessage;

  RequestVocaTestError({
    required this.errorMessage,
  });
}

class RequestVocaTestWaiting extends RequestVocaTestState {}

class RequestVocaTestSuccess extends RequestVocaTestState {
  final RequestVocaTestModel requestVocaTestData;
  RequestVocaTestSuccess({required this.requestVocaTestData});
}