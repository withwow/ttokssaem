import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/bloc/requestm2m/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class RequestM2MPage extends StatefulWidget {
  @override
  _RequestM2MPageState createState() => _RequestM2MPageState();
}

class _RequestM2MPageState extends State<RequestM2MPage> {

  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();


  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late RequestM2MBloc _requestM2MBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  String textMessage = '';
  late TextEditingController questionController;

  @override
  void initState() {

    _requestM2MBloc = BlocProvider.of<RequestM2MBloc>(context);
    questionController = TextEditingController();

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
              BlocListener<RequestM2MBloc, RequestM2MState>( listener: (context, state) {
                if(state is RequestM2MError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is RequestM2MWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is RequestM2MSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data RequestM2M : ${state.requestM2MData}');
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
        title: const Text('1:1 문의하기'),
      ),
      body: Center(
        child: ListView(
            padding: EdgeInsets.fromLTRB(32, 32, 32, 24),
            children: [
            Text.rich(
              TextSpan(
                text: '출결(지각,조퇴,결석) 사항과 간단한 문의는 이곳에 남겨주시면 근무중인 선생님이 확인후 바로 처리 및 답변 드리도록 하겠습니다.',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)
                ),
              ),
              TextFormField(
                minLines: 2,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                maxLength: 100,
                controller: questionController,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '문의사항',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                    textMessage = text;
                  });
                },
              ),
              SizedBox(
                height: 24,
              ),
              CupertinoButton(
                child: Text(
                  '문의사항 등록',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {
                  String _message = questionController.text;
                  questionController.text = '';
                  if(_message.isNotEmpty) {
                    _requestM2MBloc.add(RequestM2M(message: _message, apiToken: apiToken));
                  } else {
                    Fluttertoast.showToast(msg: '내용이 비었습니다.', toastLength: Toast.LENGTH_SHORT, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                  }
                },
              ),
            ]
        ),
      ),
    );
  }
}