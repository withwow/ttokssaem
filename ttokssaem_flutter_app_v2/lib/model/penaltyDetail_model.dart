class PenaltyHistoryDataModel {
  final int blackmarkid;
  final String blackmark;
  final String blackmarkname;
  final int point;
  final String reason;
  final String regdate;
  final String cancelyn;
  final String canceldate;

  PenaltyHistoryDataModel.fromJson(Map<String, dynamic> json)
      : blackmarkid = _asInt(json['blackmarkid']),
        blackmark = json['blackmark']?.toString() ?? '',
        blackmarkname = json['blackmarkname']?.toString() ?? '',
        point = _asInt(json['point']),
        reason = json['reason']?.toString() ?? '',
        regdate = json['regdate']?.toString() ?? '',
        cancelyn = json['cancelyn']?.toString() ?? 'N',
        canceldate = json['canceldate']?.toString() ?? '';

  bool get isCancelled => cancelyn == 'Y';
}

class PenaltyDetailModel {
  final String memberid;
  final String membername;
  final int monthpenalty;
  final int currentMonthPenalty;
  final int cumulativePenalty;
  final int totcnt;
  final int remain;
  final List<PenaltyHistoryDataModel> listData;

  PenaltyDetailModel.fromJson(Map<String, dynamic> json)
      : memberid = (json['student']?['memberid'] ?? '').toString(),
        membername = (json['student']?['membername'] ?? '').toString(),
        monthpenalty = _asInt(json['monthpenalty']),
        currentMonthPenalty = json.containsKey('currentMonthPenalty')
            ? _asInt(json['currentMonthPenalty'])
            : _asInt(json['monthpenalty']),
        cumulativePenalty = _asInt(json['cumulativePenalty']),
        totcnt = _asInt(json['totcnt']),
        remain = _asInt(json['remain']),
        listData = ((json['lists'] ?? []) as List)
            .map((item) => PenaltyHistoryDataModel.fromJson(item))
            .toList();
}

int _asInt(dynamic value) => int.tryParse(value?.toString() ?? '') ?? 0;
