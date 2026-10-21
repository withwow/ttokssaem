class SelStudentDataModel {

  late String memberid;
  late String membername;
  late int penalty;

  late String last0_plancount;
  late String last0_achievecount;

  late String last1_plancount;
  late String last1_achievecount;

  SelStudentDataModel();

  SelStudentDataModel.fromJson(Map<String, dynamic> json) {
    memberid = json['memberid'] == null ? '' : json['memberid'];
    membername = json['membername'] == null ? '' : json['membername'];
    penalty = int.tryParse(json['penalty']?.toString() ?? '') ?? 0;

    last0_plancount = json['last0']['plancount'] == null ? '' : json['last0']['plancount'];
    last0_achievecount = json['last0']['achievecount'] == null ? '' : json['last0']['achievecount'];

    last1_plancount = json['last1']['plancount'] == null ? '' : json['last1']['plancount'];
    last1_achievecount = json['last1']['achievecount'] == null ? '' : json['last1']['achievecount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    return data;
  }
}

class SelStudentListModel {

  late int  totcnt;

  late List<SelStudentDataModel> listData;

  SelStudentListModel();

  SelStudentListModel.fromJson(Map<String, dynamic> json) {
    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];

    List responseList = json['lists'];
    listData = responseList.map((f) => SelStudentDataModel.fromJson(f)).toList();

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}
