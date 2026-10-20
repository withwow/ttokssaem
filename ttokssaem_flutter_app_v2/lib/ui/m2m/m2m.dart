import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/bloc/updatem2m/bloc.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

class M2MPage extends StatefulWidget {

  final int m2mid;
  final String question;
  final String status;

  const M2MPage(this.m2mid, this.question, this.status);

  @override
  _M2MPageState createState() => _M2MPageState();
}

class _M2MPageState extends State<M2MPage> {

  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  late UpdateM2MBloc _updateM2MBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  late TextEditingController questionController;

  @override
  void initState() {

    _updateM2MBloc = BlocProvider.of<UpdateM2MBloc>(context);

    questionController = TextEditingController();
    questionController.text = widget.question;

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
              BlocListener<UpdateM2MBloc, UpdateM2MState>( listener: (context, state) {
                if(state is UpdateM2MError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is UpdateM2MWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is UpdateM2MSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data UpdateM2M : ${state.updateM2MData}');
                  }
                  _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
                }
              }),
            ],
            child: BodyForm()
        )
    );
  }

  BodyForm() {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('1:1 문의사항'),
      ),
      body: Center(
        child: ListView(
            padding: EdgeInsets.fromLTRB(32, 32, 32, 24),
            children: [
              TextFormField(
                minLines: 2,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                maxLength: 100,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: questionController,
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
                  });
                },
              ),
              SizedBox(
                height: 24,
              ),
              CupertinoButton(
                child: Text(
                  '수정',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {
                  int _m2mid = widget.m2mid;
                  String _question = questionController.text;
                  String _method = "update";

                  _updateM2MBloc.add(UpdateM2M(m2mid: _m2mid, question: _question, method: _method, apiToken: apiToken));
                },
              ),
              SizedBox(
                height: 24,
              ),
              CupertinoButton(
                child: Text(
                  '삭제',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {
                  int _m2mid = widget.m2mid;
                  String _question = questionController.text;
                  String _method = "delete";

                  _updateM2MBloc.add(UpdateM2M(m2mid: _m2mid, question: _question, method: _method, apiToken: apiToken));
                },
              ),            ]
        ),
      ),
    );
  }
}