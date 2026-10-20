import 'package:dio/dio.dart';
import 'package:intl/intl.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';

import 'package:ttokssaem_flutter_app/bloc/todayStudyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/regStudyPlanList/bloc.dart';

import 'package:ttokssaem_flutter_app/model/todayStudyPlanList_model.dart';
import 'package:ttokssaem_flutter_app/model/regStudyPlanList_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

class StudentTodayExPage extends StatefulWidget {
  @override
  _StudentTodayExPageState createState() => _StudentTodayExPageState();
}

class _StudentTodayExPageState extends State<StudentTodayExPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  double _height_h1 = 10;
  double _height_h2 = 30;
  double _height_h3 = 30;
  double _height_h4 = 40;
  double _height_h5 = 50;

  List<TodayStudyPlanDataModel> _listTodayStudyPlanDataModel = [];
  List<TextEditingController> textController = [];

  late RegStudyPlanListBloc _regStudyPlanListBloc;
  late TodayStudyPlanListBloc _todayStudyPlanListBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API


  @override
  void initState() {
    // get data when initState
    for(int i = 0; i < 11; i++){
      TextEditingController controller = TextEditingController();
      textController.add(controller);
    }

    DateTime now = DateTime.now();
    DateTime twohoursago = now.subtract(const Duration(hours: 2));
    String _plandate = DateFormat('yyyyMMdd').format(twohoursago);

    _regStudyPlanListBloc = BlocProvider.of<RegStudyPlanListBloc>(context);

    _todayStudyPlanListBloc = BlocProvider.of<TodayStudyPlanListBloc>(context);
    _todayStudyPlanListBloc.add(TodayStudyPlanList(targetid:'', plandate: _plandate, apiToken: apiToken));

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
              BlocListener<TodayStudyPlanListBloc, TodayStudyPlanListState>( listener: (context, state) {
                if(state is TodayStudyPlanListError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is TodayStudyPlanListWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is TodayStudyPlanListSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data TodayStudyPlanList : ${state.todayStudyPlanListData}');
                  }

                  state.todayStudyPlanListData.listData.forEach((element) {
                    if( (element.classhour-1) >= 0)
                      textController[element.classhour-1].text = element.study;
                  });

                }
              }),
              BlocListener<RegStudyPlanListBloc, RegStudyPlanListState>( listener: (context, state) {
                if(state is RegStudyPlanListError) {
                  Navigator.pop(context);
                  Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                }
                if(state is RegStudyPlanListWaiting) {
                  FocusScope.of(context).unfocus();
                  _globalFunction.showProgressDialog(context);
                }
                if(state is RegStudyPlanListSuccess) {
                  Navigator.pop(context);

                  if (kDebugMode) {
                    print('data RegStudyPlanLis : ${state.regStudyPlanListData}');
                  }

                  _globalFunction.showSuccessToast('정상적으로 반영하였습니다.');

                }
              }),
            ],
            child: TodayStudyPlanForm()
        )
    );
  }

  clearPlan(){
    for(int i = 0; i < 10; i++){
      textController[i].clear();
    }
  }

  TodayStudyPlanForm() {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('오늘의 학습계획'),
      ),
      body: Center(
        child: ListView(
            padding: EdgeInsets.fromLTRB(32, 32, 32, 32),
            children: [
            CupertinoButton(
                child: Text(
                '어제 계획 불러오기',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {

                  clearPlan();

                  DateTime now = DateTime.now();
                  DateTime yesrterday = now.subtract(const Duration(hours: 26)); // 24 + 2(새벽 2시)
                  String _plandate = DateFormat('yyyyMMdd').format(yesrterday);

                  _todayStudyPlanListBloc.add(TodayStudyPlanList(targetid:'', plandate: _plandate, apiToken: apiToken));
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[0],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '0교시 08:00 ~ 08:30',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[1],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '1교시 08:40 ~ 10:00',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[2],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '2교시 10:30 ~ 12:10',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[3],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '점심시간 12:10 ~ 13:00',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[4],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '3교시 13:10 ~ 14:20',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[5],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '4교시 14:50 ~ 16:37',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[6],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '저녁시간 16:40 ~ 17:59',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[7],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '5교시 18:00 ~ 19:50',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[8],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '6교시 20:00 ~ 21:50',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[9],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '7교시 22:00 ~ 23:50',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              TextFormField(
                minLines: 3,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: _textColor),
                cursorColor: _cursorColor,
                controller: textController[10],
                decoration: InputDecoration(
                    focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(color: _borderColor, width: 2.0)
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: _underlineColor),
                    ),
                    labelText: '8교시 24:00 ~ 01:00',
                    labelStyle: TextStyle(color: _labeltextColor)),
                onChanged: (text) {
                  setState(() {
                  });
                },
              ),
              SizedBox(
                height: _height_h2,
              ),
              CupertinoButton(
                child: Text(
                  '학습계획 반영',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: BUTTON_TEXT_COLOR ),
                  textAlign: TextAlign.center,
                ),
                color: BUTTON_COLOR,
                disabledColor: BUTTON_DISABLED_COLOR,
                onPressed: () {

                  DateTime now = DateTime.now();
                  DateTime twohoursago = now.subtract(const Duration(hours: 2));
                  String _plandate = DateFormat('yyyyMMdd').format(twohoursago);

                  _listTodayStudyPlanDataModel.clear();

                  for(int i = 0; i < 11; i++) {
                    if( textController[i].text.isNotEmpty ){
                      TodayStudyPlanDataModel model = TodayStudyPlanDataModel();
                      model.classhour = i + 1;
                      model.study = textController[i].text;
                      _listTodayStudyPlanDataModel.add(model);
                    }
                  }

                  _regStudyPlanListBloc.add(RegStudyPlanList(plandate: _plandate, lists: _listTodayStudyPlanDataModel, apiToken: apiToken));

                },
              )
            ]
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

