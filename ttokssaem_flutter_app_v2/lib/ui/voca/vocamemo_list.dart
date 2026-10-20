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

import 'package:ttokssaem_flutter_app/bloc/selVocaMemoList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/selVocaMemoList_model.dart';

import 'package:ttokssaem_flutter_app/bloc/requestVocaTest/bloc.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

class VocaMemoListviewPage extends StatefulWidget {

  final String memodate;

  const VocaMemoListviewPage(this.memodate);

  @override
  _VocaMemoListviewPageState createState() => _VocaMemoListviewPageState();
}

class _VocaMemoListviewPageState extends State<VocaMemoListviewPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<SelVocaMemoDataModel> _listVocaMemoDataModel = [];

  late RequestVocaTestBloc _requestVocaTestBloc;
  late SelVocaMemoListBloc _selVocaMemoListBloc;

  int _apiPage = 0;
  ScrollController _scrollController = ScrollController();
  bool _lastData = false;
  bool _processApi = false;
  final int _apiLimit = 500;

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
    _memodate = widget.memodate;

    _requestVocaTestBloc = BlocProvider.of<RequestVocaTestBloc>(context);

    _selVocaMemoListBloc = BlocProvider.of<SelVocaMemoListBloc>(context);
    _selVocaMemoListBloc.add(SelVocaMemoList(page: _apiPage, length: _apiLimit, memodate: _memodate, apiToken: apiToken));

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
      // if (_lastData == false && !_processApi) {
      //   _selVocaMemoListBloc.add(SelVocaMemoList(page: _apiPage, length: _apiLimit, memodate: _memodate, apiToken: apiToken));
      //   _processApi = true;
      // }
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
            '단어외우기',
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
                    _examflag_text,
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _examflag_btn_text_color ),
                    textAlign: TextAlign.center,
                  ),
                  color: _examflag_btn_color,
                  disabledColor: _examflag_btn_disabled_color,
                  onPressed: () {
                    if(_examflag == 'A' || _examflag == 'E') {
                      _requestVocaTestBloc.add(RequestVocaTest(memodate: _memodate, apiToken: apiToken));
                    }
                  },
                ),
              ),
          ],
        ),
        body: RefreshIndicator(
          onRefresh: refreshData,
          child: MultiBlocListener(
            listeners : [
                BlocListener<SelVocaMemoListBloc, SelVocaMemoListState>(
                  listener: (context, state) {
                  if(state is SelVocaMemoListError) {
                    Fluttertoast.showToast(
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 13.0,
                        msg: state.errorMessage,
                        toastLength: Toast.LENGTH_LONG);
                  }
                  if(state is SelVocaMemoListSuccess) {
                    _scrollController.addListener(_onScroll);
                    if(state.selVocaMemoListData.listData.length == 0){
                      _lastData = true;
                    } else {
                      _apiPage += 1;
                      _listVocaMemoDataModel.addAll(state.selVocaMemoListData.listData);
                    }
                    _processApi = false;

                    _examflag = state.selVocaMemoListData.examflag;
                    if(_examflag == "A" || _examflag == "E") {
                      setState(() { // setState() 추가.
                        _examflag_text = "테스트 요청";
                        _examflag_btn_text_color = BLACK21;
                        _examflag_btn_color = TTOK_YELLOW;
                        _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;
                      });
                    }
                    if(_examflag == "B") {
                      setState(() { // setState() 추가.
                        _examflag_text = "승인 대기중";
                        _examflag_btn_text_color = BUTTON_TEXT_COLOR;
                        _examflag_btn_color = BUTTON_COLOR;
                        _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;
                      });
                    }
                    if(_examflag == "C") {
                      setState(() { // setState() 추가.
                        _examflag_text = "테스트중";
                        _examflag_btn_text_color = BUTTON_TEXT_COLOR;
                        _examflag_btn_color = BUTTON_COLOR;
                        _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;
                      });
                    }
                    if(_examflag == "D") {
                      setState(() { // setState() 추가.
                        _examflag_text = "완료";
                        _examflag_btn_text_color = BUTTON_TEXT_COLOR;
                        _examflag_btn_color = BUTTON_COLOR;
                        _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;
                      });
                    }

                  }
                }),
                BlocListener<RequestVocaTestBloc, RequestVocaTestState>( listener: (context, state) {
                  if(state is RequestVocaTestError) {
                    Navigator.pop(context);
                    Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                  }
                  if(state is RequestVocaTestWaiting) {
                    FocusScope.of(context).unfocus();
                    _globalFunction.showProgressDialog(context);
                  }
                  if(state is RequestVocaTestSuccess) {
                    Navigator.pop(context);

                    if (kDebugMode) {
                      print('data RequestVocaTest : ${state.requestVocaTestData}');
                    }

                    setState(() { // setState() 추가.
                      _examflag = "B";
                      _examflag_text = "승인 대기중";
                      _examflag_btn_text_color = BUTTON_TEXT_COLOR;
                      _examflag_btn_color = BUTTON_COLOR;
                      _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;
                    });

                    _globalFunction.showSuccessToast('정상적으로 요청하였습니다');
                  }
                }),
              ],
              child: BlocBuilder<SelVocaMemoListBloc, SelVocaMemoListState>(
                builder: (context, state) {
                  if(state is SelVocaMemoListError) {
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
                              child: Text('등록된 단어가 없거나 테스트중입니다', style: TextStyle(
                                  fontSize: 14,
                                  color: Color(0xff777777)
                              ))
                          )
                      );
                    } else {
                      if(_listVocaMemoDataModel.length==0){
                        return _shimmerLoading.buildShimmerContent();
                      } else {
                        return ListView.builder(
                          itemCount: (state is SelVocaMemoListWaiting) ? _listVocaMemoDataModel.length + 1 : _listVocaMemoDataModel.length,
                          // Add one more item for progress indicator
                          padding: EdgeInsets.symmetric(vertical: 0),
                          physics: AlwaysScrollableScrollPhysics(),
                          itemBuilder: (BuildContext context, int index) {
                            if (index == _listVocaMemoDataModel.length) {
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
                    Text(_listVocaMemoDataModel[index].word,
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: BLACK55,
                            fontSize: 20)),
                    SizedBox(
                      height: 4,
                    ),
                    Text(_listVocaMemoDataModel[index].vocalevel_name + ' - ' + _listVocaMemoDataModel[index].vocano.toString(),
                        style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 11)),
                    SizedBox(
                      height: 8,
                    ),
                    Text(_listVocaMemoDataModel[index].explain, style: TextStyle(fontSize: 16, color: BLACK77)),
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
      _listVocaMemoDataModel.clear();
      _selVocaMemoListBloc.add(SelVocaMemoList(page: _apiPage, length: _apiLimit, memodate: _memodate, apiToken: apiToken));
    });
  }
}
