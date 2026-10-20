class SelVocaHistDataModel {

  late int id;
  late String memberid;

  late String memodate;
  late String vocalevel;
  late String vocalevel_name;
  late int vocano;
  late int targetcount;

  late String examflag;

  late int degree;
  late int total;
  late int wrong;

  SelVocaHistDataModel();

  SelVocaHistDataModel.fromJson(Map<String, dynamic> json) {
    id = json['id'] == null ? 0 : json['id'];
    memberid = json['memberid'] == null ? '' : json['memberid'];

    memodate = json['memodate'] == null ? '' : json['memodate'];
    vocalevel = json['vocalevel'] == null ? '' : json['vocalevel'];
    vocalevel_name = json['vocalevel_name'] == null ? '' : json['vocalevel_name'];
    vocano = json['vocano'] == null ? 0 : json['vocano'];
    targetcount = json['targetcount'] == null ? 0 : json['targetcount'];

    examflag = json['examflag'] == null ? '' : json['examflag'];

    degree = json['degree'] == null ? 0 : json['degree'];
    total = json['total'] == null ? 0 : json['total'];
    wrong = json['wrong'] == null ? 0 : json['wrong'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    return data;
  }
}

class SelVocaHistListModel {

  late int  totcnt;
  late int  remain;

  late List<SelVocaHistDataModel> listData;

  SelVocaHistListModel();

  SelVocaHistListModel.fromJson(Map<String, dynamic> json) {
    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];
    remain = json['remain'] == null ? 0 : json['remain'];

    List responseList = json['lists'];
    listData = responseList.map((f) => SelVocaHistDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}