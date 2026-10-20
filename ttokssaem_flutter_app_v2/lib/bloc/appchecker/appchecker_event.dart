import 'package:meta/meta.dart';

import 'package:ttokssaem_flutter_app/model/appChecker_model.dart';

@immutable
abstract class AppCheckerEvent {}

class AppChecker extends AppCheckerEvent {
  final String device;
  final List<AppCheckDataModel> lists;
  final apiToken;
  AppChecker(
      {
        required this.device,
        required this.lists,
        required this.apiToken
      });
}