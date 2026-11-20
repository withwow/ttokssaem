import 'package:dio/dio.dart';
import 'package:intl/intl.dart';

import 'package:flutter/material.dart';
import 'package:ttokssaem_flutter_app/model/timetable_model.dart';
import 'package:ttokssaem_flutter_app/reusable/timetable_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/model/todayStudyPlanList_model.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

import 'package:ttokssaem_flutter_app/bloc/todayNoticeList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/todayStudyPlanList/bloc.dart';

import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';

class StudentHomePage extends StatefulWidget {
  @override
  _StudentHomePageState createState() => _StudentHomePageState();
}

class _StudentHomePageState extends State<StudentHomePage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<NoticeDataModel> _listNoticeDataModel = [];
  List<TodayStudyPlanDataModel> _listTodayStudyPlanDataModel = [];

  late TodayNoticeListBloc _todayNoticeListBloc;
  late TodayStudyPlanListBloc _todayStudyPlanListBloc;

  bool _lastNoticeData = false;
  bool _lastStudyPlanData = false;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  TimetableModel? _timetable; // 오늘(02시 기준) 시간표

  @override
  void initState() {
    // get data when initState
    _todayNoticeListBloc = BlocProvider.of<TodayNoticeListBloc>(context);
    _todayNoticeListBloc.add(TodayNoticeList(apiToken: apiToken));

    DateTime now = DateTime.now();
    DateTime twohoursago = now.subtract(const Duration(hours: 2));
    String _plandate = DateFormat('yyyyMMdd').format(twohoursago);

    _todayStudyPlanListBloc = BlocProvider.of<TodayStudyPlanListBloc>(context);
    _todayStudyPlanListBloc.add(TodayStudyPlanList(targetid: '', plandate: _plandate, apiToken: apiToken));

    TimetableRepository.instance.get(_plandate, apiToken: apiToken).then((timetable) {
      if (mounted) setState(() { _timetable = timetable; });
    });

    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                margin: EdgeInsets.symmetric(vertical: 8),
                child: Chip(
                  label: Text('오늘의 학습계획', style: TextStyle(
                      fontSize: 18, color: Colors.white, fontWeight: FontWeight.w500
                  )),
                  backgroundColor: SOFT_GREEN,
                ),
              ),
              Container(
                margin: EdgeInsets.symmetric(vertical: 0),
                child: BlocListener<TodayStudyPlanListBloc, TodayStudyPlanListState>(
                  listener: (context, state) {
                    if(state is TodayStudyPlanListError) {
                      Fluttertoast.showToast(
                          backgroundColor: Colors.red,
                          textColor: Colors.white,
                          fontSize: 13.0,
                          msg: state.errorMessage,
                          toastLength: Toast.LENGTH_LONG);
                    }
                    if(state is TodayStudyPlanListSuccess) {
                      //_scrollController.addListener(_onScroll);
                      if(state.todayStudyPlanListData.listData.length == 0){
                        _lastStudyPlanData = true;
                      } else {
                        _listTodayStudyPlanDataModel.addAll(state.todayStudyPlanListData.listData);
                      }
                    }
                  },
                  child: BlocBuilder<TodayStudyPlanListBloc, TodayStudyPlanListState>(
                    builder: (context, state) {
                      if(state is TodayStudyPlanListError) {
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
                          if (_listTodayStudyPlanDataModel.length == 0) {
                            return _shimmerLoading.buildShimmerContent();
                          } else {
                            return ListView.builder(
                              itemCount: _listTodayStudyPlanDataModel.length,
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
              SizedBox(
                height: 32,
              ),
              Container(
                margin: EdgeInsets.symmetric(vertical: 8),
                child: Chip(
                  label: Text('오늘의 알림', style: TextStyle(
                      fontSize: 18, color: Colors.white, fontWeight: FontWeight.w500
                  )),
                  backgroundColor: SOFT_GREEN,
                ),
              ),
              Container(
                margin: EdgeInsets.symmetric(vertical: 0),
                child: BlocListener<TodayNoticeListBloc, TodayNoticeListState>(
                  listener: (context, state) {
                    if(state is TodayNoticeListError) {
                      Fluttertoast.showToast(
                          backgroundColor: Colors.red,
                          textColor: Colors.white,
                          fontSize: 13.0,
                          msg: state.errorMessage,
                          toastLength: Toast.LENGTH_LONG);
                    }
                    if(state is TodayNoticeListSuccess) {
                      if(state.noticeListData.listData.length == 0){
                        _lastNoticeData = true;
                      } else {
                        _listNoticeDataModel.addAll(state.noticeListData.listData);
                      }
                    }
                  },
                  child: BlocBuilder<TodayNoticeListBloc, TodayNoticeListState>(
                    builder: (context, state) {
                      if(state is TodayNoticeListError) {
                        return Container(
                            child: Center(
                                child: Text('잠시 후 다시 시도하여 주세요', style: TextStyle(
                                    fontSize: 14,
                                    color: Color(0xff777777)
                                ))
                            )
                        );
                      } else {
                        if (_lastNoticeData) {
                          return Container(
                              child: Center(
                                  child: Text('오늘 받은 알림 없음', style: TextStyle(
                                      fontSize: 14,
                                      color: Color(0xff777777)
                                  ))
                              )
                          );
                        } else {
                          if (_listNoticeDataModel.length == 0) {
                            return _shimmerLoading.buildShimmerContent();
                          } else {
                            return ListView.builder(
                              itemCount: _listNoticeDataModel.length,
                              shrinkWrap: true,
                              primary: false,
                              // Add one more item for progress indicator
                              padding: EdgeInsets.symmetric(vertical: 0),
                              itemBuilder: (BuildContext context, int index) {
                                return _buildItem(index);
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
              child: Text(classname(_listTodayStudyPlanDataModel[index].classhour), style: TextStyle(
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
                child: Text(_listTodayStudyPlanDataModel[index].study, style: TextStyle(
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

  Widget _buildItem(index){
    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () {
      },
      child: Container(
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
                margin: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_listNoticeDataModel[index].title,
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: BLACK55)),
                    SizedBox(
                      height: 4,
                    ),
                    Text(_listNoticeDataModel[index].regdate,
                        style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 11)),
                    SizedBox(
                      height: 8,
                    ),
                    Text(_listNoticeDataModel[index].message, style: TextStyle(fontSize: 16, color: BLACK77)),
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
