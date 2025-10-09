import 'package:dio/dio.dart';
import 'package:url_launcher/url_launcher.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/network/api_provider.dart';
import 'package:ttokssaem_flutter_app/bloc/joinMember/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/checkMemberId/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

import 'package:ttokssaem_flutter_app/model/neis_model.dart';

const List<String> typeItems = <String>['학생입니다', '부모(엄마)입니다', '부모(아빠등 그외)입니다'];
const List<String> typeItemValues = <String>['S', 'P', 'P'];
const List<String> typeLabelValues = <String>['이름', '"ooo(학생이름) 엄마"로 입력', '"ooo(학생이름) 아빠"로 입력'];

const List<String> gradeItems = <String>[
  '학년선택',
  '1학년',
  '2학년',
  '3학년',
  '재수',
  'N수',
  '기타',
];
const List<String> gradeItemValues = <String>['', '1', '2', '3', '4', '5', '6'];

const List<String> genderItems = <String>[
  '성별선택',
  '남자',
  '여자',
];
const List<String> genderItemValues = <String>['', 'M', 'F'];

class SignupPage extends StatefulWidget {
  @override
  _SignupPageState createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {

  bool _obscure1Text = true;
  IconData _icon1Visible = Icons.visibility_off;

  bool _obscure2Text = true;
  IconData _icon2Visible = Icons.visibility_off;

  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late JoinMemberBloc _joinMemberBloc;
  late CheckMemberIdBloc _checkMemberIdBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  final TextEditingController _typeAheadController = TextEditingController();

  // Initial Selected Index
  int selectTypeIndex = 0;
  int selectGradeIndex = 0;
  int selectGenderIndex = 0;

  bool boolCheckMemberId = false;
  bool boolCheckService = false;
  bool boolCheckPrivacy = false;

  double _height_h1 = 10;
  double _height_h2 = 30;
  double _height_h3 = 30;
  double _height_h4 = 40;
  double _height_h5 = 50;

  String textBranchId = '';
  String textMemberId = '';
  String textMemberPw1 = '';
  String textMemberPw2 = '';
  String textType = '';
  String textMemberName = '';
  String textSchoolName = '';
  String textGrade = '';
  String textGender = '';
  String textContact = '';
  String textEmail = '';
  String textPushtoekn = '';

  String textNameLabel = '이름';

  void _toggleObscure1Text() {
    setState(() {
      _obscure1Text = !_obscure1Text;
      if (_obscure1Text == true) {
        _icon1Visible = Icons.visibility_off;
      } else {
        _icon1Visible = Icons.visibility;
      }
    });
  }

  void _toggleObscure2Text() {
    setState(() {
      _obscure2Text = !_obscure2Text;
      if (_obscure2Text == true) {
        _icon2Visible = Icons.visibility_off;
      } else {
        _icon2Visible = Icons.visibility;
      }
    });
  }

  @override
  void initState() {

    _joinMemberBloc = BlocProvider.of<JoinMemberBloc>(context);
    _checkMemberIdBloc = BlocProvider.of<CheckMemberIdBloc>(context);

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
              BlocListener<JoinMemberBloc, JoinMemberState>( listener: (context, state) {
                if(state is JoinMemberError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is JoinMemberWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is JoinMemberSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data JoinMember : ${state.joinMemberData.lastid}');
                  }
                  _globalFunction.showSuccessToast('회원가입되었습니다. 승인후 로그인 하실 수 있습니다.');
                }
              }),
              BlocListener<CheckMemberIdBloc, CheckMemberIdState>( listener: (context, state) {
                if(state is CheckMemberIdError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is CheckMemberIdWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is CheckMemberIdSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data CheckMemberId : ${state.checkMemberIdData.length}');
                  }
                  if( state.checkMemberIdData.length == 0) {
                    boolCheckMemberId = true;
                    _globalFunction.showSuccessToast('사용가능한 아이디입니다');
                  } else {
                    boolCheckMemberId = false;
                    _globalFunction.showFailedToast('이미 사용중인 아이디입니다');
                  }

                }
              }),
            ],
            child: JoinMemberForm()
        )
    );
  }

  JoinMemberForm() {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('회원가입'),
      ),
      body: Center(
        child: ListView(
            padding: EdgeInsets.fromLTRB(32, 32, 32, 32),
            children: [
              TextField(
                keyboardType: TextInputType.emailAddress,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '아이디',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textMemberId = text;
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              CupertinoButton(
                child: Text(
                  '아이디 중복 검사',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {
                  String _memberid = textMemberId;
                  if(_memberid != '') {
                     if(_globalFunction.containsSpecialCharacters(_memberid)){
                       _globalFunction.showFailedToast('특수문자가 포함되어 있습니다');
                     } else {
                       _checkMemberIdBloc.add(CheckMemberId(
                           memberid: _memberid, apiToken: apiToken));
                     }
                  } else {
                    _globalFunction.showFailedToast('아이디를 입력하여 주세요');
                  }
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextField(
                obscureText: _obscure1Text,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '비밀번호',
                    labelStyle: TextStyle(color: _labeltextColor),
                    suffixIcon: IconButton(
                      icon: Icon(_icon1Visible, color: BLACK55, size: 20),
                      onPressed: () {
                        _toggleObscure1Text();
                      }),
                ),
                onChanged: (text) {
                  setState(() {
                    textMemberPw1 = text;
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextField(
                obscureText: _obscure2Text,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                  focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _borderColor, width: 2.0)
                  ),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: _underlineColor),
                  ),
                  labelText: '비밀번호 확인',
                  labelStyle: TextStyle(color: _labeltextColor),
                  suffixIcon: IconButton(
                      icon: Icon(_icon2Visible, color: BLACK55, size: 20),
                      onPressed: () {
                        _toggleObscure2Text();
                      }),
                ),
                onChanged: (text) {
                  setState(() {
                    textMemberPw2 = text;
                  });
                },
              ),
              SizedBox(
                height: _height_h3,
              ),
              Text(
                '회원 구분',
                style: TextStyle(
                    fontSize: 16,
                    color: _labeltextColor ),
                textAlign: TextAlign.left,
              ),
              DropdownButton(
                isExpanded: true,
                value: typeItems[selectTypeIndex],
                icon: const Icon(Icons.arrow_drop_down),
                items: typeItems.map((String items) {
                  return DropdownMenuItem(
                    value: items,
                    child: Text(items,
                      style: TextStyle(
                          fontSize: 16,
                         color: _textColor ),
                    ),
                  );
                }).toList(),
                underline: Container( height: 1, color: _underlineColor),
                onChanged: (String? newValue) {
                  setState(() {
                    selectTypeIndex = typeItems.indexOf(newValue!);
                    textNameLabel = typeLabelValues[selectTypeIndex];
                  });
                },
              ),
              SizedBox(
                height: _height_h3,
              ),
              SizedBox(
                height: _height_h1,
              ),
              TypeAheadField<NeisModel>(
                controller: _typeAheadController,
                suggestionsCallback: (pattern) async {
                  return await ApiProvider.neis(pattern, apiToken);
                },
                itemBuilder: (context, NeisModel suggestion) {
                  return ListTile(
                    leading: const Icon(Icons.school),
                    title: Text(suggestion.SCHUL_NM),
                    subtitle: Text(suggestion.ATPT_OFCDC_SC_NM),
                  );
                },
                emptyBuilder: (context) {
                  return const Padding(
                    padding: EdgeInsets.all(8.0),
                    child: Text('일치하는 학교가 없습니다!'),
                  );
                },
                onSelected: (NeisModel suggestion) {
                  textSchoolName = _typeAheadController.text = suggestion.SCHUL_NM;
                },
                builder: (context, controller, focusNode) {
                  return TextField(
                    controller: controller,
                    focusNode: focusNode,
                    style: TextStyle(color: _textColor),
                    decoration: InputDecoration(
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0),
                      ),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _underlineColor),
                      ),
                      hintText: '학교명으로 검색',
                      hintStyle: TextStyle(color: SOFT_GRAY),
                      labelText: '학교',
                      labelStyle: TextStyle(color: _labeltextColor),
                    ),
                  );
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              Text(
                '학년',
                style: TextStyle(
                    fontSize: 16,
                    color: _labeltextColor ),
                textAlign: TextAlign.left,
              ),
              DropdownButton(
                isExpanded: true,
                value: gradeItems[selectGradeIndex],
                icon: const Icon(Icons.arrow_drop_down),
                items: gradeItems.map((String items) {
                  return DropdownMenuItem(
                    value: items,
                    child: Text(items,
                      style: TextStyle(
                          fontSize: 16,
                          color: _textColor ),
                    ),
                  );
                }).toList(),
                underline: Container( height: 1, color: _underlineColor),
                onChanged: (String? newValue) {
                  setState(() {
                    selectGradeIndex = gradeItems.indexOf(newValue!);
                  });
                },
              ),
              SizedBox(
                height: _height_h3,
              ),
              TextField(
                keyboardType: TextInputType.text,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: textNameLabel,
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textMemberName = text;
                  });
                },
              ),
              SizedBox(
                height: _height_h3,
              ),
              Text(
                '성별',
                style: TextStyle(
                    fontSize: 16,
                    color: _labeltextColor ),
                textAlign: TextAlign.left,
              ),
              DropdownButton(
                isExpanded: true,
                value: genderItems[selectGenderIndex],
                icon: const Icon(Icons.arrow_drop_down),
                items: genderItems.map((String items) {
                  return DropdownMenuItem(
                    value: items,
                    child: Text(items,
                      style: TextStyle(
                          fontSize: 16,
                          color: _textColor ),
                    ),
                  );
                }).toList(),
                underline: Container( height: 1, color: _underlineColor),
                onChanged: (String? newValue) {
                  setState(() {
                    selectGenderIndex = genderItems.indexOf(newValue!);
                  });
                },
              ),
              SizedBox(
                height: _height_h3,
              ),
              TextField(
                keyboardType: TextInputType.number,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '연락처',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textContact = text;
                  });
                },
              ),
              SizedBox(
                height: _height_h3,
              ),
              TextField(
                keyboardType: TextInputType.emailAddress,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '이메일',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textEmail = text;
                  });
                },
              ),
              SizedBox(
                height: _height_h2,
              ),
              Column(
                  children: <Widget>[
                    ListTile(
                      title: GestureDetector(
                        onTap: () async {
                          final Uri _url = Uri.parse('https://www.ttokssaem.com/service');
                          if (!await launchUrl(_url)) throw 'Could not launch $_url';
                        },
                        child: Text('서비스이용약관 동의',
                            style: TextStyle(
                                color: _labeltextColor,
                                fontSize: 16,
                                decoration: TextDecoration.underline,
                            ),
                            textAlign: TextAlign.left
                        ),
                      ),
                      leading: CupertinoSwitch(
                        activeColor: SOFT_GREEN,
                        trackColor: SOFT_GRAY,
                        value: boolCheckService,
                        onChanged: (bool value) { setState(() { boolCheckService = value; }); },
                      ),
                    )
                  ],
              ),
              Column(
                children: <Widget>[
                  ListTile(
                    title: GestureDetector(
                      onTap: () async {
                        final Uri _url = Uri.parse('https://www.ttokssaem.com/privacy');
                        if (!await launchUrl(_url)) throw 'Could not launch $_url';
                      },
                      child: Text('개인정보처리방침 동의',
                          style: TextStyle(
                              color: _labeltextColor,
                              fontSize: 16,
                              decoration: TextDecoration.underline,
                          ),
                          textAlign: TextAlign.left
                      ),
                    ),
                    leading: CupertinoSwitch(
                      activeColor: SOFT_GREEN,
                      trackColor: SOFT_GRAY,
                      value: boolCheckPrivacy,
                      onChanged: (bool value) { setState(() { boolCheckPrivacy = value; }); },
                    ),
                  )
                ],
              ),
              SizedBox(
                height: _height_h2,
              ),
              CupertinoButton(
                child: Text(
                  '회원가입',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {

                  String _branchid = BRANCHID;
                  String _memberid = textMemberId;

                  String _memberpw = textMemberPw1;
                  String _type = typeItemValues[selectTypeIndex];
                  String _membername = textMemberName;
                  String _schoolname = textSchoolName;
                  String _grade = gradeItemValues[selectGradeIndex];
                  String _gender = genderItemValues[selectGenderIndex];
                  String _contact = textContact;
                  String _email = textEmail;

                  if(!boolCheckMemberId){
                    _globalFunction.showFailedToast('아이디 중복 확인해주세요');
                    return;
                  }

                  if(textMemberPw1.isEmpty
                    || textMemberPw2.isEmpty
                    || textMemberPw1 != textMemberPw2){
                    _globalFunction.showFailedToast('비밀번호가 불일치합니다.');
                    return;
                  }

                  if(textMemberName.isEmpty){
                    _globalFunction.showFailedToast('이름을 입력하여 주세요');
                    return;
                  }

                  if(!boolCheckService || !boolCheckPrivacy){
                    _globalFunction.showFailedToast('모든 약관에 동의해주세요.');
                    return;
                  }

                  _joinMemberBloc.add(JoinMember(
                      branchid: _branchid,
                      memberid: _memberid,
                      memberpw: _memberpw,
                      type: _type,
                      membername: _membername,
                      schoolname: _schoolname,
                      grade: _grade,
                      gender: _gender,
                      contact: _contact,
                      email: _email,
                      pushtoken: PUSHTOKEN!,
                      apiToken: apiToken));
                },
              ),
            ]
        ),
      ),
    );
  }
}