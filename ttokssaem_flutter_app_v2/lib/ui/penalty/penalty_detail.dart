import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/bloc/penaltyDetail/bloc.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/model/penaltyDetail_model.dart';

class PenaltyDetailPage extends StatefulWidget {
  final String targetid;
  final bool showStudentName;

  const PenaltyDetailPage({
    Key? key,
    this.targetid = '',
    this.showStudentName = false,
  }) : super(key: key);

  @override
  State<PenaltyDetailPage> createState() => _PenaltyDetailPageState();
}

class _PenaltyDetailPageState extends State<PenaltyDetailPage> {
  static const _pageSize = 20;
  final _apiToken = CancelToken();
  final _scrollController = ScrollController();
  final List<PenaltyHistoryDataModel> _history = [];
  late PenaltyDetailBloc _penaltyDetailBloc;
  int _page = 0;
  int _monthPenalty = 0;
  String _studentName = '';
  bool _loading = true;
  bool _loadingMore = false;
  bool _hasNext = false;
  String? _errorMessage;
  int _activeRequestId = 0;

  @override
  void initState() {
    super.initState();
    _penaltyDetailBloc = BlocProvider.of<PenaltyDetailBloc>(context);
    _scrollController.addListener(_onScroll);
    _loadPage(reset: true);
  }

  @override
  void dispose() {
    _apiToken.cancel('cancelled');
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 120 &&
        _hasNext &&
        !_loadingMore &&
        !_loading) {
      _loadPage();
    }
  }

  Future<void> _refresh() async => _loadPage(reset: true);

  Future<void> _loadPage({bool reset = false}) async {
    if (reset) {
      setState(() {
        _page = 0;
        _history.clear();
        _hasNext = false;
        _loading = true;
        _loadingMore = false;
        _errorMessage = null;
      });
    } else {
      setState(() => _loadingMore = true);
    }
    final requestId = ++_activeRequestId;
    _penaltyDetailBloc.add(SelPenaltyDetail(
      targetid: widget.targetid,
      page: _page,
      length: _pageSize,
      requestId: requestId,
      apiToken: _apiToken,
    ));
  }

  void _handleSuccess(PenaltyDetailModel data) {
    if (!mounted) return;
    setState(() {
      _monthPenalty = data.monthpenalty;
      _studentName = data.membername;
      _history.addAll(data.listData);
      _hasNext = data.remain == 1;
      _page += 1;
      _loading = false;
      _loadingMore = false;
      _errorMessage = null;
    });
  }

  void _handleError(String message) {
    if (!mounted) return;
    setState(() {
      _loading = false;
      _loadingMore = false;
      _errorMessage = message;
    });
    Fluttertoast.showToast(
      msg: message,
      toastLength: Toast.LENGTH_LONG,
      backgroundColor: Colors.red,
      textColor: Colors.white,
      fontSize: 13,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F5),
      appBar: AppBar(
        title:
            const Text('벌점 조회', style: TextStyle(fontWeight: FontWeight.w700)),
        backgroundColor: TTOK_GREEN,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: BlocListener<PenaltyDetailBloc, PenaltyDetailState>(
        listener: (context, state) {
          if (state is PenaltyDetailSuccess &&
              state.requestId == _activeRequestId) {
            _handleSuccess(state.penaltyDetailData);
          }
          if (state is PenaltyDetailError &&
              state.requestId == _activeRequestId) {
            _handleError(state.errorMessage);
          }
        },
        child: _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading && _history.isEmpty) {
      return const Center(child: CircularProgressIndicator(color: TTOK_GREEN));
    }
    if (_errorMessage != null && _history.isEmpty) {
      return Center(
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: TTOK_GREEN),
          onPressed: () => _loadPage(reset: true),
          child: const Text('다시 시도'),
        ),
      );
    }
    return RefreshIndicator(
      color: TTOK_GREEN,
      onRefresh: _refresh,
      child: ListView.builder(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 28),
        itemCount: _history.isEmpty ? 2 : _history.length + 2,
        itemBuilder: (context, index) {
          if (index == 0) return _summaryCard();
          if (_history.isEmpty) return _emptyState();
          if (index == _history.length + 1) {
            return _loadingMore
                ? const Padding(
                    padding: EdgeInsets.all(16),
                    child: Center(
                        child: CircularProgressIndicator(color: TTOK_GREEN)))
                : const SizedBox(height: 8);
          }
          return _historyItem(_history[index - 1]);
        },
      ),
    );
  }

  Widget _summaryCard() => Container(
        margin: const EdgeInsets.only(bottom: 20),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: TTOK_GREEN,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.showStudentName)
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text('$_studentName 학생',
                    style: const TextStyle(color: WHITEEE, fontSize: 16)),
              ),
            const Text('이번 달 벌점',
                style: TextStyle(color: WHITECC, fontSize: 16)),
            const SizedBox(height: 8),
            Text('$_monthPenalty점',
                style: const TextStyle(
                    color: TTOK_YELLOW,
                    fontSize: 38,
                    fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            const Text('취소된 벌점은 합계에 포함되지 않습니다.',
                style: TextStyle(color: WHITECC, fontSize: 12)),
            const Padding(
              padding: EdgeInsets.only(top: 28),
              child: Text('전체 벌점 이력',
                  style: TextStyle(
                      color: WHITEEE,
                      fontSize: 18,
                      fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      );

  Widget _emptyState() => const Padding(
        padding: EdgeInsets.only(top: 60),
        child: Center(
          child: Text('등록된 벌점 이력이 없습니다.',
              style: TextStyle(color: BLACK77, fontSize: 15)),
        ),
      );

  Widget _historyItem(PenaltyHistoryDataModel item) {
    final cancelled = item.isCancelled;
    return Opacity(
      opacity: cancelled ? 0.55 : 1,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: cancelled
                    ? const Color(0xFFEEEEEE)
                    : const Color(0x1FF2E524),
                shape: BoxShape.circle,
              ),
              child: Icon(cancelled ? Icons.undo : Icons.warning_amber_rounded,
                  color: cancelled ? BLACK77 : TTOK_GREEN),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item.blackmarkname.isEmpty ? '벌점' : item.blackmarkname,
                      style: const TextStyle(
                          color: BLACK21,
                          fontSize: 16,
                          fontWeight: FontWeight.w700)),
                  if (item.reason.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(item.reason,
                        style: const TextStyle(color: BLACK77, fontSize: 14)),
                  ],
                  const SizedBox(height: 6),
                  Text(
                      cancelled && item.canceldate.isNotEmpty
                          ? '부과 취소 · ${item.canceldate}'
                          : item.regdate,
                      style: const TextStyle(color: SOFT_GRAY, fontSize: 12)),
                ],
              ),
            ),
            Text(cancelled ? '취소됨' : '+${item.point}점',
                style: TextStyle(
                    color: cancelled ? BLACK77 : TTOK_GREEN,
                    fontSize: 14,
                    fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}
