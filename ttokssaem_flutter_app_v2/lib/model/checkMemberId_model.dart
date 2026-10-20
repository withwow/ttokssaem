class CheckMemberIdModel {

  late int length;

  CheckMemberIdModel();

  CheckMemberIdModel.fromJson(Map<String, dynamic> json) {
    length = json['length'] == null ? 0 : json['length'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['length'] = this.length;
    return data;
  }
}