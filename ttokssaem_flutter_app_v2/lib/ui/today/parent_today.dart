import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import 'package:badges/badges.dart';

import 'package:flutter/material.dart';
import 'package:ttokssaem_flutter_app/model/timetable_model.dart';
import 'package:ttokssaem_flutter_app/reusable/timetable_repository.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/bloc/studyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/studyPlanList_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

class ParentTodayPage extends StatefulWidget {
  @override
  _ParentTodayPageState createState() => _ParentTodayPageState();
}

class _ParentTodayPageState extends State<ParentTodayPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

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

  List<StudyPlanDataModel> _listStudyPlanDataModel = [];

  late StudyPlanListBloc _studyPlanListBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  bool _lastStudyPlanData = false;

  TimetableModel? _timetable; // 오늘(02시 기준) 시간표


  @override
  void initState() {
    // get data when initState
    DateTime now = DateTime.now();
    DateTime twohoursago = now.subtract(const Duration(hours: 2));
    String _plandate = DateFormat('yyyyMMdd').format(twohoursago);

    _studyPlanListBloc = BlocProvider.of<StudyPlanListBloc>(context);
    _studyPlanListBloc.add(StudyPlanList(targetid: TARGETID, plandate: _plandate, apiToken: apiToken));

    TimetableRepository.instance.get(_plandate, apiToken: apiToken).then((timetable) {
      if (mounted) setState(() { _timetable = timetable; });
    });

    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  String timeStamp(plandate){
    String stamp = '';

    stamp = '${plandate.substring(0,4)}.${plandate.substring(4,6)}.${plandate.substring(6,8)}';

    return stamp;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('오늘 학습계획'),
      ),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: EdgeInsets.symmetric(vertical: 0),
              child: Chip(
                label: Text(TARGETNAME, style: TextStyle(
                    fontSize: 18, color: Colors.white, fontWeight: FontWeight.w500
                )),
                backgroundColor: Colors.black54,
              ),
            ),
            Container(
              margin: EdgeInsets.symmetric(vertical: 0),
              child: BlocListener<StudyPlanListBloc, StudyPlanListState>(
                listener: (context, state) {
                  if(state is StudyPlanListError) {
                    Fluttertoast.showToast(
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 13.0,
                        msg: state.errorMessage,
                        toastLength: Toast.LENGTH_LONG);
                  }
                  if(state is StudyPlanListSuccess) {
                    //_scrollController.addListener(_onScroll);
                    if(state.studyPlanListData.listData.length == 0){
                      _lastStudyPlanData = true;
                    } else {
                      _listStudyPlanDataModel.addAll(state.studyPlanListData.listData);
                    }
                  }
                },
                child: BlocBuilder<StudyPlanListBloc, StudyPlanListState>(
                  builder: (context, state) {
                    if(state is StudyPlanListError) {
                      return Container(
                          child: Center(
                              child: Text('잠시 후 다시 시도하여 주세요', style: TextStyle(
                                  fontSize: 14,
                                  color: Color(0xff777777)
                              ))
                          )
                      );
                    } else {
                      if (_lastStudyPlanData) {
                        return Container(
                            child: Center(
                                child: Text('등록된 오늘 학습계획 없음', style: TextStyle(
                                    fontSize: 14,
                                    color: Color(0xff777777)
                                ))
                            )
                        );
                      } else {
                        if (_listStudyPlanDataModel.length == 0) {
                          return _shimmerLoading.buildShimmerContent();
                        } else {
                          return ListView.builder(
                            itemCount: _listStudyPlanDataModel.length,
                            shrinkWrap: true,
                            primary: false,
                            // Add one more item for progress indicator
                            padding: EdgeInsets.symmetric(vertical: 0),
                            itemBuilder: (BuildContext context, int index) {
                              return _buildPlan(index);
                            },
                          );
                        }
                      }
                    }
                  },
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


  // 교시 이름은 학습계획 날짜의 시간표(수능/평시)로 표시한다
  String classname(classhour) {
    final TimetableModel? timetable = _timetable;
    if (timetable == null) return '';
    return timetable.shortLabelOf(classhour is int ? classhour : int.tryParse(classhour.toString()) ?? 0);
  }

  Widget _buildPlan(index){
    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () {
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 8),
        color: Colors.white,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Container(
              height: 70,
              child: Text(classname(_listStudyPlanDataModel[index].classhour), style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: TTOK_GREEN)),
              color: Colors.transparent,
            ),
            SizedBox(
              width: 10,
            ),
            Flexible(
              fit: FlexFit.tight,
              child: Container(
                height: 70,
                child: Text(_listStudyPlanDataModel[index].study, style: TextStyle(
                  color: BLACK77,
                )),
                color: Colors.transparent,
              ),
            ),
          ],
        ),
      ),
    );
  }

}

