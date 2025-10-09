class NeisModel {

  late String ATPT_OFCDC_SC_NM;
  late String SCHUL_NM;

  NeisModel({required this.ATPT_OFCDC_SC_NM, required this.SCHUL_NM});

  NeisModel.fromJson(Map<String, dynamic> json) {
    ATPT_OFCDC_SC_NM = json['ATPT_OFCDC_SC_NM'] == null ? '' : json['ATPT_OFCDC_SC_NM'];
    SCHUL_NM = json['SCHUL_NM'] == null ? '' : json['SCHUL_NM'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['ATPT_OFCDC_SC_NM'] = this.ATPT_OFCDC_SC_NM;
    data['SCHUL_NM'] = this.SCHUL_NM;
    return data;
  }
}