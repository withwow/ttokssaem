import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/selVocaTestList_model.dart';

@immutable
abstract class FinishVocaTestEvent {}

class FinishVocaTest extends FinishVocaTestEvent {
  final String memodate;
  final int degree;
  final List<SelVocaTestDataModel> lists;
  final apiToken;
  FinishVocaTest(
  {
    required this.memodate,
    required this.degree,
    required this.lists,
    required this.apiToken
  });
}