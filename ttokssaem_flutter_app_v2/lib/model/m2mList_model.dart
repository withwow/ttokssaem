class M2mDataModel {

  late int m2mid;
  late String branchid;
  late String memberid;
  late String question;
  late String answer;
  late String status;
  late String regdate;
  late String findate;

  M2mDataModel();

  M2mDataModel.fromJson(Map<String, dynamic> json) {
    m2mid = json['m2mid'] == null ? 0 : json['m2mid'];
    branchid = json['branchid'] == null ? '' : json['branchid'];
    memberid = json['memberid'] == null ? '' : json['memberid'];
    question = json['question'] == null ? '' : json['question'];
    answer = json['answer'] == null ? '' : json['answer'];
    status = json['status'] == null ? '' : json['status'];
    regdate = json['regdate'] == null ? '' : json['regdate'];
    findate = json['findate'] == null ? '' : json['findate'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['m2mid'] = this.m2mid;
    data['branchid'] = this.branchid;
    data['memberid'] = this.memberid;
    data['question'] = this.question;
    data['answer'] = this.answer;
    data['status'] = this.status;
    data['regdate'] = this.regdate;
    data['findate'] = this.findate;

    return data;
  }
}

class M2mListModel {

  late int totcnt;
  late int remain;
  late List<M2mDataModel> listData;

  M2mListModel();

  M2mListModel.fromJson(Map<String, dynamic> json) {
    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];
    remain = json['remain'] == null ? 0 : json['remain'];

    List responseList = json['lists'];
    listData = responseList.map((f) => M2mDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['totcnt'] = this.totcnt;
    data['remain'] = this.remain;

    data['lists'] =  listData.map((item) => item.toJson()).toList();

    return data;
  }
}