import 'package:meta/meta.dart';

@immutable
abstract class PenaltyDetailEvent {}

class SelPenaltyDetail extends PenaltyDetailEvent {
  final String targetid;
  final int page;
  final int length;
  final int requestId;
  final apiToken;

  SelPenaltyDetail({
    required this.targetid,
    required this.page,
    required this.length,
    required this.requestId,
    required this.apiToken,
  });
}
