import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/timetable_repository.dart';

import 'package:ttokssaem_flutter_app/bloc/todayStudyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/regStudyPlanList/bloc.dart';

import 'package:ttokssaem_flutter_app/model/todayStudyPlanList_model.dart';
import 'package:ttokssaem_flutter_app/model/timetable_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

/*
 * 오늘의 학습계획 입력 (평시/수능 공용)
 *  - 입력칸은 오늘(02시 기준) 날짜의 시간표(/api/v1/timetable)로 그린다.
 *    수능 기간은 어드민 > 시간표 기간 관리에서 설정하므로 매년 소스를 바꿀 필요가 없다.
 *  - 저장 규칙은 기존과 같다: classhour = 시간표 칸 번호(studyplan.class)
 */
class StudentTodayPage extends StatefulWidget {
  @override
  _StudentTodayPageState createState() => _StudentTodayPageState();
}

class _StudentTodayPageState extends State<StudentTodayPage> {
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

  List<TodayStudyPlanDataModel> _listTodayStudyPlanDataModel = [];

  // 입력칸: 시간표 칸 + (시간표에 없는 칸의 기존 데이터가 있으면) 추가 칸
  List<_PlanField> _fields = [];

  // 화면을 연 날짜와 그 날짜의 시간표
  String _plandate = '';
  TimetableModel? _timetable;

  // "어제 계획 불러오기" 중이면 어제 시간표 (시간표가 다르면 교시 code 로 맞춘다)
  TimetableModel? _yesterdayTimetable;

  late RegStudyPlanListBloc _regStudyPlanListBloc;
  late TodayStudyPlanListBloc _todayStudyPlanListBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API


  @override
  void initState() {
    _regStudyPlanListBloc = BlocProvider.of<RegStudyPlanListBloc>(context);
    _todayStudyPlanListBloc = BlocProvider.of<TodayStudyPlanListBloc>(context);

    _loadToday();

    super.initState();
  }

  @override
  void dispose() {
    for (final field in _fields) {
      field.controller.dispose();
    }
    super.dispose();
  }

  // 오늘 시간표를 받아 입력칸을 만든 뒤 오늘 계획을 불러온다
  Future<void> _loadToday() async {
    final String plandate = TimetableRepository.todayPlandate();
    final TimetableModel timetable = await TimetableRepository.instance.get(plandate, apiToken: apiToken);
    if (!mounted) return;

    setState(() {
      _plandate = plandate;
      _applyTimetable(timetable);
    });

    _yesterdayTimetable = null;
    _todayStudyPlanListBloc.add(TodayStudyPlanList(targetid:'', plandate: _plandate, apiToken: apiToken));
  }

  void _applyTimetable(TimetableModel timetable) {
    for (final field in _fields) {
      field.controller.dispose();
    }
    _timetable = timetable;
    _fields = timetable.slots
        .map((slot) => _PlanField(slot.classhour, slot.fieldLabel, TextEditingController(), false))
        .toList();
  }

  _PlanField _fieldOf(int classhour) {
    for (final field in _fields) {
      if (field.classhour == classhour) return field;
    }
    // 시간표에 없는 칸의 기존 데이터: 칸을 만들어 보여주고, 저장할 때 지워지지 않게 한다
    final field = _PlanField(classhour, '$classhour번 칸 (현재 시간표에 없음)', TextEditingController(), true);
    _fields.add(field);
    _fields.sort((a, b) => a.classhour.compareTo(b.classhour));
    return field;
  }

  void _fillPlans(List<TodayStudyPlanDataModel> plans) {
    final TimetableModel? today = _timetable;
    final TimetableModel? yesterday = _yesterdayTimetable;
    _yesterdayTimetable = null;

    // 어제와 시간표가 다르면 class 번호가 아니라 교시(code)로 맞춘다
    if (today != null && yesterday != null && today.mode != yesterday.mode) {
      List<String> skipped = [];
      for (final element in plans) {
        final fromSlot = yesterday.slotOf(element.classhour);
        final toSlot = fromSlot == null ? null : today.slotOfCode(fromSlot.code);
        if (toSlot != null) {
          _fieldOf(toSlot.classhour).controller.text = element.study;
        } else {
          skipped.add(fromSlot == null ? '${element.classhour}번 칸' : fromSlot.label);
        }
      }
      if (skipped.isNotEmpty) {
        Fluttertoast.showToast(
            msg: '어제는 ${yesterday.isCsat ? '수능' : '평시'} 시간표였어요. 오늘 시간표에 없는 ${skipped.join(', ')} 계획은 불러오지 않았어요.',
            toastLength: Toast.LENGTH_LONG,
            fontSize: 13);
      }
      return;
    }

    for (final element in plans) {
      if (element.classhour >= 1) {
        _fieldOf(element.classhour).controller.text = element.study;
      }
    }
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

                  setState(() {
                    _fillPlans(state.todayStudyPlanListData.listData);
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
    // 시간표에 없는 추가 칸은 지우고 시간표 칸만 남긴다
    _fields.removeWhere((field) {
      if (field.extra) field.controller.dispose();
      return field.extra;
    });
    for (final field in _fields) {
      field.controller.clear();
    }
  }

  Widget _planField(_PlanField field) {
    return Padding(
      padding: EdgeInsets.only(bottom: _height_h1),
      child: TextFormField(
        minLines: 3,
        keyboardType: TextInputType.multiline,
        maxLines: null,
        style: TextStyle(color: _textColor),
        cursorColor: _cursorColor,
        controller: field.controller,
        decoration: InputDecoration(
            focusedBorder: UnderlineInputBorder(
                borderSide: BorderSide(color: _borderColor, width: 2.0)
            ),
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: _underlineColor),
            ),
            labelText: field.label,
            labelStyle: TextStyle(color: field.extra ? Colors.red : _labeltextColor)),
        onChanged: (text) {
          setState(() {
          });
        },
      ),
    );
  }

  TodayStudyPlanForm() {
    final TimetableModel? timetable = _timetable;

    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: Text(timetable != null && timetable.isCsat ? '오늘의 학습계획 (수능 시간표)' : '오늘의 학습계획'),
      ),
      body: timetable == null
          ? Center(child: CircularProgressIndicator(color: TTOK_GREEN))
          : Center(
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
                onPressed: () async {

                  setState(() {
                    clearPlan();
                  });

                  String _yesterday = TimetableRepository.yesterdayPlandate();
                  final TimetableModel yesterdayTimetable = await TimetableRepository.instance.get(_yesterday, apiToken: apiToken);
                  if (!mounted) return;

                  _yesterdayTimetable = yesterdayTimetable;
                  _todayStudyPlanListBloc.add(TodayStudyPlanList(targetid:'', plandate: _yesterday, apiToken: apiToken));
                },
              ),
              SizedBox(
                height: _height_h1,
              ),
              ..._fields.map((field) => _planField(field)).toList(),
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

                  // 화면을 연 뒤 02시가 지나 날짜가 바뀌었으면 새 날짜의 시간표로 다시 그린다
                  String _nowPlandate = TimetableRepository.todayPlandate();
                  if (_nowPlandate != _plandate) {
                    Fluttertoast.showToast(msg: '날짜가 바뀌어 오늘 학습계획을 다시 불러왔어요. 확인 후 다시 반영해 주세요.', toastLength: Toast.LENGTH_LONG, fontSize: 13);
                    _loadToday();
                    return;
                  }

                  _listTodayStudyPlanDataModel.clear();

                  for (final field in _fields) {
                    if( field.controller.text.isNotEmpty ){
                      TodayStudyPlanDataModel model = TodayStudyPlanDataModel();
                      model.classhour = field.classhour;
                      model.study = field.controller.text;
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

class _PlanField {
  final int classhour;
  final String label;
  final TextEditingController controller;
  final bool extra; // 현재 시간표에 없는 칸

  _PlanField(this.classhour, this.label, this.controller, this.extra);
}
