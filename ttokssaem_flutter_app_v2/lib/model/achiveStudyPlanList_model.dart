class AchiveStudyPlanDataModel {

  late String plandate;
  late String plancount;
  late String achievecount;

  AchiveStudyPlanDataModel();

  AchiveStudyPlanDataModel.fromJson(Map<String, dynamic> json) {
    plandate = json['plandate'] == null ? '' : json['plandate'];
    plancount = json['plancount'] == null ? '' : json['plancount'];
    achievecount = json['achievecount'] == null ? '' : json['achievecount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['plandate'] = this.plandate;
    data['plancount'] = this.plancount;
    data['achievecount'] = this.achievecount;

    return data;
  }
}

class AchiveStudyPlanListModel {

  late int totcnt;
  late int remain;
  late List<AchiveStudyPlanDataModel> listData;

  AchiveStudyPlanListModel();

  AchiveStudyPlanListModel.fromJson(Map<String, dynamic> json) {
    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];
    remain = json['remain'] == null ? 0 : json['remain'];

    List responseList = json['lists'];
    listData = responseList.map((f) => AchiveStudyPlanDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['totcnt'] = this.totcnt;
    data['remain'] = this.remain;

    data['lists'] =  listData.map((item) => item.toJson()).toList();

    return data;
  }
}