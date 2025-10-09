import 'package:dio/dio.dart';
import 'package:pie_chart/pie_chart.dart';
import 'package:badges/badges.dart' as custom_badge;

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';
import 'package:ttokssaem_flutter_app/ui/last/studyplan.dart';

import 'package:ttokssaem_flutter_app/bloc/achiveStudyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/achiveStudyPlanList_model.dart';

import 'package:ttokssaem_flutter_app/bloc/dashboardStudyPlan/bloc.dart';
import 'package:ttokssaem_flutter_app/model/dashboardStudyPlan_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';


class ParentLastPage extends StatefulWidget {
  @override
  _ParentLastPageState createState() => _ParentLastPageState();
}

class _ParentLastPageState extends State<ParentLastPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();


  List<DashboardStudyPlanDataModel> _listDashboardStudyPlanDataModel = [];
  List<AchiveStudyPlanDataModel> _listAchiveStudyPlanDataModel = [];

  late DashboardStudyPlanBloc _dashboardStudyPlanBloc;
  late AchiveStudyPlanListBloc _achiveStudyPlanListBloc;

  int _apiPage = 0;
  ScrollController _scrollController = ScrollController();
  bool _lastData = false;
  bool _processApi = false;
  final int _apiLimit = 15;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  @override
  void initState() {
    // get data when initState
    _dashboardStudyPlanBloc = BlocProvider.of<DashboardStudyPlanBloc>(context);
    _dashboardStudyPlanBloc.add(DashboardStudyPlan(targetid: TARGETID, apiToken: apiToken));

    _achiveStudyPlanListBloc = BlocProvider.of<AchiveStudyPlanListBloc>(context);
    _achiveStudyPlanListBloc.add(AchiveStudyPlanList(targetid: TARGETID, page: _apiPage, length: _apiLimit, apiToken: apiToken));

    super.initState();
  }

  @override
  void dispose() {
    apiToken.cancel("cancelled"); // cancel fetch data from API
    _scrollController.dispose();

    super.dispose();
  }

  // this function used to fetch data from API if we scroll to the bottom of the page
  void _onScroll() {
    double maxScroll = _scrollController.position.maxScrollExtent;
    double currentScroll = _scrollController.position.pixels;

    if (currentScroll == maxScroll) {
      if (_lastData == false && !_processApi) {
        _achiveStudyPlanListBloc.add(AchiveStudyPlanList(targetid: TARGETID, page: _apiPage, length: _apiLimit, apiToken: apiToken));
        _processApi = true;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
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
                SizedBox(
                  width: 5,
                ),
                Container(
                  margin: EdgeInsets.symmetric(vertical: 0),
                  child: Chip(
                    label: Text('지난 학습결과', style: TextStyle(
                        fontSize: 18, color: Colors.white, fontWeight: FontWeight.w500
                    )),
                    backgroundColor: SOFT_GREEN,
                  ),
                ),
                ]
          ),
          Expanded(child: DashboardStudyPlanView()),
          SizedBox(
            height: 32,
          ),
          Container(
            margin: EdgeInsets.symmetric(vertical: 8),
            child: Chip(
              label: Text('지난 학습계획', style: TextStyle(
                  fontSize: 18, color: Colors.white, fontWeight: FontWeight.w500
              )),
              backgroundColor: SOFT_GREEN,
            ),
          ),
          Expanded(child: AchiveStudyPlanListView()),
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

  Widget DashboardStudyPlanView() {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 0),
      child: BlocListener<DashboardStudyPlanBloc, DashboardStudyPlanState>(
        listener: (context, state) {
          if(state is DashboardStudyPlanError) {
            Fluttertoast.showToast(
                backgroundColor: Colors.red,
                textColor: Colors.white,
                fontSize: 13.0,
                msg: state.errorMessage,
                toastLength: Toast.LENGTH_LONG);
          }
          if(state is DashboardStudyPlanSuccess) {
            if (kDebugMode) {
              print('data DashboardStudyPlan : ${state.dashboardStudyPlanData}');
            }
            DashboardStudyPlanDataModel model1 = DashboardStudyPlanDataModel(state.dashboardStudyPlanData.last1_plancount, state.dashboardStudyPlanData.last1_achievecount );
            DashboardStudyPlanDataModel model3 = DashboardStudyPlanDataModel(state.dashboardStudyPlanData.last3_plancount, state.dashboardStudyPlanData.last3_achievecount);
            DashboardStudyPlanDataModel model7 = DashboardStudyPlanDataModel(state.dashboardStudyPlanData.last7_plancount, state.dashboardStudyPlanData.last7_achievecount);

            _listDashboardStudyPlanDataModel.clear();
            _listDashboardStudyPlanDataModel.add(model1);
            _listDashboardStudyPlanDataModel.add(model3);
            _listDashboardStudyPlanDataModel.add(model7);
          }
        },
        child: BlocBuilder<DashboardStudyPlanBloc, DashboardStudyPlanState>(
          builder: (context, state) {
            if(state is DashboardStudyPlanError) {
              return Container(
                  child: Center(
                      child: Text('잠시 후 다시 시도하여 주세요', style: TextStyle(
                          fontSize: 14,
                          color: Color(0xff777777)
                      ))
                  )
              );
            } else {

              return ListView.builder(
                itemCount: _listDashboardStudyPlanDataModel.length,
                // Add one more item for progress indicator
                shrinkWrap: true,
                primary: false,
                scrollDirection: Axis.horizontal,
                padding: EdgeInsets.symmetric(horizontal: 10),
                physics: AlwaysScrollableScrollPhysics(),
                itemBuilder: (BuildContext context, int index) {
                  return _buildDashboardItem(index);
                },
              );
            }
          },
        ),
      ),
    );
  }


  Widget _buildDashboardItem(index) {

    List<String> title = ['어제', '지난 3일', '지난 7일'];

    final colorList = <Color>[];
    bool first = false;
    if(index == 0) {
      first = true;
      colorList.add(TTOK_PINK);
    } else {
      colorList.add(TTOK_YELLOW);
    }

    double per = double.parse(_listDashboardStudyPlanDataModel[index].achievecount) / double.parse(_listDashboardStudyPlanDataModel[index].plancount);
    final dataMap = <String, double> {
      "": per,
    };


      return SizedBox(
        width: 150.0,
        height: 280.0,
        child: Card(
          color: TTOK_GREEN,
          elevation: 4.0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title[index],
                  style: const TextStyle(fontSize: 18.0, fontWeight: FontWeight.w700).copyWith(color: first ? TTOK_PINK : Colors.white),
                ),
                const SizedBox(height: 10.0,),
                Text('계획 / 달성',
                  style: const TextStyle(fontSize: 10.0, color: SOFT_GRAY),
                ),
                const SizedBox(height: 2.0,),
                Text('${_listDashboardStudyPlanDataModel[index].plancount} / ${_listDashboardStudyPlanDataModel[index].achievecount}',
                  style: const TextStyle(fontSize: 16.0, color: WHITEEE),
                ),
                const SizedBox(height: 2.0,),
                Container(
                  height: 100,
                  margin: EdgeInsets.symmetric(vertical: 0),
                  child: PieChart(
                    dataMap: dataMap,
                    chartType: ChartType.ring,
                    initialAngleInDegree: 270,
                    chartRadius: 70,
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
              ],
            ),
          ),
        ),
      );
    }



  Widget AchiveStudyPlanListView() {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 0),
      child: BlocListener<AchiveStudyPlanListBloc, AchiveStudyPlanListState>(
        listener: (context, state) {
          if(state is AchiveStudyPlanListError) {
            Fluttertoast.showToast(
                backgroundColor: Colors.red,
                textColor: Colors.white,
                fontSize: 13.0,
                msg: state.errorMessage,
                toastLength: Toast.LENGTH_LONG);
          }
          if(state is AchiveStudyPlanListSuccess) {
            _scrollController.addListener(_onScroll);
            if(state.achiveStudyPlanListData.listData.length == 0){
              _lastData = true;
            } else {
              _apiPage += 1;
              _listAchiveStudyPlanDataModel.addAll(state.achiveStudyPlanListData.listData);
            }
            _processApi = false;
          }
        },
        child: BlocBuilder<AchiveStudyPlanListBloc, AchiveStudyPlanListState>(
          builder: (context, state) {
            if(state is AchiveStudyPlanListError) {
              return Container(
                  child: Center(
                      child: Text('잠시 후 다시 시도하여 주세요', style: TextStyle(
                          fontSize: 14,
                          color: Color(0xff777777)
                      ))
                  )
              );
            } else {
              if (_lastData && _apiPage==0) {
                return Container(
                    child: Center(
                        child: Text('지난 학습계획 없음', style: TextStyle(
                            fontSize: 14,
                            color: Color(0xff777777)
                        ))
                    )
                );
              } else {
                if (_listAchiveStudyPlanDataModel.length == 0) {
                  return _shimmerLoading.buildShimmerContent();
                } else {
                  return ListView.builder(
                    itemCount: (state is AchiveStudyPlanListWaiting) ? _listAchiveStudyPlanDataModel.length + 1 : _listAchiveStudyPlanDataModel.length,
                    // Add one more item for progress indicator
                    shrinkWrap: true,
                    primary: false,
                    padding: EdgeInsets.symmetric(vertical: 0),
                    physics: AlwaysScrollableScrollPhysics(),
                    itemBuilder: (BuildContext context, int index) {
                      if (index == _listAchiveStudyPlanDataModel.length) {
                        return _globalWidget.buildProgressIndicator(_lastData);
                      } else {
                        return _buildItem(index);
                      }
                    },
                    controller: _scrollController,
                  );
                }
              }
            }
          },
        ),
      ),
    );
  }

  String timeStamp(plandate){
    String stamp = '';

    stamp = '${plandate.substring(0,4)}.${plandate.substring(4,6)}.${plandate.substring(6,8)}';

    return stamp;
  }

  Widget _buildItem(index) {

    double plancount = double.parse(_listAchiveStudyPlanDataModel[index].plancount);
    double achievecount = double.parse(_listAchiveStudyPlanDataModel[index].achievecount);

    double per = 0;
    if( plancount != 0 && achievecount != 0)
      per = achievecount / plancount;

    int iPer  = (per * 100).floor();

    return GestureDetector(
        behavior: HitTestBehavior.translucent,
        onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => StudyPlanPage(TARGETID, _listAchiveStudyPlanDataModel[index].plandate)));
        },
      child: Card(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            ListTile(
              leading: custom_badge.Badge(
              child: Icon(Icons.abc, size: 30, color: Colors.transparent,), //icon style
              badgeContent: SizedBox(
                  width: 35, height: 35, //badge size
                  child:Center(  //aligh badge content to center
                    child:Text('${iPer}%', style: TextStyle(
                        color: TTOK_GREEN,  //badge font color
                        fontWeight: FontWeight.bold,
                        fontSize: 13 //badge font size
                    )
                    ),
                  )
              ),
              badgeColor: TTOK_YELLOW, //badge background color
            ),
              title: Text(timeStamp(_listAchiveStudyPlanDataModel[index].plandate),style: TextStyle(
                  color: TTOK_GREEN,  //badg
                  fontWeight: FontWeight.bold,// e font color
                  fontSize: 18 //badge font size
              )),
              subtitle: Text('계획/달성 (${_listAchiveStudyPlanDataModel[index].plancount} / ${_listAchiveStudyPlanDataModel[index].achievecount})'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildItem1(index){
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
                    Text(_listAchiveStudyPlanDataModel[index].plandate,
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: BLACK55)),
                    SizedBox(
                      height: 4,
                    ),
                    Text(_listAchiveStudyPlanDataModel[index].plancount,
                        style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 11)),
                    SizedBox(
                      height: 8,
                    ),
                    Text(_listAchiveStudyPlanDataModel[index].achievecount, style: TextStyle(fontSize: 16, color: BLACK77)),
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
