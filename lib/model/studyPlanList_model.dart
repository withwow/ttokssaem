class StudyPlanDataModel {

  late int classhour;
  late String study;
  late String plancount;
  late String achievecount;

  StudyPlanDataModel();

  StudyPlanDataModel.fromJson(Map<String, dynamic> json) {
    classhour = json['class'] == null ? 0 : int.parse(json['class']);
    study = json['study'] == null ? '' : json['study'];
    plancount = json['plancount'] == null ? '0' : json['plancount'].toString();
    achievecount = json['achievecount'] == null ? '0' : json['achievecount'].toString();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['class'] = this.classhour.toString();
    data['study'] = this.study;
    data['plancount'] = this.plancount;
    data['achievecount'] = this.achievecount;

    return data;
  }
}

class StudyPlanListModel {

  late int totcnt;
  late List<StudyPlanDataModel> listData;

  StudyPlanListModel();

  StudyPlanListModel.fromJson(Map<String, dynamic> json) {
    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];

    List responseList = json['lists'];
    listData = responseList.map((f) => StudyPlanDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['totcnt'] = this.totcnt;

    data['lists'] =  listData.map((item) => item.toJson()).toList();

    return data;
  }
}