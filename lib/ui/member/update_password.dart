import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/bloc/updatePassword/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class UpdatePasswordPage extends StatefulWidget {
  @override
  _UpdatePasswordPageState createState() => _UpdatePasswordPageState();
}

class _UpdatePasswordPageState extends State<UpdatePasswordPage> {

  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  bool _obscureText = true;
  IconData _iconVisible = Icons.visibility_off;

  bool _obscure1Text = true;
  IconData _icon1Visible = Icons.visibility_off;

  bool _obscure2Text = true;
  IconData _icon2Visible = Icons.visibility_off;

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late UpdatePasswordBloc _updatePasswordBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  String textMemberPw = '';
  String textMemberPw1 = '';
  String textMemberPw2 = '';


  void _toggleObscureText() {
    setState(() {
      _obscureText = !_obscureText;
      if (_obscureText == true) {
        _iconVisible = Icons.visibility_off;
      } else {
        _iconVisible = Icons.visibility;
      }
    });
  }

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

    _updatePasswordBloc = BlocProvider.of<UpdatePasswordBloc>(context);

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
              BlocListener<UpdatePasswordBloc, UpdatePasswordState>( listener: (context, state) {
                if(state is UpdatePasswordError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is UpdatePasswordWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is UpdatePasswordSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data UpdatePassword : ${state.updatePasswordData}');
                  }

                  _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
                }
              }),
            ],
            child: EditForm()
        )
    );
  }

  EditForm() {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('비밀번호 변경'),
      ),
      body: Center(
        child: ListView(
            padding: EdgeInsets.fromLTRB(32, 32, 32, 24),
            children: [
              TextField(
                obscureText: _obscureText,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                  focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _borderColor, width: 2.0)
                  ),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: _underlineColor),
                  ),
                  labelText: '현재 비밀번호',
                  labelStyle: TextStyle(color: _labeltextColor),
                  suffixIcon: IconButton(
                      icon: Icon(_iconVisible, color: BLACK55, size: 20),
                      onPressed: () {
                        _toggleObscureText();
                      }),
                ),
                onChanged: (text) {
                  setState(() {
                    textMemberPw = text;
                  });
                },
              ),
              SizedBox(
                height: 24,
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
                  labelText: '새로운 비밀번호',
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
                height: 24,
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
                height: 24,
              ),
              CupertinoButton(
                child: Text(
                  '비밀번호 변경',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {
                  String _cur_pw = textMemberPw;
                  String _after_pw = textMemberPw1;


                  if(textMemberPw.isEmpty){
                    _globalFunction.showFailedToast('비밀번호를 입력하여 주세요.');
                    return;
                  }

                  if(textMemberPw1.isEmpty
                      || textMemberPw2.isEmpty
                      || textMemberPw1 != textMemberPw2){
                    _globalFunction.showFailedToast('비밀번호가 불일치합니다.');
                    return;
                  }

                  _updatePasswordBloc.add(UpdatePassword(cur_pw: _cur_pw, after_pw: _after_pw, apiToken: apiToken));
                },
              ),
            ]
        ),
      ),
    );
  }
}