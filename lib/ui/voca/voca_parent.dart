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
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/bloc/selVocaHistList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/selVocaHistList_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

class VocaHistListviewPage extends StatefulWidget {
  @override
  _VocaHistListviewPageState createState() => _VocaHistListviewPageState();
}

class _VocaHistListviewPageState extends State<VocaHistListviewPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<SelVocaHistDataModel> _listVocaHistDataModel = [];

  late SelVocaHistListBloc _selVocaHistListBloc;

  int _apiPage = 0;
  ScrollController _scrollController = ScrollController();
  bool _lastData = false;
  bool _processApi = false;
  final int _apiLimit = 15;

  String _memodate = "";
  String _examflag = "A";
  String _examflag_text = "";
  Color _examflag_btn_text_color = BUTTON_TEXT_COLOR;
  Color _examflag_btn_color = BUTTON_COLOR;
  Color _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  @override
  void initState() {
    // get data when initState
    DateTime now = DateTime.now();
    DateTime twohoursago = now.subtract(const Duration(hours: 2));
    _memodate = DateFormat('yyyyMMdd').format(twohoursago);

    _selVocaHistListBloc = BlocProvider.of<SelVocaHistListBloc>(context);
    _selVocaHistListBloc.add(SelVocaHistList(page: _apiPage, length: _apiLimit, targetid: TARGETID, apiToken: apiToken));

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
        _selVocaHistListBloc.add(SelVocaHistList(page: _apiPage, length: _apiLimit, targetid: TARGETID, apiToken: apiToken));
        _processApi = true;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final double boxImageSize = (MediaQuery.of(context).size.width / 4);
    return Scaffold(
      appBar: AppBar(
        iconTheme: IconThemeData(
          color: TTOK_YELLOW,
        ),
        elevation: 0,
        title: Text(
          '단어장 테스트 결과',
          style: TextStyle(
              fontSize: 18,
              color: Colors.white
          ),
        ),
        backgroundColor: TTOK_GREEN,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
        bottom: PreferredSize(
            child: Container(
              color: Colors.grey[100],
              height: 1.0,
            ),
            preferredSize: Size.fromHeight(1.0)),
        actions: <Widget>[
          new Container(
            margin :  EdgeInsets.all(5),
            child : CupertinoButton(
              minSize: 0.0,
              padding: EdgeInsets.symmetric(horizontal:  10, vertical: 10),
              child: Text(
                TARGETNAME,
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: _examflag_btn_text_color ),
                textAlign: TextAlign.center,
              ),
              color: _examflag_btn_color,
              disabledColor: _examflag_btn_disabled_color,
              onPressed: () {
               },
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: refreshData,
        child: MultiBlocListener(
          listeners : [
            BlocListener<SelVocaHistListBloc, SelVocaHistListState>(
                listener: (context, state) {
                  if(state is SelVocaHistListError) {
                    Fluttertoast.showToast(
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 13.0,
                        msg: state.errorMessage,
                        toastLength: Toast.LENGTH_LONG);
                  }
                  if(state is SelVocaHistListSuccess) {
                    _scrollController.addListener(_onScroll);
                    if(state.selVocaHistListData.listData.length == 0){
                      _lastData = true;
                    } else {
                      _apiPage += 1;
                      _listVocaHistDataModel.addAll(state.selVocaHistListData.listData);
                    }
                    _processApi = false;
                  }
                }),
          ],
          child: BlocBuilder<SelVocaHistListBloc, SelVocaHistListState>(
            builder: (context, state) {
              if(state is SelVocaHistListError) {
                return Container(
                    child: Center(
                        child: Text('잠시 후 다시 시도하여 주세요', style: TextStyle(
                            fontSize: 14,
                            color: Color(0xff777777)
                        ))
                    )
                );
              } else {
                if(_lastData && _apiPage==0){
                  return Container(
                      child: Center(
                          child: Text('아직 테스트가 진행되지 않았습니다', style: TextStyle(
                              fontSize: 14,
                              color: Color(0xff777777)
                          ))
                      )
                  );
                } else {
                  if(_listVocaHistDataModel.length==0){
                    return _shimmerLoading.buildShimmerContent();
                  } else {
                    return ListView.builder(
                      itemCount: (state is SelVocaHistListWaiting) ? _listVocaHistDataModel.length + 1 : _listVocaHistDataModel.length,
                      // Add one more item for progress indicator
                      padding: EdgeInsets.symmetric(vertical: 0),
                      physics: AlwaysScrollableScrollPhysics(),
                      itemBuilder: (BuildContext context, int index) {
                        if (index == _listVocaHistDataModel.length) {
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

  Widget _buildItem(index){

    var examflag = '시험중';
    var examflagColor = SOFT_GRAY;
    if(_listVocaHistDataModel[index].examflag == 'D') {
      examflag = '통과';
      examflagColor = SOFT_BLUE;
    } else if(_listVocaHistDataModel[index].examflag == 'E') {
      examflag = '재시험';
      examflagColor = ASSENT_COLOR;
    }

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
                    Text(_listVocaHistDataModel[index].memodate.substring(0, 4) + '-' + _listVocaHistDataModel[index].memodate.substring(4, 6) + '-' + _listVocaHistDataModel[index].memodate.substring(6, 8),
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: BLACK55,
                            fontSize: 20)),
                    SizedBox(
                      height: 4,
                    ),
                    Text(_listVocaHistDataModel[index].vocalevel_name + ' - ' + _listVocaHistDataModel[index].vocano.toString()+ ' ~ ' + (_listVocaHistDataModel[index].vocano + _listVocaHistDataModel[index].targetcount - 1).toString(),
                        style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 11)),
                    SizedBox(
                      height: 8,
                    ),
                    Text(_listVocaHistDataModel[index].degree.toString()+ '회차', style: TextStyle(fontSize: 16, color: BLACK77)),
                    SizedBox(
                      height: 8,
                    ),
                    Text('점수(전체 / 맞음)', style: TextStyle(fontSize: 11, color: Colors.grey[400])),
                    SizedBox(
                      height: 8,
                    ),
                    Text(_listVocaHistDataModel[index].total.toString() + ' / ' + (_listVocaHistDataModel[index].total - _listVocaHistDataModel[index].wrong).toString(), style: TextStyle(fontSize: 16, color: BLACK77)),
                    SizedBox(
                      height: 8,
                    ),
                    Text(examflag, style: TextStyle(fontSize: 14, color: examflagColor)),
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

  Future refreshData() async {
    setState(() {
      _apiPage = 0;
      _lastData = false;
      _listVocaHistDataModel.clear();
      _selVocaHistListBloc.add(SelVocaHistList(page: _apiPage, length: _apiLimit, targetid: TARGETID, apiToken: apiToken));
    });
  }
}
