import 'dart:convert';

import 'package:dio/dio.dart';

import 'package:flutter/foundation.dart';
import 'package:ttokssaem_flutter_app/bloc/appchecker/appchecker_event.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/config/api.dart';

import 'package:ttokssaem_flutter_app/model/version_model.dart';
import 'package:ttokssaem_flutter_app/model/joinMember_model.dart';
import 'package:ttokssaem_flutter_app/model/findid_model.dart';
import 'package:ttokssaem_flutter_app/model/findpw_model.dart';
import 'package:ttokssaem_flutter_app/model/neis_model.dart';
import 'package:ttokssaem_flutter_app/model/checkMemberId_model.dart';
import 'package:ttokssaem_flutter_app/model/login_model.dart';
import 'package:ttokssaem_flutter_app/model/memberInfo_model.dart';
import 'package:ttokssaem_flutter_app/model/updatePush_model.dart';
import 'package:ttokssaem_flutter_app/model/updateMemberInfo_model.dart';
import 'package:ttokssaem_flutter_app/model/updatePassword_model.dart';
import 'package:ttokssaem_flutter_app/model/withdraw_model.dart';
import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';
import 'package:ttokssaem_flutter_app/model/todayStudyPlanList_model.dart';
import 'package:ttokssaem_flutter_app/model/regStudyPlanList_model.dart';
import 'package:ttokssaem_flutter_app/model/achiveStudyPlanList_model.dart';
import 'package:ttokssaem_flutter_app/model/dashboardStudyPlan_model.dart';
import 'package:ttokssaem_flutter_app/model/selStudentList_model.dart';
import 'package:ttokssaem_flutter_app/model/studyPlanList_model.dart';
import 'package:ttokssaem_flutter_app/model/requestm2m_model.dart';
import 'package:ttokssaem_flutter_app/model/m2mList_model.dart';
import 'package:ttokssaem_flutter_app/model/updatem2m_model.dart';
import 'package:ttokssaem_flutter_app/model/requestVocaTest_model.dart';
import 'package:ttokssaem_flutter_app/model/finishVocaTest_model.dart';
import 'package:ttokssaem_flutter_app/model/selVocaMemoList_model.dart';
import 'package:ttokssaem_flutter_app/model/selVocaTestList_model.dart';
import 'package:ttokssaem_flutter_app/model/selVocaSolveList_model.dart';
import 'package:ttokssaem_flutter_app/model/selVocaHistList_model.dart';
import 'package:ttokssaem_flutter_app/model/authcheck_model.dart';
import 'package:ttokssaem_flutter_app/model/appChecker_model.dart';

class ApiProvider {
  Dio dio = Dio();
  late Response response;
  String connErr = 'Please check your internet connection and try again';

  Future<Response> getConnect(url, apiToken) async {
    if (kDebugMode) {
      print('url : ' + url.toString());
    }
    try {
      dio.options.headers['content-Type'] = 'application/x-www-form-urlencoded';
      dio.options.connectTimeout = 30000; //5s
      dio.options.receiveTimeout = 25000;

      return await dio.get(url, cancelToken: apiToken);
    } on DioError catch (e) {
      //print(e.toString()+' | '+url.toString());
      if (e.type == DioErrorType.response) {
        int? statusCode = e.response!.statusCode;
        if (statusCode == STATUS_NOT_FOUND) {
          throw "Api not found";
        } else if (statusCode == STATUS_INTERNAL_ERROR) {
          throw "Internal Server Error";
        } else {
          throw e.error.message.toString();
        }
      } else if (e.type == DioErrorType.connectTimeout) {
        throw e.message.toString();
      } else if (e.type == DioErrorType.cancel) {
        throw 'cancel';
      }
      throw connErr;
    } finally {
      dio.close();
    }
  }

  Future<Response> postConnect(url, data, apiToken) async{
    if (kDebugMode) {
      print('url : '+url.toString());
      print('postData : '+data.toString());
    }

    try{
      dio.options.headers['content-Type'] = 'application/json';
      dio.options.connectTimeout = 30000; //5s
      dio.options.receiveTimeout = 25000;

      return await dio.post(url, data: data, cancelToken: apiToken);
    } on DioError catch (e){
      if (kDebugMode) {
        print(e.toString()+' | '+url.toString());
      }

      if(e.type == DioErrorType.response){
        int? statusCode = e.response!.statusCode;
        if(statusCode == STATUS_NOT_FOUND){
          throw "Api not found";
        } else if(statusCode == STATUS_INTERNAL_ERROR){
          throw "Internal Server Error";
        } else {
          throw e.error.message.toString();
        }
      } else if(e.type == DioErrorType.connectTimeout){
        throw e.message.toString();
      } else if(e.type == DioErrorType.cancel){
        throw 'cancel';
      }
      throw connErr;
    } finally{
      dio.close();
    }
  }

  Future<Response> postTokenConnect(url, data, apiToken) async{
    if (kDebugMode) {
      print('url : '+url.toString());
      print('accesstoken : '+ACCESSTOKEN);
      print('postData : '+data.toString());
    }
    try{
      dio.options.headers['content-Type'] = 'application/json';
      dio.options.headers['accesstoken'] = ACCESSTOKEN;
      dio.options.connectTimeout = 30000; //5s
      dio.options.receiveTimeout = 25000;

      return await dio.post(url, data: data, cancelToken: apiToken);
    } on DioError catch (e){
      if (kDebugMode) {
        print(e.toString()+' | '+url.toString());
      }
      if(e.type == DioErrorType.response){
        int? statusCode = e.response!.statusCode;
        if(statusCode == STATUS_NOT_FOUND){
          throw "Api not found";
        } else if(statusCode == STATUS_INTERNAL_ERROR){
          throw "Internal Server Error";
        } else {
          throw e.error.message.toString();
        }
      } else if(e.type == DioErrorType.connectTimeout){
        throw e.message.toString();
      } else if(e.type == DioErrorType.cancel){
        throw 'cancel';
      }
      throw connErr;
    } finally{
      dio.close();
    }
  }

  String ThrowError(int code) {
    switch (code) {
      case -1:
        return '서버에 오류가 있습니다.';
      case 1:
        return '잘못된 명령입니다.';
      case 2:
        return '잘못된 요청입니다.';
      case 3:
        return '인증토큰 정보가 틀립니다.';
      case 4:
        return '인증토큰 정보가 틀립니다.';
      case 100:
        return '데이터베이스 문제가 발생했습니다.';
      case 101:
        return '데이터베이스에 없는 명령입니다.';
      case 401:
        return '승인되지 않았습니다. 승인을 요청하세요.';
      case 404:
        return '일치하는 정보가 없습니다.';
      case 409:
        return '이미 존재하는 정보입니다.';
      case 410:
        return '더이상 수정하지 못합니다.';
      default:
        return '정의되지 않은 응답입니다';
    }
  }

  Future<VersionModel> version(String _os, String _version, apiToken) async {
    var postData = {
      'os': _os,
      'version': _version,
    };
    response = await postConnect(API_V1_VERSION, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return VersionModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  static Future<List<NeisModel>> neis(String _schoolname, apiToken) async {

    String url = '$API_V1_NEIS_SCHOOL_INFO?Type=json&SCHUL_NM=$_schoolname&KEY=04a4fb449ee241acb6823df842f31a3e&pIndex=1&pSize=10';
    String connErr = 'Please check your internet connection and try again';

    Dio dio = Dio();
    try {
      dio.options.headers['content-Type'] = 'application/x-www-form-urlencoded';
      dio.options.connectTimeout = 30000; //5s
      dio.options.receiveTimeout = 25000;

      Response response =  await dio.get(url, cancelToken: apiToken);
      if (kDebugMode) {
        print('res : ' + response.toString());
      }
      final parsedJson = jsonDecode(response.toString());
      final result = parsedJson['RESULT'] == null ? null : parsedJson['RESULT'];
      if(result == null){
        if( parsedJson['schoolInfo'] is List ){
          List responseList = parsedJson['schoolInfo'][1]['row'] == null ? null : parsedJson['schoolInfo'][1]['row'];
          if(responseList != null) {
            List<NeisModel> listData = responseList.map((f) =>
                NeisModel.fromJson(f)).toList();
            return listData;
          } else {
            throw '학교정보 하는 중 오류가 발생했습니다.';
          }
        } else {
          throw '학교정보 하는 중 오류가 발생했습니다.';
        }

      } else {
        List<NeisModel> listData = [];
        return listData;
      }

    } on DioError catch (e) {
      if (kDebugMode) {
        print(e.toString()+' | '+url.toString());
      }
      if (e.type == DioErrorType.response) {
        int? statusCode = e.response!.statusCode;
        if (statusCode == STATUS_NOT_FOUND) {
          throw "Api not found";
        } else if (statusCode == STATUS_INTERNAL_ERROR) {
          throw "Internal Server Error";
        } else {
          throw e.error.message.toString();
        }
      } else if (e.type == DioErrorType.connectTimeout) {
        throw e.message.toString();
      } else if (e.type == DioErrorType.cancel) {
        throw 'cancel';
      }
      throw connErr;
    } finally {
      dio.close();
    }

  }

  Future<FindidModel> findid(String _membername, String _contact, apiToken) async {
    var postData = {
      'membername': _membername,
      'contact': _contact,
    };
    response = await postConnect(API_V1_FINDID, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return FindidModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<FindpwModel> findpw(String _memberid, String _membername, String _contact, apiToken) async {
    var postData = {
      'memberid': _memberid,
      'membername': _membername,
      'contact': _contact,
    };
    response = await postConnect(API_V1_FINDPW, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return FindpwModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<CheckMemberIdModel> checkMemberId(String _memberid, apiToken) async {
    var postData = {
      'memberid': _memberid,
    };
    response = await postConnect(API_V1_CHECKMEMBERID, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return CheckMemberIdModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<JoinMemberModel> joinMember(String _branchid, String _memberid, String _memberpw, String _type, String _membername, String _schoolname, String _grade, String _gender, String _contact, String _email, String _pushtoken, apiToken) async {
    var postData = {
      'branchid': _branchid,
      'memberid': _memberid,
      'memberpw': _memberpw,
      'type': _type,
      'membername': _membername,
      'schoolname': _schoolname,
      'grade': _grade,
      'gender': _gender,
      'contact': _contact,
      'email': _email,
      'pushtoken': _pushtoken,
    };
    response = await postConnect(API_V2_JOINMEMBER, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return JoinMemberModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<LoginModel> login(String _memberid, String _memberpw, String _os, String _pushtoken, apiToken) async {
    var postData = {
      'memberid': _memberid,
      'memberpw': _memberpw,
      'type': _os,
      'pushtoken': _pushtoken,
    };
    response = await postConnect(API_V1_LOGIN, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return LoginModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<MemberInfoModel> memberInfo(apiToken) async {
    var postData = {
    };
    response = await postTokenConnect(API_V1_MEMBERINFO, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return MemberInfoModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<UpdatePushModel> updatePush(String _push, apiToken) async {
    var postData = {
      'push': _push,
    };
    response = await postTokenConnect(API_V1_UPDATEPUSH, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return UpdatePushModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<UpdateMemberInfoModel> updateMemberInfo(String _memberpw, String _membername, String _contact, String _email, apiToken) async {
    var postData = {
      'memberpw': _memberpw,
      'membername': _membername,
      'contact': _contact,
      'email': _email,
    };
    response = await postTokenConnect(API_V1_UPDATEMEMBERINFO, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return UpdateMemberInfoModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<UpdatePasswordModel> updatePassword(String _cur_pw, String _after_pw, apiToken) async {
    var postData = {
      'cur_pw': _cur_pw,
      'after_pw': _after_pw,
    };
    response = await postTokenConnect(API_V1_UPDATEPASSWORD, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return UpdatePasswordModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<WithdrawModel> withdraw(String _memberpw, apiToken) async {
    var postData = {
      'memberpw': _memberpw,
    };
    response = await postTokenConnect(API_V1_WITHDRAW, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return WithdrawModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<NoticeListModel> noticeList(int _page, int _length, apiToken) async {
    var postData = {
      'page': _page,
      'length': _length,
    };
    response = await postTokenConnect(API_V1_NOTICELIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return NoticeListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<NoticeListModel> todayNoticeList(apiToken) async {
    var postData = {
    };
    response = await postTokenConnect(API_V1_TODAYNOTICELIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return NoticeListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<TodayStudyPlanListModel> todayStudyPlanList(String _targetid, String _plandate, apiToken) async {
    var postData = {
      'targetid': _targetid,
      'plandate': _plandate,
    };
    response = await postTokenConnect(API_V2_TODAYSTUDYPLANLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return TodayStudyPlanListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<RegStudyPlanListModel> regStudyPlanList(String _plandate, List<TodayStudyPlanDataModel> lists, apiToken) async {
    var postData = {
      'plandate': _plandate,
      'lists': lists.map((item) => item.toJson()).toList(),
    };

    response = await postTokenConnect(API_V1_REGSTUDYPLANLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return RegStudyPlanListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<AchiveStudyPlanListModel> achiveStudyPlanList(String _targetid, int _page, int _length, apiToken) async {
    var postData = {
      'targetid': _targetid,
      'page': _page,
      'length': _length,
    };
    response = await postTokenConnect(API_V2_ACHIVESTUDYPLANLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return AchiveStudyPlanListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<DashboardStudyPlanModel> dashboardStudyPlan(String _targetid, apiToken) async {
    var postData = {
      'targetid': _targetid,
    };
    response = await postTokenConnect(API_V3_DASHBOARDSTUDYPLAN, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return DashboardStudyPlanModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<SelStudentListModel> selStudentList(apiToken) async {
    var postData = {
    };
    response = await postTokenConnect(API_V1_SELSTUDENTLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return SelStudentListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<StudyPlanListModel> studyPlanList(String _targetid, String _plandate, apiToken) async {
    var postData = {
      'targetid': _targetid,
      'plandate': _plandate,
    };
    response = await postTokenConnect(API_V1_STUDYPLANLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return StudyPlanListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<RequestM2MModel> requestM2M(String _message, apiToken) async {
    var postData = {
      'message': _message,
    };
    response = await postTokenConnect(API_V1_REQUESTM2M, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return RequestM2MModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<M2mListModel> m2mList(int _page, int _length, apiToken) async {
    var postData = {
      'page': _page,
      'length': _length,
    };
    response = await postTokenConnect(API_V1_M2MLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return M2mListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<UpdateM2MModel> updateM2M(int _m2mid, String _question, String _method, apiToken) async {
    var postData = {
      'm2mid': _m2mid,
      'question': _question,
      'method': _method,
    };
    response = await postTokenConnect(API_V1_UPDATEM2M, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return UpdateM2MModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<RequestVocaTestModel> requestVocaTest(String _memodate, apiToken) async {
    var postData = {
      'memodate': _memodate,
    };
    response = await postTokenConnect(API_V1_REQUESTVOCATEST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return RequestVocaTestModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<FinishVocaTestModel> finishVocaTest(String _memodate, int _degree, List<SelVocaTestDataModel> lists, apiToken) async {
    var postData = {
      'memodate': _memodate,
      'degree': _degree,
      'lists': lists.map((item) => item.toJson()).toList(),
    };
    response = await postTokenConnect(API_V1_FINISHVOCATEST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return FinishVocaTestModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<SelVocaMemoListModel> selVocaMemoList(int _page, int _length, String _memodate, apiToken) async {
    var postData = {
      'page': _page,
      'length': _length,
      'memodate': _memodate,
    };
    response = await postTokenConnect(API_V1_SELVOCAMEMOLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return SelVocaMemoListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<SelVocaTestListModel> selVocaTestList(int _page, int _length, String _memodate, apiToken) async {
    var postData = {
      'page': _page,
      'length': _length,
      'memodate': _memodate,
    };
    response = await postTokenConnect(API_V1_SELVOCATESTLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return SelVocaTestListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }


  Future<SelVocaSolveListModel> selVocaSolveList(int _page, int _length, String _memodate, apiToken) async {
    var postData = {
      'page': _page,
      'length': _length,
      'memodate': _memodate,
    };
    response = await postTokenConnect(API_V1_SELVOCASOLVELIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return SelVocaSolveListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<SelVocaHistListModel> selVocaHistList(int _page, int _length, String _targetid, apiToken) async {
    var postData = {
      'page': _page,
      'length': _length,
      'targetid': _targetid,
    };
    response = await postTokenConnect(API_V1_SELVOCAHISTLIST, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return SelVocaHistListModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<AuthcheckModel> authcheck(apiToken) async {
    var postData = {
    };
    response = await postTokenConnect(API_V1_AUTHCHECK, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK || response.data['code'] == TOKEN_EXPIRE){
      Map<String,dynamic> map = response.data['data'];
      return AuthcheckModel.fromJson(map, response.data['code']);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

  Future<AppCheckerModel> appChecker(String _device, List<AppCheckDataModel> lists, apiToken) async {
    var postData = {
      'device': _device,
      'lists': lists.map((item) => item.toJson()).toList(),
    };

    response = await postTokenConnect(API_V1_APPCHECKER, postData, apiToken);
    if (kDebugMode) {
      print('res : ' + response.toString());
    }

    if(response.data['code'] == STATUS_OK){
      Map<String,dynamic> map = response.data['data'];
      return AppCheckerModel.fromJson(map);
    } else {
      throw ThrowError(response.data['code']);
    }
  }

}

