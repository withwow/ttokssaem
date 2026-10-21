import 'package:url_launcher/url_launcher.dart';
import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

import 'package:ttokssaem_flutter_app/ui/splash_screen.dart';

import 'package:ttokssaem_flutter_app/ui/member/withdraw.dart';
import 'package:ttokssaem_flutter_app/ui/member/update_member_info.dart';
import 'package:ttokssaem_flutter_app/ui/member/update_password.dart';

import 'package:ttokssaem_flutter_app/bloc/memberInfo/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/updatePush/bloc.dart';

import 'package:ttokssaem_flutter_app/model/memberInfo_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';
import 'package:ttokssaem_flutter_app/ui/penalty/penalty_detail.dart';

class SettingPage extends StatefulWidget {
  @override
  _SettingPageState createState() => _SettingPageState();
}

class _SettingPageState extends State<SettingPage> {
  // initialize global widget
  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  bool boolCheckPush = false;
  String textMemberName = '';
  String textEmail = '';
  String textContact = '';

  late MemberInfoBloc _memberInfoBloc;
  late UpdatePushBloc _updatePushBloc;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  void _requestMemberInfo() async {
    _memberInfoBloc.add(MemberInfo(apiToken: apiToken));
  }

  void _requestPush(bool value) async {
    String push = value ? 'Y':'N';
    _updatePushBloc.add(UpdatePush(push: push, apiToken: apiToken));
  }


  void _setStateMemberInfo(MemberInfoModel model) {
    setState(() {
      boolCheckPush = model.push == 'Y' ? true : false;
      textMemberName = model.membername;
      textEmail = model.email;
      textContact = model.contact;
    });
  }

  @override
  void initState() {

    _memberInfoBloc = BlocProvider.of<MemberInfoBloc>(context);
    _updatePushBloc = BlocProvider.of<UpdatePushBloc>(context);

    _requestMemberInfo();

    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        onTap: () {
          FocusScopeNode currentFocus = FocusScope.of(context);

          if (!currentFocus.hasPrimaryFocus) {
            currentFocus.unfocus();
            // 화면 로테이션이 가능한 풀스크린 앱
            SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
          }
        },
        child: MultiBlocListener(
            listeners : [
              BlocListener<MemberInfoBloc, MemberInfoState>( listener: (context, state) {
                if(state is MemberInfoError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is MemberInfoWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is MemberInfoSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data MemberInfo : ${state.memberInfoData}');
                  }

                  _setStateMemberInfo(state.memberInfoData);
                }
              }),
              BlocListener<UpdatePushBloc, UpdatePushState>( listener: (context, state) {
                if(state is UpdatePushError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is UpdatePushWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is UpdatePushSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data UpdatePush : ${state.updatePushData}');
                  }


               }
              }),
            ],
            child: SettingForm()
        ),
    );
  }

  SettingForm() {
    return Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView (
          padding: EdgeInsets.fromLTRB(24, 24, 24, 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               Container(
                  alignment: Alignment.center,
                  child: Icon(Icons.account_circle, size: 180, color: Color(0xFFDDDDDD))
              ),
              if (TYPE == 'S')
                Container(
                  margin: const EdgeInsets.only(top: 8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF4F7F5),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ListTile(
                    leading: const Icon(Icons.warning_amber_rounded,
                        color: TTOK_GREEN),
                    title: const Text('벌점 조회',
                        style: TextStyle(
                            color: BLACK55, fontWeight: FontWeight.w600)),
                    trailing: const Icon(Icons.chevron_right, color: BLACK77),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const PenaltyDetailPage()),
                      );
                    },
                  ),
                ),
              Container(
                margin: EdgeInsets.only(top: 8),
                alignment: Alignment.center,
                child: Text(textMemberName, style: TextStyle(
                    fontSize: 24, fontWeight: FontWeight.bold, color: BLACK55
                )),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center, // 가운데 정렬
                children: [
                  Container(
                    margin: EdgeInsets.only(top: 8),
                    alignment: Alignment.center,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => UpdateMemberInfoPage(textMemberName, textContact, textEmail)));
                      },
                      child: Chip(
                        label: Text('정보 변경', style: TextStyle(
                            color: Colors.white
                        )),
                        backgroundColor: SOFT_GREEN,
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 8, top: 8),
                    alignment: Alignment.center,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => UpdatePasswordPage()));
                      },
                      child: Chip(
                        label: Text('비밀번호 변경', style: TextStyle(
                            color: Colors.white
                        )),
                        backgroundColor: SOFT_GREEN,
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 8, top: 8),
                    alignment: Alignment.center,
                    child: GestureDetector(
                      onTap: () {
                        TARGETID = '';
                        TARGETNAME = '';
                        Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (context) => SplashScreenPage()), (Route<dynamic> route) => false);
                      },
                      child: Chip(
                        label: Text('로그아웃', style: TextStyle(
                            color: Colors.black45
                        )),
                        backgroundColor: TTOK_YELLOW,
                      ),
                    ),
                  ),
                ],
              ),
              Container(
                margin: EdgeInsets.only(top: 8),
                padding: EdgeInsets.all(16),
                alignment: Alignment.centerLeft,
                decoration: BoxDecoration(
                  color: Color(0xFFEEEEEE),
                  borderRadius: BorderRadius.all(
                      Radius.circular(5.0)
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('이름', style: TextStyle(
                        color: Colors.grey[700], fontSize: 13
                    )),
                    SizedBox(height: 4),
                    Text(textMemberName, style: TextStyle(
                        color: BLACK55, fontSize: 15, fontWeight: FontWeight.bold
                    )),
                    SizedBox(height: 16),
                    Text('이메일', style: TextStyle(
                        color: Colors.grey[700], fontSize: 13
                    )),
                    SizedBox(height: 4),
                    Text(textEmail, style: TextStyle(
                        color: BLACK55, fontSize: 15, fontWeight: FontWeight.bold
                    )),
                    SizedBox(height: 16),
                    Text('전화번호', style: TextStyle(
                        color: Colors.grey[700], fontSize: 13
                    )),
                    SizedBox(height: 4),
                    Text(textContact, style: TextStyle(
                        color: BLACK55, fontSize: 15, fontWeight: FontWeight.bold
                    )),
                  ],
                ),
              ),
              Container(
                margin: EdgeInsets.only(top: 8),
                alignment: Alignment.centerLeft,
                child: Column(
                  children: <Widget>[
                    ListTile(
                      title: GestureDetector(
                        onTap: () {

                        },
                        child: Text('알림(입실,퇴실,기타 안내) 받음',
                            style: TextStyle(
                              color: _labeltextColor,
                              fontSize: 16,
                            ),
                            textAlign: TextAlign.left
                        ),
                      ),
                      leading: Transform.scale(
                        scale: 1,
                        child: CupertinoSwitch(
                          activeColor: SOFT_GREEN,
                          trackColor: SOFT_GRAY,
                          value: boolCheckPush,
                          onChanged: (bool value) {
                            setState(() {

                              _requestPush(value);

                              boolCheckPush = value;
                            });
                          },
                        ),
                      ),
                    )
                  ],
                ),
              ),
              Container(
                margin: EdgeInsets.only(left: 8, top: 16),
                alignment: Alignment.center,
                child: GestureDetector(
                  onTap: () async {
                    final Uri _url = Uri.parse('https://www.ttokssaem.com/service');
                    if (!await launchUrl(_url)) throw 'Could not launch $_url';
                  },
                  child:Text('서비스이용약관 보기',
                      style: TextStyle(
                        color: _labeltextColor,
                        decoration: TextDecoration.underline,
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.left
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.only(left: 8, top: 16),
                alignment: Alignment.center,
                child: GestureDetector(
                  onTap: () async {
                    final Uri _url = Uri.parse('https://www.ttokssaem.com/privacy');
                    if (!await launchUrl(_url)) throw 'Could not launch $_url';
                  },
                  child:Text('개인정보처리방침 보기',
                      style: TextStyle(
                        color: _labeltextColor,
                        decoration: TextDecoration.underline,
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.left
                  ),
                ),
              ),
              Container(
                margin: EdgeInsets.only(left: 8, top: 16),
                alignment: Alignment.center,
                child: GestureDetector(
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (context) => WithdrawPage()));
                  },
                  child:Text('회원탈퇴 신청',
                      style: TextStyle(
                        color: _labeltextColor,
                        decoration: TextDecoration.underline,
                        fontSize: 16,
                      ),
                      textAlign: TextAlign.left
                  ),
                ),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => RequestM2MPage()));
          },
          child: Icon(Icons.question_mark, color: TTOK_GREEN,),
          mini: true,
          backgroundColor: TTOK_YELLOW,
        ),
    );
  }
}
