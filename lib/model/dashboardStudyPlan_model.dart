class DashboardStudyPlanDataModel {

  late String plancount;
  late String achievecount;

  DashboardStudyPlanDataModel(String _plancount, String _achievecount) {
    plancount = _plancount;
    achievecount = _achievecount;
  }
}

class DashboardStudyPlanModel {

  late String last1_plancount;
  late String last1_achievecount;

  late String last3_plancount;
  late String last3_achievecount;

  late String last7_plancount;
  late String last7_achievecount;

  DashboardStudyPlanModel();

  DashboardStudyPlanModel.fromJson(Map<String, dynamic> json) {
    last1_plancount = json['last1']['plancount'] == null ? '' : json['last1']['plancount'];
    last1_achievecount = json['last1']['achievecount'] == null ? '' : json['last1']['achievecount'];

    last3_plancount = json['last3']['plancount'] == null ? '' : json['last3']['plancount'];
    last3_achievecount = json['last3']['achievecount'] == null ? '' : json['last3']['achievecount'];

    last7_plancount = json['last7']['plancount'] == null ? '' : json['last7']['plancount'];
    last7_achievecount = json['last7']['achievecount'] == null ? '' : json['last7']['achievecount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}