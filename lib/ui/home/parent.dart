import 'package:convex_bottom_bar/convex_bottom_bar.dart';
import 'package:ttokssaem_flutter_app/ui/today/parent_today.dart';
import 'package:universal_io/io.dart';
import 'package:dio/dio.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';

import 'package:ttokssaem_flutter_app/reusable/global_widget.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

import 'package:ttokssaem_flutter_app/bloc/authcheck/bloc.dart';

import 'package:ttokssaem_flutter_app/ui/home/parent_home.dart';
import 'package:ttokssaem_flutter_app/ui/today/parent_today.dart';
import 'package:ttokssaem_flutter_app/ui/today/parent_today_ex.dart';
import 'package:ttokssaem_flutter_app/ui/last/parent_last.dart';
import 'package:ttokssaem_flutter_app/ui/notice/notice_list.dart';
import 'package:ttokssaem_flutter_app/ui/setting/setting.dart';
import 'package:ttokssaem_flutter_app/ui/m2m/m2m_list.dart';
import 'package:ttokssaem_flutter_app/ui/voca/voca_parent.dart';
import 'package:ttokssaem_flutter_app/ui/splash_screen.dart';

class ParentPage extends StatefulWidget {
  @override
  _ParentPageState createState() => _ParentPageState();
}

class _ParentPageState extends State<ParentPage> with WidgetsBindingObserver {

  // initialize global widget
  final _globalWidget = GlobalWidget();
  final _globalFunction = GlobalFunction();

  late AuthcheckBloc _authcheckBloc;
  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  /*
  Page Controller
   */
  late PageController _pageController;

  // Pages if you click bottom navigation
  final List<Widget> _contentPages = <Widget>[
    ParentHomePage(),
    // ParentTodayPage(), // 평시 전용
    ParentTodayExPage(), // 수능 전용
    ParentLastPage(),
    VocaHistListviewPage(),
    M2mListviewPage(),
    NoticeListviewPage(),
    SettingPage(),
  ];

  @override
  void initState() {
    // set initial pages for navigation to home page
    _pageController = PageController(initialPage: 0);
    _pageController.addListener(_handleTabSelection);

    _authcheckBloc = BlocProvider.of<AuthcheckBloc>(context);

    WidgetsBinding.instance?.addObserver(this);

    super.initState();
  }

  @override
  void dispose() {
    _pageController.dispose();

    WidgetsBinding.instance?.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // 포그라운드로 진입할 때의 작업 처리
      _authcheckBloc.add(Authcheck(apiToken: apiToken));
    }
  }
  void _handleTabSelection() {
    setState(() {
    });
  }


  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScopeNode currentFocus = FocusScope.of(context);

        if (!currentFocus.hasPrimaryFocus) {
          currentFocus.unfocus();
          // 화면 로테이션이 가능한 풀스크린 앱
          SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
        }
      },
      child: MultiBlocListener(
        listeners : [
          BlocListener<AuthcheckBloc, AuthcheckState>( listener: (context, state) {
            if(state is AuthcheckError) {
              // Navigator.pop(context);
              Fluttertoast.showToast(msg: state.errorMessage, toastLength: Toast.LENGTH_LONG, backgroundColor: Colors.red, textColor: Colors.white, fontSize: 13);
            }
            if(state is AuthcheckWaiting) {
              // FocusScope.of(context).unfocus();
              // _globalFunction.showProgressDialog(context);
            }
            if(state is AuthcheckSuccess) {
              // Navigator.pop(context);
              // 세션 타임 아웃
              if(state.authcheckData.code == TOKEN_EXPIRE){

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
                            new Text('알림'),
                          ],
                        ),
                        //
                        content: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Text(
                              '인증토큰의 유효기간이 만료되어 로그인화면으로 이동합니다.',
                            ),
                          ],
                        ),
                        actions: <Widget>[
                          new TextButton(
                            onPressed: () {
                              // Respond to button press
                              Navigator.pop(context);

                              TARGETID = '';
                              TARGETNAME = '';
                              Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (context) => SplashScreenPage()), (Route<dynamic> route) => false);
                            },
                            child: Text("확인"),
                          )
                        ],
                      );
                    });

              }
            }
          }),
        ],
        child: PopScope(),
      ),
    );
  }

  // this function is used for exit the application, user must click back button two times
  DateTime? _currentBackPressTime;
  Future<bool> _onWillPop() {
    DateTime now = DateTime.now();
    if (_currentBackPressTime == null || now.difference(_currentBackPressTime!) > Duration(seconds: 2)) {
      _currentBackPressTime = now;
      Fluttertoast.showToast(msg: '다시 한번 더 누르면 종료합니다.', toastLength: Toast.LENGTH_SHORT);
      return Future.value(false);
    }
    return Future.value(true);
  }

  PopScope() {
    return WillPopScope(
      onWillPop: _onWillPop,
      child: BodyForm(),
    );
  }


  BodyForm() {
    return DefaultTabController(
      length: 7, // 탭 개수와 반드시 동일해야 합니다
      child: Scaffold(
        backgroundColor: Colors.white,
        body: PageView(
          controller: _pageController,
          physics: NeverScrollableScrollPhysics(),
          children: _contentPages,
        ),
        bottomNavigationBar: ConvexAppBar(
          style: TabStyle.flip,
          height: 72,
          disableDefaultTabController: true, // ✅ 충돌 방지
          backgroundColor: TTOK_GREEN,
          color: Colors.white,
          activeColor: TTOK_YELLOW,
          items: [
            TabItem(icon: Icons.home, title: '홈'),
            TabItem(icon: Icons.pending_actions, title: '오늘\n계획'),
            TabItem(icon: Icons.table_view, title: '지난\n계획'),
            TabItem(icon: Icons.book_online, title: '단어장'),
            TabItem(icon: Icons.help_outline, title: '1:1문의'),
            TabItem(icon: Icons.notifications, title: '알림'),
            TabItem(icon: Icons.settings, title: '설정'),
          ],
          initialActiveIndex: 0,
          onTap: (int i){
            _tapNav(i);
          },
        ),
      ),
    );
  }

  void _tapNav(index){
    _pageController.jumpToPage(index);

    // this unfocus is to prevent show keyboard in the text field
    FocusScope.of(context).unfocus();
  }
}
