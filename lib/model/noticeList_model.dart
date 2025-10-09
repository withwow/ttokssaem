class NoticeDataModel {

  late int noticeid;
  late String branchid;
  late String memberid;
  late String category;
  late String title;
  late String message;
  late String agoregdate;
  late String regdate;
  late String readyn;
  late String readdate;
  late String needaggreyn;
  late String aggreyn;
  late String aggredate;

  NoticeDataModel();

  NoticeDataModel.fromJson(Map<String, dynamic> json) {
    noticeid = json['noticeid'] == null ? 0 : json['noticeid'];
    branchid = json['branchid'] == null ? '' : json['branchid'];
    memberid = json['memberid'] == null ? '' : json['memberid'];
    category = json['category'] == null ? '' : json['category'];
    title = json['title'] == null ? '' : json['title'];
    message = json['message'] == null ? '' : json['message'];
    agoregdate = json['agoregdate'] == null ? '' : json['agoregdate'];
    regdate = json['regdate'] == null ? '' : json['regdate'];
    readyn = json['readyn'] == null ? '' : json['readyn'];
    readdate = json['readdate'] == null ? '' : json['readdate'];
    needaggreyn = json['needaggreyn'] == null ? '' : json['needaggreyn'];
    aggreyn = json['aggreyn'] == null ? '' : json['aggreyn'];
    aggredate = json['aggredate'] == null ? '' : json['aggredate'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['noticeid'] = this.noticeid;
    data['branchid'] = this.branchid;
    data['memberid'] = this.memberid;
    data['category'] = this.category;
    data['title'] = this.title;
    data['message'] = this.message;
    data['agoregdate'] = this.agoregdate;
    data['regdate'] = this.regdate;
    data['readyn'] = this.readyn;
    data['readdate'] = this.readdate;
    data['needaggreyn'] = this.needaggreyn;
    data['aggreyn'] = this.aggreyn;
    data['aggredate'] = this.aggredate;

    return data;
  }
}

class NoticeListModel {

  late int totcnt;
  late int remain;
  late List<NoticeDataModel> listData;

  NoticeListModel();

  NoticeListModel.fromJson(Map<String, dynamic> json) {
    totcnt = json['totcnt'] == null ? 0 : json['totcnt'];
    remain = json['remain'] == null ? 0 : json['remain'];

    List responseList = json['lists'];
    listData = responseList.map((f) => NoticeDataModel.fromJson(f)).toList();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['totcnt'] = this.totcnt;
    data['remain'] = this.remain;

    data['lists'] =  listData.map((item) => item.toJson()).toList();

    return data;
  }
}