class SelVocaTestDataModel {

  late int id;
  late String memberid;

  late String memodate;
  late String vocalevel;
  late String vocalevel_name;
  late int vocano;

  late String word;
  late String answer;

  SelVocaTestDataModel();

  SelVocaTestDataModel.fromJson(Map<String, dynamic> json) {
    id = json['id'] == null ? 0 : json['id'];
    memberid = json['memberid'] == null ? '' : json['memberid'];

    memodate = json['memodate'] == null ? '' : json['memodate'];
    vocalevel = json['vocalevel'] == null ? '' : json['vocalevel'];
    vocalevel_name = json['vocalevel_name'] == null ? '' : json['vocalevel_name'];
    vocano = json['vocano'] == null ? 0 : json['vocano'];

    word = json['word'] == null ? '' : json['word'];
    answer = json['answer'] == null ? '' : json['answer'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['id'] = this.id;
    data['vocalevel'] = this.vocalevel;
    data['vocano'] = this.vocano;
    data['answer'] = this.answer;

    return data;
  }
}

class SelVocaTestListModel {

  late int degree;
  late String examflag;

  late int  totcnt;
  late int  remain;

  late List<SelVocaTestDataModel> listData;

  SelVocaTestListModel();

  SelVocaTestListModel.fromJson(Map<String, dynamic> json) {
    degree = json['degree'] == null ? 0 : json['degree'];
    examflag = json['examflag'] == null ? '' : json['examflag'];

    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];
    remain = json['remain'] == null ? 0 : json['remain'];

    List responseList = json['lists'];
    listData = responseList.map((f) => SelVocaTestDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}