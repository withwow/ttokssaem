class JoinMemberModel {

  late int lastid;

  JoinMemberModel();

  JoinMemberModel.fromJson(Map<String, dynamic> json) {
    lastid = json['lastid'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['lastid'] = this.lastid;
    return data;
  }
}