import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/bloc/findpw/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class FindpwPage extends StatefulWidget {
  @override
  _FindpwPageState createState() => _FindpwPageState();
}

class _FindpwPageState extends State<FindpwPage> {

  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late FindpwBloc _findpwBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  String textMemberId = '';
  String textMemberName = '';
  String textContact = '';

  @override
  void initState() {

    _findpwBloc = BlocProvider.of<FindpwBloc>(context);

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
              BlocListener<FindpwBloc, FindpwState>( listener: (context, state) {
                if(state is FindpwError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is FindpwWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is FindpwSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data findpw : ${state.findpwData}');
                  }
                  _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
                }
              }),
            ],
            child: FindpwForm()
        )
    );
  }

  FindpwForm() {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('비밀번호 찾기'),
      ),
      body: Center(
        child: ListView(
            padding: EdgeInsets.fromLTRB(32, 32, 32, 24),
            children: [
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
                    labelText: '아이디',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textMemberId = text;
                  });
                },
              ),
              SizedBox(
                height: 24,
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
                    labelText: '이름',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textMemberName = text;
                  });
                },
              ),
              SizedBox(
                height: 24,
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
                    labelText: '전화번호',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textContact = text;
                  });
                },
              ),
              SizedBox(
                height: 24,
              ),
              CupertinoButton(
                child: Text(
                  '메일로 전송요청',
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
                  String _membername = textMemberName;
                  String _contact = textContact;

                  _findpwBloc.add(Findpw(memberid: _memberid, membername: _membername, contact: _contact, apiToken: apiToken));
                },
              ),
            ]
        ),
      ),
    );
  }
}