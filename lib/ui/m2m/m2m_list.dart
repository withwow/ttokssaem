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
    _m2mListBloc
        .add(M2mList(page: _apiPage, length: _apiLimit, apiToken: apiToken));

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
        _m2mListBloc.add(
            M2mList(page: _apiPage, length: _apiLimit, apiToken: apiToken));
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
          style: TextStyle(fontSize: 18, color: Colors.white),
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
      backgroundColor: const Color(0xFFF4F7F5),
      body: RefreshIndicator(
        onRefresh: refreshData,
        child: BlocListener<M2mListBloc, M2mListState>(
          listener: (context, state) {
            if (state is M2mListError) {
              Fluttertoast.showToast(
                  backgroundColor: Colors.red,
                  textColor: Colors.white,
                  fontSize: 13.0,
                  msg: state.errorMessage,
                  toastLength: Toast.LENGTH_LONG);
            }
            if (state is M2mListSuccess) {
              _scrollController.addListener(_onScroll);
              if (state.m2mListData.listData.length == 0) {
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
              if (state is M2mListError) {
                return Container(
                    child: Center(
                        child: Text('잠시 후 다시 시도하여 주세요',
                            style: TextStyle(
                                fontSize: 14, color: Color(0xff777777)))));
              } else {
                if (_lastData && _apiPage == 0) {
                  return Container(
                      child: Center(
                          child: Text('문의사항 없음',
                              style: TextStyle(
                                  fontSize: 14, color: Color(0xff777777)))));
                } else {
                  if (_listM2mDataModel.length == 0) {
                    return _shimmerLoading.buildShimmerContent();
                  } else {
                    return ListView.builder(
                      itemCount: (state is M2mListWaiting)
                          ? _listM2mDataModel.length + 1
                          : _listM2mDataModel.length,
                      // Add one more item for progress indicator
                      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
                      physics: AlwaysScrollableScrollPhysics(),
                      itemBuilder: (BuildContext context, int index) {
                        if (index == _listM2mDataModel.length) {
                          return _globalWidget
                              .buildProgressIndicator(_lastData);
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
          Navigator.push(context,
              MaterialPageRoute(builder: (context) => RequestM2MPage()));
        },
        child: Icon(
          Icons.question_mark,
          color: TTOK_GREEN,
        ),
        mini: true,
        backgroundColor: TTOK_YELLOW,
      ),
    );
  }

  Widget _buildItem(index) {
    final item = _listM2mDataModel[index];
    final answered = item.status == 'Y';
    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () {
        if (!answered)
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) =>
                      M2MPage(item.m2mid, item.question, item.status)));
      },
      child: Card(
        margin: const EdgeInsets.only(bottom: 10),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Color(0xFFE2E9E5)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: answered
                      ? const Color(0xFFE5F0EB)
                      : const Color(0xFFFFF7CC),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                    answered
                        ? Icons.mark_chat_read_outlined
                        : Icons.chat_bubble_outline,
                    color: answered ? TTOK_GREEN : const Color(0xFF9A7A00)),
              ),
              const SizedBox(width: 12),
              Expanded(
                  child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Expanded(
                        child: Text(item.question,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: BLACK21))),
                    const SizedBox(width: 8),
                    Text(answered ? '답변완료' : '답변대기',
                        style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: answered
                                ? TTOK_GREEN
                                : const Color(0xFF9A7A00))),
                  ]),
                  const SizedBox(height: 5),
                  Text(item.regdate,
                      style: const TextStyle(fontSize: 12, color: SOFT_GRAY)),
                  const SizedBox(height: 10),
                  Text(answered ? item.answer : '선생님이 문의를 확인하고 있습니다.',
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                          fontSize: 14, height: 1.45, color: BLACK77)),
                ],
              )),
            ],
          ),
        ),
      ),
    );
  }

  Future refreshData() async {
    setState(() {
      _apiPage = 0;
      _lastData = false;
      _listM2mDataModel.clear();
      _m2mListBloc
          .add(M2mList(page: _apiPage, length: _apiLimit, apiToken: apiToken));
    });
  }
}
