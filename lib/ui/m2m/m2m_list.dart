import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/bloc/m2mList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/m2mList_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

import 'package:ttokssaem_flutter_app/ui/m2m/m2m.dart';


class M2mListviewPage extends StatefulWidget {
  @override
  _M2mListviewPageState createState() => _M2mListviewPageState();
}

class _M2mListviewPageState extends State<M2mListviewPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<M2mDataModel> _listM2mDataModel = [];

  late M2mListBloc _m2mListBloc;
  int _apiPage = 0;
  ScrollController _scrollController = ScrollController();
  bool _lastData = false;
  bool _processApi = false;
  final int _apiLimit = 15;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  @override
  void initState() {
    // get data when initState
    _m2mListBloc = BlocProvider.of<M2mListBloc>(context);
    _m2mListBloc.add(M2mList(page: _apiPage, length: _apiLimit, apiToken: apiToken));

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
        _m2mListBloc.add(M2mList(page: _apiPage, length: _apiLimit, apiToken: apiToken));
        _processApi = true;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          iconTheme: IconThemeData(
            color: Colors.black,
          ),
          elevation: 0,
          title: Text(
            '1:1 문의사항',
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
        ),
        body: RefreshIndicator(
          onRefresh: refreshData,
          child: BlocListener<M2mListBloc, M2mListState>(
            listener: (context, state) {
              if(state is M2mListError) {
                Fluttertoast.showToast(
                    backgroundColor: Colors.red,
                    textColor: Colors.white,
                    fontSize: 13.0,
                    msg: state.errorMessage,
                    toastLength: Toast.LENGTH_LONG);
              }
              if(state is M2mListSuccess) {
                _scrollController.addListener(_onScroll);
                if(state.m2mListData.listData.length == 0){
                  _lastData = true;
                } else {
                  _apiPage += 1;
                  _listM2mDataModel.addAll(state.m2mListData.listData);
                }
                _processApi = false;
              }
            },
            child: BlocBuilder<M2mListBloc, M2mListState>(
              builder: (context, state) {
                if(state is M2mListError) {
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
                            child: Text('문의사항 없음', style: TextStyle(
                                fontSize: 14,
                                color: Color(0xff777777)
                            ))
                        )
                    );
                  } else {
                    if(_listM2mDataModel.length==0){
                      return _shimmerLoading.buildShimmerContent();
                    } else {
                      return ListView.builder(
                        itemCount: (state is M2mListWaiting) ? _listM2mDataModel.length + 1 : _listM2mDataModel.length,
                        // Add one more item for progress indicator
                        padding: EdgeInsets.symmetric(vertical: 0),
                        physics: AlwaysScrollableScrollPhysics(),
                        itemBuilder: (BuildContext context, int index) {
                          if (index == _listM2mDataModel.length) {
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
        if(_listM2mDataModel[index].status == 'N')
          Navigator.push(context, MaterialPageRoute(builder: (context) => M2MPage(_listM2mDataModel[index].m2mid, _listM2mDataModel[index].question, _listM2mDataModel[index].status)));
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
                    Text(_listM2mDataModel[index].question,
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: BLACK55)),
                    SizedBox(
                      height: 4,
                    ),
                    Text(_listM2mDataModel[index].regdate,
                        style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 11)),
                    SizedBox(
                      height: 8,
                    ),
                    Text(_listM2mDataModel[index].status == 'Y' ? _listM2mDataModel[index].answer : '답변대기중', style: TextStyle(fontSize: 16, color: BLACK77)),
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
      _listM2mDataModel.clear();
      _m2mListBloc.add(M2mList(page: _apiPage, length: _apiLimit, apiToken: apiToken));
    });
  }
}
