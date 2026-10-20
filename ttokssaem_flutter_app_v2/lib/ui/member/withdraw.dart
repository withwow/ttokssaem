import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/bloc/withdraw/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class WithdrawPage extends StatefulWidget {
  @override
  _WithdrawPageState createState() => _WithdrawPageState();
}

class _WithdrawPageState extends State<WithdrawPage> {

  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  bool _obscureText = true;
  IconData _iconVisible = Icons.visibility_off;

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late WithdrawBloc _withdrawBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  String textMemberPw = '';

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

  @override
  void initState() {

    _withdrawBloc = BlocProvider.of<WithdrawBloc>(context);

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
              BlocListener<WithdrawBloc, WithdrawState>( listener: (context, state) {
                if(state is WithdrawError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is WithdrawWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is WithdrawSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data Withdraw : ${state.withdrawData}');
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
        title: const Text('회원탈퇴 신청'),
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
              CupertinoButton(
                child: Text(
                  '회원탈퇴 신청',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {
                  String _memberpw = textMemberPw;

                  _withdrawBloc.add(Withdraw(memberpw: _memberpw, apiToken: apiToken));
                },
              ),
            ]
        ),
      ),
    );
  }
}