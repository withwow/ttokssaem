import 'package:flutter_test/flutter_test.dart';
import 'package:ttokssaem_flutter_app/model/penaltyDetail_model.dart';

void main() {
  test('parses server-calculated monthly and cumulative penalties with cancelled history', () {
    final model = PenaltyDetailModel.fromJson({
      'student': {'memberid': 'student-1', 'membername': '김동윤'},
      'monthpenalty': '7',
      'currentMonthPenalty': '7',
      'cumulativePenalty': '15',
      'totcnt': 2,
      'remain': 0,
      'lists': [
        {
          'blackmarkid': 10,
          'blackmark': 'LATE',
          'blackmarkname': '지각',
          'point': '3',
          'reason': '등원 시간 초과',
          'regdate': '2026-10-20 09:10:00',
          'cancelyn': 'N',
          'canceldate': null,
        },
        {
          'blackmarkid': 9,
          'blackmarkname': '휴대폰 사용',
          'point': 4,
          'cancelyn': 'Y',
          'canceldate': '2026-10-19 10:00:00',
        },
      ],
    });

    expect(model.monthpenalty, 7);
    expect(model.currentMonthPenalty, 7);
    expect(model.cumulativePenalty, 15);
    expect(model.memberid, 'student-1');
    expect(model.listData, hasLength(2));
    expect(model.listData.first.point, 3);
    expect(model.listData.last.isCancelled, isTrue);
    expect(model.remain, 0);
  });
}
