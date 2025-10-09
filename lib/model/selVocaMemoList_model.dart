class SelVocaMemoDataModel {

  late int id;
  late String memberid;

  late String memodate;
  late String vocalevel;
  late String vocalevel_name;
  late int vocano;

  late String word;
  late String explain;

  SelVocaMemoDataModel();

  SelVocaMemoDataModel.fromJson(Map<String, dynamic> json) {
    id = json['id'] == null ? 0 : json['id'];
    memberid = json['memberid'] == null ? '' : json['memberid'];

    memodate = json['memodate'] == null ? '' : json['memodate'];
    vocalevel = json['vocalevel'] == null ? '' : json['vocalevel'];
    vocalevel_name = json['vocalevel_name'] == null ? '' : json['vocalevel_name'];
    vocano = json['vocano'] == null ? 0 : json['vocano'];

    word = json['word'] == null ? '' : json['word'];
    explain = json['explain'] == null ? '' : json['explain'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    return data;
  }
}

class SelVocaMemoListModel {

  late String examflag;

  late int  totcnt;
  late int  remain;

  late List<SelVocaMemoDataModel> listData;

  SelVocaMemoListModel();

  SelVocaMemoListModel.fromJson(Map<String, dynamic> json) {
    examflag = json['examflag'] == null ? '' : json['examflag'];

    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];
    remain = json['remain'] == null ? 0 : json['remain'];

    List responseList = json['lists'];
    listData = responseList.map((f) => SelVocaMemoDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}