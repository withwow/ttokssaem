import 'package:dio/dio.dart';
import 'package:badges/badges.dart' as custom_badge;
import 'package:flutter/material.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/bloc/studyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/studyPlanList_model.dart';

class StudyPlanPage extends StatefulWidget {

  final String targetid;
  final String plandate;

  const StudyPlanPage(this.targetid, this.plandate);

  @override
  _StudyPlanPageState createState() => _StudyPlanPageState();
}

class _StudyPlanPageState extends State<StudyPlanPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<StudyPlanDataModel> _listStudyPlanDataModel = [];

  late StudyPlanListBloc _studyPlanListBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  bool _lastStudyPlanData = false;

  @override
  void initState() {
    // get data when initState
    _studyPlanListBloc = BlocProvider.of<StudyPlanListBloc>(context);
    _studyPlanListBloc.add(StudyPlanList(targetid: widget.targetid, plandate: widget.plandate, apiToken: apiToken));

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
        title: const Text('지난 학습계획'),
      ),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: EdgeInsets.symmetric(vertical: 8),
              child: Chip(
                label: Text(timeStamp(widget.plandate), style: TextStyle(
                    fontSize: 18, color: Colors.white, fontWeight: FontWeight.w500
                )),
                backgroundColor: SOFT_GREEN,
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
                                child: Text('등록된 학습계획 없음', style: TextStyle(
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
    );
  }

   String classname(classhour) {

    // 수능 시간표 적용 날짜에 따라 아래 날짜 변경
    // 수승 시간표 적용 기간
    DateTime startTime = DateTime.parse('2026-10-19 00:00:00'); // 수능시간표 시작 날짜
    DateTime finishTime = DateTime.parse('2026-11-20 00:00:00'); // 금요일

    DateTime dateTime = DateTime.parse('${widget.plandate} 00:00:00');

    if( dateTime.isBefore(finishTime) && dateTime.isAfter(startTime) ) {
      // 수능 시간표 기간 : 수능 앱 버전과 상관없음, 수능기간의 학습 계획의 표현임
      switch (classhour) {
        case 1:
          return "0교시";
        case 2:
          return "1교시";
        case 3:
          return "2교시";
        case 4:
          return "점  심";
        case 5:
          return "3교시";
        case 6:
          return "4교시";
        case 7:
          return "저  녁";
        case 8:
          return "5교시";
        case 9:
          return "6교시";
        case 10:
          return "7교시";
        case 11:
          return "8교시";
        default:
          return "없  음";
      }
    } else {
      // 일반 시간표 기간
      switch (classhour) {
        case 1:
          return "1교시";
        case 2:
          return "2교시";
        case 3:
          return "점  심";
        case 4:
          return "3교시";
        case 5:
          return "4교시";
        case 6:
          return "저  녁";
        case 7:
          return "5교시";
        case 8:
          return "6교시";
        case 9:
          return "7교시";
        case 10:
          return "8교시";
        default:
          return "없  음";
      }
    }

  }

  Widget _buildPlan(index){
    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () {
      },
      child: Container(
        color: Colors.white,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
                margin: EdgeInsets.all(16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(classname(_listStudyPlanDataModel[index].classhour),
                        style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: TTOK_GREEN)),
                    SizedBox(
                      width: 10,
                    ),
                    custom_badge.Badge(
                      child: Icon(Icons.article, size: 25, color: Colors.black,), //icon style
                      badgeContent: SizedBox(
                          width: 10, height: 10, //badge size
                          child:Center(  //aligh badge content to center
                            child:Text('${_listStudyPlanDataModel[index].plancount}', style: TextStyle(
                                color: TTOK_GREEN,  //badge font color
                                fontSize: 13 //badge font size
                            )
                            ),
                          )
                      ),
                      badgeColor: TTOK_YELLOW, //badge background color
                    ),
                    SizedBox(
                      width: 5,
                    ),
                    custom_badge.Badge(
                      child: Icon(Icons.done, size: 25, color: Colors.black,), //icon style
                      badgeContent: SizedBox(
                          width: 10, height: 10, //badge size
                          child:Center(  //aligh badge content to center
                            child:Text('${_listStudyPlanDataModel[index].achievecount}', style: TextStyle(
                                color: TTOK_GREEN,  //badge font color
                                fontSize: 10 //badge font size
                            )
                            ),
                          )
                      ),
                      badgeColor: _listStudyPlanDataModel[index].plancount != _listStudyPlanDataModel[index].achievecount  ?  Colors.grey: TTOK_PINK, //badge background color
                    ),
                    SizedBox(
                      width: 10,
                    ),
                    Text(_listStudyPlanDataModel[index].study,
                        style: TextStyle(
                          color: BLACK77,
                        )),

                  ],
                )),
            Divider(
              height: 1,
              color: Colors.grey[400],
            ),
          ],
        ),
      ),
    );
  }


}

