import 'package:dio/dio.dart';
import 'package:pie_chart/pie_chart.dart';
import 'package:badges/badges.dart';

import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

import 'package:ttokssaem_flutter_app/bloc/todayNoticeList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/selStudentList/bloc.dart';

import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';
import 'package:ttokssaem_flutter_app/model/selStudentList_model.dart';

class ParentHomePage extends StatefulWidget {
  @override
  _ParentHomePageState createState() => _ParentHomePageState();
}

class _ParentHomePageState extends State<ParentHomePage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<NoticeDataModel> _listNoticeDataModel = [];
  List<SelStudentDataModel> _listSelStudentDataModel = [];

  late SelStudentListBloc _selStudentListBloc;
  late TodayNoticeListBloc _todayNoticeListBloc;

  bool _lastNoticeData = false;
  bool _lastStudentData = false;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  @override
  void initState() {
    // get data when initState
    _todayNoticeListBloc = BlocProvider.of<TodayNoticeListBloc>(context);
    _todayNoticeListBloc.add(TodayNoticeList(apiToken: apiToken));

    // DateTime now = DateTime.now();
    // DateTime twohoursago = now.subtract(const Duration(hours: 2));
    // String _plandate = DateFormat('yyyyMMdd').format(twohoursago);

    _selStudentListBloc = BlocProvider.of<SelStudentListBloc>(context);
    _selStudentListBloc.add(SelStudentList(apiToken: apiToken));

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
              margin: EdgeInsets.symmetric(vertical: 0),
              child: BlocListener<SelStudentListBloc, SelStudentListState>(
                listener: (context, state) {
                  if(state is SelStudentListError) {
                    Fluttertoast.showToast(
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 13.0,
                        msg: state.errorMessage,
                        toastLength: Toast.LENGTH_LONG);
                  }
                  if(state is SelStudentListSuccess) {
                    //_scrollController.addListener(_onScroll);
                    if(state.selStudentListData.listData.length == 0){
                      _lastStudentData = true;
                    } else {
                      _listSelStudentDataModel.addAll(state.selStudentListData.listData);

                      if(TARGETID == '') {
                        TARGETID =
                            state.selStudentListData.listData[0].memberid;
                        TARGETNAME = state.selStudentListData.listData[0].membername;
                      }

                    }
                  }
                },
                child: BlocBuilder<SelStudentListBloc, SelStudentListState>(
                  builder: (context, state) {
                    if(state is SelStudentListError) {
                      return Container(
                          child: Center(
                              child: Text('잠시 후 다시 시도하여 주세요', style: TextStyle(
                                  fontSize: 14,
                                  color: Color(0xff777777)
                              ))
                          )
                      );
                    } else {
                      if (_lastStudentData) {
                        return Container(
                            child: Center(
                                child: Text('등록된 학생 없음', style: TextStyle(
                                    fontSize: 14,
                                    color: Color(0xff777777)
                                ))
                            )
                        );
                      } else {
                        if (_listSelStudentDataModel.length == 0) {
                          return _shimmerLoading.buildShimmerContent();
                        } else {
                          return ListView.builder(
                            itemCount: _listSelStudentDataModel.length,
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

  Widget _buildPlan(index){

    final colorList = <Color>[TTOK_YELLOW];

    double per = double.parse(_listSelStudentDataModel[index].last1_achievecount) / double.parse(_listSelStudentDataModel[index].last1_plancount);
    final dataMap = <String, double> {
      "": per,
    };

    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () {
        TARGETID = _listSelStudentDataModel[index].memberid;
        TARGETNAME = _listSelStudentDataModel[index].membername;
        setState(() { _listSelStudentDataModel.length; });
      },
      child: SizedBox(
        height: 180.0,
        child: Card(
            color: TTOK_GREEN,
            elevation: 4.0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
            child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                    children: [
                        Text(_listSelStudentDataModel[index].membername,
                          style: const TextStyle(fontSize: 18.0, fontWeight: FontWeight.w700).copyWith(color: WHITEEE),
                        ),
                        const SizedBox(width: 10.0,),
                        Icon(Icons.verified, size: 22, color: (TARGETID==_listSelStudentDataModel[index].memberid) ? TTOK_PINK : Colors.transparent),
                      ]
                    ),
                    const SizedBox(height: 10.0,),
                    Row(
                      children: [
                        Flexible(
                            flex: 1, // default
                            fit: FlexFit.tight, // default
                            child: Container(
                              child: Column( // For Example Column
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min, // these properties following the children content height available.
                                children: [
                                  Text('어제 학습계획',
                                  style: const TextStyle(fontSize: 10.0, color: SOFT_GRAY)),
                                  const SizedBox(height: 2.0,),
                                  Text('${_listSelStudentDataModel[index].last1_plancount} / ${_listSelStudentDataModel[index].last1_achievecount}',
                                    style: const TextStyle(fontSize: 16.0, color: WHITEEE),
                                  ),
                                  const SizedBox(height: 5.0,),
                                  Container(
                                    margin: EdgeInsets.symmetric(vertical: 0),
                                    child: PieChart(
                                      dataMap: dataMap,
                                      chartType: ChartType.ring,
                                      initialAngleInDegree: 270,
                                      chartRadius: 50,
                                      ringStrokeWidth: 16,
                                      baseChartColor: Colors.grey[50]!.withOpacity(0.9),
                                      colorList: colorList,
                                      legendOptions: LegendOptions(
                                        showLegendsInRow: false,
                                        showLegends: false,
                                      ),
                                      chartValuesOptions: ChartValuesOptions(
                                        showChartValuesInPercentage: true,
                                        showChartValuesOutside: false,
                                        decimalPlaces: 0,
                                      ),
                                      totalValue: 1,
                                    ),
                                  ),
                               ]
                              ),
                            ),
                        ),
                        const SizedBox(width: 5.0,),
                        Flexible(
                          flex: 1, // default
                          fit: FlexFit.tight, // default
                          child: Container(
                             child: Column( // For Example Column
                                crossAxisAlignment: CrossAxisAlignment.start,
                                 mainAxisSize: MainAxisSize.min, // these properties following the children content height available.
                                children: [
                                  Text('오늘 학습계획',
                                      style: const TextStyle(fontSize: 10.0, color: SOFT_GRAY)),
                                  const SizedBox(height: 2.0,),
                                  Text('${_listSelStudentDataModel[index].last0_plancount}건',
                                      style: const TextStyle(fontSize: 30.0, color: WHITEEE)),
                                  const SizedBox(height: 2.0,),
                                ]
                            ),
                          ),
                        ),
                      ]
                    ),
                    const SizedBox(height: 2.0,),

                  ],
            ),
          )
        )
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
