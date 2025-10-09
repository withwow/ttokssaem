class MemberInfoModel {

  late int memberno;
  late String branchid;
  late String type;
  late String membername;
  late String schoolcode;
  late String schoolname;
  late String grade;
  late String gender;
  late String contact;
  late String email;
  late String marketing;
  late String push;
  late String regdate;

  MemberInfoModel();

  MemberInfoModel.fromJson(Map<String, dynamic> json) {
    memberno = json['memberno'] == null ? 0 : json['memberno'];
    branchid = json['branchid'] == null ? '' : json['branchid'];
    type = json['type'] == null ? '' : json['type'];
    membername = json['membername'] == null ? '' : json['membername'];
    schoolcode = json['schoolcode'] == null ? '' : json['schoolcode'];
    schoolname = json['schoolname'] == null ? '' : json['schoolname'];
    grade = json['grade'] == null ? '' : json['grade'];
    gender = json['gender'] == null ? '' : json['gender'];
    contact = json['contact'] == null ? '' : json['contact'];
    email = json['email'] == null ? '' : json['email'];
    marketing = json['marketing'] == null ? '' : json['marketing'];
    push = json['push'] == null ? '' : json['push'];
    regdate = json['regdate'] == null ? '' : json['regdate'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['memberno'] = this.memberno;
    data['branchid'] = this.branchid;
    data['type'] = this.type;
    data['membername'] = this.membername;
    data['schoolcode'] = this.schoolcode;
    data['schoolname'] = this.schoolname;
    data['grade'] = this.grade;
    data['gender'] = this.gender;
    data['contact'] = this.contact;
    data['email'] = this.email;
    data['marketing'] = this.marketing;
    data['push'] = this.push;
    data['regdate'] = this.regdate;
    return data;
  }
}