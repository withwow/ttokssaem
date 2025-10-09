import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/bloc/noticeList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/noticeList_model.dart';

import 'package:ttokssaem_flutter_app/ui/home/requestm2m.dart';

class NoticeListviewPage extends StatefulWidget {
  @override
  _NoticeListviewPageState createState() => _NoticeListviewPageState();
}

class _NoticeListviewPageState extends State<NoticeListviewPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<NoticeDataModel> _listNoticeDataModel = [];

  late NoticeListBloc _noticeListBloc;
  int _apiPage = 0;
  ScrollController _scrollController = ScrollController();
  bool _lastData = false;
  bool _processApi = false;
  final int _apiLimit = 15;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  @override
  void initState() {
    // get data when initState
    _noticeListBloc = BlocProvider.of<NoticeListBloc>(context);
    _noticeListBloc.add(NoticeList(page: _apiPage, length: _apiLimit, apiToken: apiToken));

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
        _noticeListBloc.add(NoticeList(page: _apiPage, length: _apiLimit, apiToken: apiToken));
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
            color: Colors.black,
          ),
          elevation: 0,
          title: Text(
            '알림',
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
          child: BlocListener<NoticeListBloc, NoticeListState>(
            listener: (context, state) {
              if(state is NoticeListError) {
                Fluttertoast.showToast(
                    backgroundColor: Colors.red,
                    textColor: Colors.white,
                    fontSize: 13.0,
                    msg: state.errorMessage,
                    toastLength: Toast.LENGTH_LONG);
              }
              if(state is NoticeListSuccess) {
                _scrollController.addListener(_onScroll);
                if(state.noticeListData.listData.length == 0){
                  _lastData = true;
                } else {
                  _apiPage += 1;
                  _listNoticeDataModel.addAll(state.noticeListData.listData);
                }
                _processApi = false;
              }
            },
            child: BlocBuilder<NoticeListBloc, NoticeListState>(
              builder: (context, state) {
                if(state is NoticeListError) {
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
                            child: Text('알림 없음', style: TextStyle(
                                fontSize: 14,
                                color: Color(0xff777777)
                            ))
                        )
                    );
                  } else {
                    if(_listNoticeDataModel.length==0){
                      return _shimmerLoading.buildShimmerContent();
                    } else {
                      return ListView.builder(
                        itemCount: (state is NoticeListWaiting) ? _listNoticeDataModel.length + 1 : _listNoticeDataModel.length,
                        // Add one more item for progress indicator
                        padding: EdgeInsets.symmetric(vertical: 0),
                        physics: AlwaysScrollableScrollPhysics(),
                        itemBuilder: (BuildContext context, int index) {
                          if (index == _listNoticeDataModel.length) {
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

  Future refreshData() async {
    setState(() {
      _apiPage = 0;
      _lastData = false;
      _listNoticeDataModel.clear();
      _noticeListBloc.add(NoticeList(page: _apiPage, length: _apiLimit, apiToken: apiToken));
    });
  }
}
