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

import 'package:ttokssaem_flutter_app/bloc/selVocaTestList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/selVocaTestList_model.dart';

import 'package:ttokssaem_flutter_app/bloc/finishVocaTest/bloc.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

class VocaTestListviewPage extends StatefulWidget {

  final String memodate;

  const VocaTestListviewPage(this.memodate);

  @override
  _VocaTestListviewPageState createState() => _VocaTestListviewPageState();
}

class _VocaTestListviewPageState extends State<VocaTestListviewPage> with WidgetsBindingObserver {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<TextEditingController> textController = [];

  Color _cursorColor = BLACK55;
  Color _textColor = BLACK55;
  Color _borderColor = TTOK_GREEN;
  Color _labeltextColor = SOFT_GREEN;
  Color _underlineColor = SOFT_GREEN;

  List<SelVocaTestDataModel> _listVocaTestDataModel = [];

  late FinishVocaTestBloc _finishVocaTestBloc;
  late SelVocaTestListBloc _selVocaTestListBloc;

  int _apiPage = 0;
  ScrollController _scrollController = ScrollController();
  bool _lastData = false;
  bool _processApi = false;
  final int _apiLimit = 500;

  String _memodate = "";
  String _examflag = "A";
  int _degree = 1;
  String _examflag_text = "";
  Color _examflag_btn_text_color = BUTTON_TEXT_COLOR;
  Color _examflag_btn_color = BUTTON_COLOR;
  Color _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;

  int _refreshCount = 0;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  @override
  void initState() {
    // get data when initState
    for(int i = 0; i < 100; i++){
      TextEditingController controller = TextEditingController();
      textController.add(controller);
    }

    _memodate = widget.memodate;

    _finishVocaTestBloc = BlocProvider.of<FinishVocaTestBloc>(context);

    _selVocaTestListBloc = BlocProvider.of<SelVocaTestListBloc>(context);
    _selVocaTestListBloc.add(SelVocaTestList(page: _apiPage, length: _apiLimit, memodate: _memodate, apiToken: apiToken));

    WidgetsBinding.instance?.addObserver(this);

    super.initState();
  }

  @override
  void dispose() {
    apiToken.cancel("cancelled"); // cancel fetch data from API
    _scrollController.dispose();

    WidgetsBinding.instance?.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      // 앱이 백그라운드로 전환될 때 실행되는 코드
      _refreshCount++;
    } else if (state == AppLifecycleState.resumed) {
      // 앱이 다시 포그라운드로 돌아올 때 실행되는 코드
      if(_refreshCount >= 2){
        clearAnswer();
        _globalFunction.showFailedToast('풀이가 초기화 되었습니다');
      } else {
        _globalFunction.showFailedToast('한번 더 앱이 비활성되면 풀이가 초기화됩니다');
      }
    }
  }

  clearAnswer(){
    for(int i = 0; i < 100; i++){
      textController[i].clear();
    }
  }

  // this function used to fetch data from API if we scroll to the bottom of the page
  void _onScroll() {
    double maxScroll = _scrollController.position.maxScrollExtent;
    double currentScroll = _scrollController.position.pixels;

    if (currentScroll == maxScroll) {
      // 입력시 계속하여 레코드가 추가되는 문제로 막음
      // if (_lastData == false && !_processApi) {
      //   _selVocaTestListBloc.add(SelVocaTestList(page: _apiPage, length: _apiLimit, memodate: _memodate, apiToken: apiToken));
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
          '테스트',
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
                if(_examflag == 'C') {
                  // 풀이 제출
                  int empty = 0;
                  for(int index = 0; index < _listVocaTestDataModel.length; index++) if(_listVocaTestDataModel[index].answer.isEmpty) empty++;
                  if(empty > 0) {
                    var content = '비어있는 답이 ' + empty.toString() + '개 있습니다. 그래도 제출하시겠습니까?';
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
                                  _finishVocaTestBloc.add(FinishVocaTest(memodate: _memodate, degree: _degree, lists: _listVocaTestDataModel, apiToken: apiToken));
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
                  } else {
                    var content = '풀이를 제출하시겠습니까?';
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
                                  _finishVocaTestBloc.add(FinishVocaTest(memodate: _memodate, degree: _degree, lists: _listVocaTestDataModel, apiToken: apiToken));
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
            BlocListener<SelVocaTestListBloc, SelVocaTestListState>(
                listener: (context, state) {
                  if(state is SelVocaTestListError) {
                    Fluttertoast.showToast(
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 13.0,
                        msg: state.errorMessage,
                        toastLength: Toast.LENGTH_LONG);
                  }
                  if(state is SelVocaTestListSuccess) {
                    _scrollController.addListener(_onScroll);
                    if(state.selVocaTestListData.listData.length == 0){
                      _lastData = true;
                    } else {
                      _apiPage += 1;
                      setState(() { // setState() 추가.
                        _listVocaTestDataModel.addAll(state.selVocaTestListData.listData);
                      });
                    }
                    _processApi = false;

                    _degree = state.selVocaTestListData.degree;

                    _examflag = state.selVocaTestListData.examflag;
                    if(_examflag == "A" || _examflag == "E") {
                      setState(() { // setState() 추가.
                        _examflag_text = "테스트 요청";
                        _examflag_btn_text_color = BUTTON_TEXT_COLOR;
                        _examflag_btn_color = BUTTON_COLOR;
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
                        _examflag_text = "풀이 제출";
                        _examflag_btn_text_color = BLACK21;
                        _examflag_btn_color = TTOK_YELLOW;
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
            BlocListener<FinishVocaTestBloc, FinishVocaTestState>( listener: (context, state) {
              if(state is FinishVocaTestError) {
                Navigator.pop(context);
                // Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
                _globalFunction.FlutterDialog(context, '오류 발생', state.errorMessage);
              }
              if(state is FinishVocaTestWaiting) {
                FocusScope.of(context).unfocus();
                _globalFunction.showProgressDialog(context);
              }
              if(state is FinishVocaTestSuccess) {
                Navigator.pop(context);

                if (kDebugMode) {
                  print('data FinishVocaTest : ${state.finishVocaTestData}');
                }

                setState(() { // setState() 추가.
                  _examflag = "D";
                  _examflag_text = "제출 완료";
                  _examflag_btn_text_color = BUTTON_TEXT_COLOR;
                  _examflag_btn_color = BUTTON_COLOR;
                  _examflag_btn_disabled_color = BUTTON_DISABLED_COLOR;
                });

                var title = '';
                var content = '';
                if(state.finishVocaTestData.finishflag == "D") {
                  if(state.finishVocaTestData.wrong == "0") {
                    title = '통과';
                    content = '만점으로 통과하였습니다.';
                  } else {
                    title = '통과';
                    content = '전체 ${state.finishVocaTestData.total}개중 ${state
                        .finishVocaTestData.wrong}개 틀렸으나 통과하였습니다.';
                  }
                }
                else {
                  title = '재시험';
                  content = '전체 ${state.finishVocaTestData.total}개중 ${state.finishVocaTestData.wrong}개 틀려서 재시험대상입니다.';
                }

                _globalFunction.FlutterDialog(context, title, content);

              }
            }),
          ],
          child: BlocBuilder<SelVocaTestListBloc, SelVocaTestListState>(
            builder: (context, state) {
              if(state is SelVocaTestListError) {
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
                          child: Text('테스트를 상태가 아닙니다.', style: TextStyle(
                              fontSize: 14,
                              color: Color(0xff777777)
                          ))
                      )
                  );
                } else {
                  if(_listVocaTestDataModel.length==0){
                    return _shimmerLoading.buildShimmerContent();
                  } else {
                    return ListView.builder(
                      itemCount: (state is SelVocaTestListWaiting) ? _listVocaTestDataModel.length + 1 : _listVocaTestDataModel.length,
                      // Add one more item for progress indicator
                      padding: EdgeInsets.symmetric(vertical: 0),
                      physics: AlwaysScrollableScrollPhysics(),
                      itemBuilder: (BuildContext context, int index) {
                        if (index == _listVocaTestDataModel.length) {
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
                    Text(_listVocaTestDataModel[index].word,
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: BLACK55,
                            fontSize: 20)),
                    SizedBox(
                      height: 4,
                    ),
                    Text(_listVocaTestDataModel[index].vocalevel_name + ' - ' + _listVocaTestDataModel[index].vocano.toString(),
                        style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 11)),
                    SizedBox(
                      height: 8,
                    ),
                    TextFormField(
                      minLines: 3,
                      keyboardType: TextInputType.multiline,
                      maxLines: null,
                      style: TextStyle(color: _textColor),
                      cursorColor: _cursorColor,
                      controller: textController[index],
                      decoration: InputDecoration(
                          focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: _borderColor, width: 2.0)
                          ),
                          enabledBorder: UnderlineInputBorder(
                            borderSide: BorderSide(color: _underlineColor),
                          ),
                          labelText: '정답 - 여러개일 경우 새로운 줄에 입력',
                          labelStyle: TextStyle(color: _labeltextColor)),
                      onChanged: (text) {
                        setState(() {
                          _listVocaTestDataModel[index].answer = text;
                        });
                      },
                    ),
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
      // _apiPage = 0;
      // _lastData = false;
      // _listVocaTestDataModel.clear();
      // _selVocaTestListBloc.add(SelVocaTestList(page: _apiPage, length: _apiLimit, memodate: _memodate, apiToken: apiToken));
    });
  }
}
