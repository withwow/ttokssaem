import 'package:meta/meta.dart';
import 'package:ttokssaem_flutter_app/model/penaltyDetail_model.dart';

@immutable
abstract class PenaltyDetailState {}

class PenaltyDetailInitial extends PenaltyDetailState {}

class PenaltyDetailWaiting extends PenaltyDetailState {}

class PenaltyDetailError extends PenaltyDetailState {
  final String errorMessage;
  final int requestId;
  PenaltyDetailError({required this.errorMessage, required this.requestId});
}

class PenaltyDetailSuccess extends PenaltyDetailState {
  final PenaltyDetailModel penaltyDetailData;
  final int requestId;
  PenaltyDetailSuccess(
      {required this.penaltyDetailData, required this.requestId});
}
