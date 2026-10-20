class AppCheckDataModel {

  late String appname;


  AppCheckDataModel(
      {
        required this.appname,
      });

  AppCheckDataModel.fromJson(Map<String, dynamic> json) {
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    data['appname'] = this.appname;

    return data;
  }
}

class AppCheckerModel {

  AppCheckerModel();

  AppCheckerModel.fromJson(Map<String, dynamic> json) {
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    return data;
  }
}