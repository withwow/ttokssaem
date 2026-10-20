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

import 'package:ttokssaem_flutter_app/ui/voca/vocamemo_list.dart';
import 'package:ttokssaem_flutter_app/ui/voca/vocatest_list.dart';
import 'package:ttokssaem_flutter_app/ui/voca/vocasolve_list.dart';

import 'package:ttokssaem_flutter_app/bloc/selVocaHistList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/selVocaHistList_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

class VocaPage extends StatefulWidget {
  @override
  _VocaPageState createState() => _VocaPageState();
}

class _VocaPageState extends State<VocaPage> {
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
      appBar: _globalWidget.globalAppBar(
        title: const Text('단어장'),
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

  Widget _buildItem(index) {

    var examflag = '시험중';
    var examflagColor = SOFT_GRAY;

    Color BTN1 = SOFT_GRAY;
    Color BTN2 = SOFT_GRAY;
    Color BTN3 = SOFT_GRAY;

    if(_listVocaHistDataModel[index].examflag == 'D') {
      int total = _listVocaHistDataModel[index].total;
      int correct = _listVocaHistDataModel[index].total - _listVocaHistDataModel[index].wrong;
      examflag = '통과 - ${total}/${correct}';
      examflagColor = SOFT_BLUE;

      BTN1 = SOFT_GRAY;
      BTN3 = TTOK_GREEN;
    } else if(_listVocaHistDataModel[index].examflag == 'E') {
      int total = _listVocaHistDataModel[index].total;
      int correct = _listVocaHistDataModel[index].total - _listVocaHistDataModel[index].wrong;
      examflag = '재시험 - ${total}/${correct}';
      examflagColor = ASSENT_COLOR;

      BTN1 = TTOK_GREEN;
      BTN3 = TTOK_GREEN;
    } else {
      if(_listVocaHistDataModel[index].examflag == 'A' || _listVocaHistDataModel[index].examflag == 'B'){
        BTN1 = TTOK_GREEN;
      }
      if(_listVocaHistDataModel[index].examflag == 'C'){
        BTN2 = TTOK_GREEN;
      }
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
                    Text(examflag, style: TextStyle(fontSize: 14, color: examflagColor)),
                    SizedBox(
                      height: 8,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            if(BTN1 == TTOK_GREEN) {
                              // 단어외우기
                              Navigator.push(context, MaterialPageRoute(
                                  builder: (context) =>
                                      VocaMemoListviewPage(
                                          _listVocaHistDataModel[index]
                                              .memodate)));
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: BTN1, // 배경색 설정
                            side: BorderSide(width: 1, color: BTN1),
                          ),
                          child: Text('단어외우기'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            if(BTN2 == TTOK_GREEN) {
                              // 테스트
                              var content = '테스트를 진행하시겠습니까?';
                              showDialog(
                                  context: context,
                                  //barrierDismissible - Dialog를 제외한 다른 화면 터치 x
                                  barrierDismissible: false,
                                  builder: (BuildContext context) {
                                    return AlertDialog(
                                      // RoundedRectangleBorder - Dialog 화면 모서리 둥글게 조절
                                      shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(10.0)),
                                      //Dialog Main Title
                                      title: Column(
                                        children: <Widget>[
                                          new Text('확인'),
                                        ],
                                      ),
                                      //
                                      content: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: <Widget>[
                                          Text(
                                            content,
                                          ),
                                        ],
                                      ),
                                      actions: <Widget>[
                                        new TextButton(
                                          onPressed: () {
                                            // Respond to button press
                                            Navigator.pop(context);
                                            Navigator.push(context, MaterialPageRoute(builder: (context) => VocaTestListviewPage(_listVocaHistDataModel[index].memodate)));
                                          },
                                          child: Text("예"),
                                        ),
                                        new TextButton(
                                          onPressed: () {
                                            // Respond to button press
                                            Navigator.pop(context);
                                          },
                                          child: Text("아니오"),
                                        )
                                      ],
                                    );
                                  });
                            }

                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: BTN2, // 배경색 설정
                            side: BorderSide(width: 1, color: BTN2),
                          ),
                          child: Text('테스트'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            if(BTN3 == TTOK_GREEN) {
                              // 풀이보기
                              Navigator.push(context, MaterialPageRoute(
                                  builder: (context) =>
                                      VocaSolveListviewPage(
                                          _listVocaHistDataModel[index]
                                              .memodate)));
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: BTN3, // 배경색 설정
                            side: BorderSide(width: 1, color: BTN3),
                          ),
                          child: Text('풀이'),
                        ),
                      ],
                    )
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
