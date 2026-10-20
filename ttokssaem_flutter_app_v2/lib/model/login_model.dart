class LoginModel {

  late String accesstoken;
  late String type;

  LoginModel();

  LoginModel.fromJson(Map<String, dynamic> json) {
    accesstoken = json['accesstoken'] == null ? '' : json['accesstoken'];
    type = json['type'] == null ? '' : json['type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['accesstoken'] = this.accesstoken;
    data['type'] = this.type;
    return data;
  }
}