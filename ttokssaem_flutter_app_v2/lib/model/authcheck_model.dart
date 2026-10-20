class AuthcheckModel {

  int code = 0;
  AuthcheckModel();

  AuthcheckModel.fromJson(Map<String, dynamic> json, code) {
    this.code = code;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}