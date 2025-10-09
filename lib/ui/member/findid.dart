import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/bloc/findid/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class FindidPage extends StatefulWidget {
  @override
  _FindidPageState createState() => _FindidPageState();
}

class _FindidPageState extends State<FindidPage> {

  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late FindidBloc _findidBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  String textMemberName = '';
  String textContact = '';

  @override
  void initState() {

    _findidBloc = BlocProvider.of<FindidBloc>(context);

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
              BlocListener<FindidBloc, FindidState>( listener: (context, state) {
                if(state is FindidError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is FindidWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is FindidSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data findid : ${state.findidData}');
                  }
                  _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
                }
              }),
            ],
            child: FindidForm()
        )
    );
  }

  FindidForm() {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('아이디 찾기'),
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
                  String _membername = textMemberName;
                  String _contact = textContact;

                  _findidBloc.add(Findid(membername: _membername, contact: _contact, apiToken: apiToken));
                },
              ),
            ]
        ),
      ),
    );
  }
}