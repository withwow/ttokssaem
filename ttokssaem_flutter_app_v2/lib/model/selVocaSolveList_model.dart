class SelVocaSolveDataModel {

  late int id;
  late String memberid;
  late String memodate;
  late int degree;
  late String vocalevel;
  late String vocalevel_name;
  late int vocano;

  late String word;
  late String voca_answer;
  late String answer;
  late String result;

  SelVocaSolveDataModel();

  SelVocaSolveDataModel.fromJson(Map<String, dynamic> json) {
    id = json['id'] == null ? 0 : json['id'];
    memberid = json['memberid'] == null ? '' : json['memberid'];
    memodate = json['memodate'] == null ? '' : json['memodate'];

    degree = json['degree'] == null ? 0 : json['degree'];
    vocalevel = json['vocalevel'] == null ? '' : json['vocalevel'];
    vocalevel_name = json['vocalevel_name'] == null ? '' : json['vocalevel_name'];
    vocano = json['vocano'] == null ? 0 : json['vocano'];

    word = json['word'] == null ? '' : json['word'];
    voca_answer = json['voca_answer'] == null ? '' : json['voca_answer'];
    answer = json['answer'] == null ? '' : json['answer'];
    result = json['result'] == null ? '' : json['result'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    return data;
  }
}

class SelVocaSolveListModel {

  late String examflag;

  late int  totcnt;
  late int  remain;

  late List<SelVocaSolveDataModel> listData;

  SelVocaSolveListModel();

  SelVocaSolveListModel.fromJson(Map<String, dynamic> json) {
    examflag = json['examflag'] == null ? '' : json['examflag'];

    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];
    remain = json['remain'] == null ? 0 : json['remain'];

    List responseList = json['lists'];
    listData = responseList.map((f) => SelVocaSolveDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}