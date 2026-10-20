class FinishVocaTestModel {

  late String total;
  late String wrong;
  late String per;
  late String finishflag;

  FinishVocaTestModel();

  FinishVocaTestModel.fromJson(Map<String, dynamic> json) {
    total = json['total'] == null ? '' : json['total'].toString();
    wrong = json['wrong'] == null ? '' : json['wrong'].toString();
    per = json['per'] == null ? '' : json['per'].toString();
    finishflag = json['finishflag'] == null ? '' : json['finishflag'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}