import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/finishVocaTest_model.dart';

@immutable
abstract class FinishVocaTestState {}

class FinishVocaTestInitial extends FinishVocaTestState {}

class InitialFinishVocaTestState extends FinishVocaTestState {}

class FinishVocaTestError extends FinishVocaTestState {
  final String errorMessage;

  FinishVocaTestError({
    required this.errorMessage,
  });
}

class FinishVocaTestWaiting extends FinishVocaTestState {}

class FinishVocaTestSuccess extends FinishVocaTestState {
  final FinishVocaTestModel finishVocaTestData;
  FinishVocaTestSuccess({required this.finishVocaTestData});
}