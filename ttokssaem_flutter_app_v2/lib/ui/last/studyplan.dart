import 'package:dio/dio.dart';
import 'package:badges/badges.dart' as custom_badge;
import 'package:flutter/material.dart';
import 'package:ttokssaem_flutter_app/model/timetable_model.dart';
import 'package:ttokssaem_flutter_app/reusable/timetable_repository.dart';

import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_function.dart';
import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/shimmer_loading.dart';

import 'package:ttokssaem_flutter_app/bloc/studyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/model/studyPlanList_model.dart';

class StudyPlanPage extends StatefulWidget {
  final String targetid;
  final String plandate;

  const StudyPlanPage(this.targetid, this.plandate);

  @override
  _StudyPlanPageState createState() => _StudyPlanPageState();
}

class _StudyPlanPageState extends State<StudyPlanPage> {
  // initialize global function and global widget
  final _globalFunction = GlobalFunction();
  final _globalWidget = GlobalWidget();
  final _shimmerLoading = ShimmerLoading();

  List<StudyPlanDataModel> _listStudyPlanDataModel = [];

  late StudyPlanListBloc _studyPlanListBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  bool _lastStudyPlanData = false;

  TimetableModel? _timetable; // widget.plandate 의 시간표

  @override
  void initState() {
    // get data when initState
    _studyPlanListBloc = BlocProvider.of<StudyPlanListBloc>(context);
    _studyPlanListBloc.add(StudyPlanList(
        targetid: widget.targetid,
        plandate: widget.plandate,
        apiToken: apiToken));

    TimetableRepository.instance.get(widget.plandate, apiToken: apiToken).then((timetable) {
      if (mounted) setState(() { _timetable = timetable; });
    });

    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  String timeStamp(plandate) {
    String stamp = '';

    stamp =
        '${plandate.substring(0, 4)}.${plandate.substring(4, 6)}.${plandate.substring(6, 8)}';

    return stamp;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _globalWidget.globalAppBar(
        title: const Text('지난 학습계획'),
      ),
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: EdgeInsets.symmetric(vertical: 8),
              child: Chip(
                label: Text(timeStamp(widget.plandate),
                    style: TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                        fontWeight: FontWeight.w500)),
                backgroundColor: SOFT_GREEN,
              ),
            ),
            Container(
              margin: EdgeInsets.symmetric(vertical: 0),
              child: BlocListener<StudyPlanListBloc, StudyPlanListState>(
                listener: (context, state) {
                  if (state is StudyPlanListError) {
                    Fluttertoast.showToast(
                        backgroundColor: Colors.red,
                        textColor: Colors.white,
                        fontSize: 13.0,
                        msg: state.errorMessage,
                        toastLength: Toast.LENGTH_LONG);
                  }
                  if (state is StudyPlanListSuccess) {
                    //_scrollController.addListener(_onScroll);
                    if (state.studyPlanListData.listData.length == 0) {
                      _lastStudyPlanData = true;
                    } else {
                      _listStudyPlanDataModel
                          .addAll(state.studyPlanListData.listData);
                    }
                  }
                },
                child: BlocBuilder<StudyPlanListBloc, StudyPlanListState>(
                  builder: (context, state) {
                    if (state is StudyPlanListError) {
                      return Container(
                          child: Center(
                              child: Text('잠시 후 다시 시도하여 주세요',
                                  style: TextStyle(
                                      fontSize: 14,
                                      color: Color(0xff777777)))));
                    } else {
                      if (_lastStudyPlanData) {
                        return Container(
                            child: Center(
                                child: Text('등록된 학습계획 없음',
                                    style: TextStyle(
                                        fontSize: 14,
                                        color: Color(0xff777777)))));
                      } else {
                        if (_listStudyPlanDataModel.length == 0) {
                          return _shimmerLoading.buildShimmerContent();
                        } else {
                          return ListView.builder(
                            itemCount: _listStudyPlanDataModel.length,
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
          ],
        ),
      ),
    );
  }

  // 교시 이름은 그 학습계획 날짜(widget.plandate)의 시간표(수능/평시)로 표시한다.
  // 수능 기간은 어드민 > 시간표 기간 관리에서 설정하므로 매년 날짜를 고칠 필요가 없다.
  String classname(classhour) {
    final TimetableModel? timetable = _timetable;
    if (timetable == null) return '';
    return timetable.shortLabelOf(classhour is int ? classhour : int.tryParse(classhour.toString()) ?? 0);
  }

  Widget _buildPlan(index) {
    final plan = _listStudyPlanDataModel[index];
    final isAchieved = plan.plancount == plan.achievecount;

    return GestureDetector(
      behavior: HitTestBehavior.translucent,
      onTap: () {},
      child: Container(
        width: double.infinity,
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xffe2e9e5)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 76,
              child: Text(
                classname(plan.classhour),
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: TTOK_GREEN,
                ),
              ),
            ),
            custom_badge.Badge(
              child: const Icon(Icons.article, size: 25, color: Colors.black),
              badgeContent: _badgeCount(plan.plancount),
              badgeColor: TTOK_YELLOW,
            ),
            const SizedBox(width: 7),
            custom_badge.Badge(
              child: const Icon(Icons.done, size: 25, color: Colors.black),
              badgeContent: _badgeCount(plan.achievecount),
              badgeColor: isAchieved ? TTOK_PINK : Colors.grey,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                plan.study,
                softWrap: true,
                style: TextStyle(color: BLACK77),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _badgeCount(dynamic count) {
    return SizedBox(
      width: 18,
      height: 18,
      child: Center(
        child: FittedBox(
          child: Text(
            '$count',
            style: TextStyle(color: TTOK_GREEN, fontSize: 10),
          ),
        ),
      ),
    );
  }
}
