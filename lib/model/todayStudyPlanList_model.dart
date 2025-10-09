class TodayStudyPlanDataModel {

  late int classhour;
  late String study;

  TodayStudyPlanDataModel();

  TodayStudyPlanDataModel.fromJson(Map<String, dynamic> json) {
    classhour = json['class'] == null ? 0 : int.parse(json['class']);
    study = json['study'] == null ? '' : json['study'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['class'] = this.classhour.toString();
    data['study'] = this.study;

    return data;
  }
}

class TodayStudyPlanListModel {

  late int totcnt;
  late List<TodayStudyPlanDataModel> listData;

  TodayStudyPlanListModel();

  TodayStudyPlanListModel.fromJson(Map<String, dynamic> json) {
    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];

    List responseList = json['lists'];
    listData = responseList.map((f) => TodayStudyPlanDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['totcnt'] = this.totcnt;



    return data;
  }
}