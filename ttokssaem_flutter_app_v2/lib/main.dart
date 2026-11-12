

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/requestVocaTest/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/studyPlanList/bloc.dart';

import 'package:ttokssaem_flutter_app/ui/splash_screen.dart';

import 'package:ttokssaem_flutter_app/bloc/version/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/authcheck/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/findid/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/findpw/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/joinMember/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/checkMemberId/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/login/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/memberInfo/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/updatePush/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/updateMemberInfo/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/updatePassword/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/withdraw/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/noticeList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/todayNoticeList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/todayStudyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/regStudyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/achiveStudyPlanList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/dashboardStudyPlan/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/selStudentList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/requestm2m/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/m2mList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/updatem2m/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/requestVocaTest/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/finishVocaTest/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/selVocaMemoList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/selVocaTestList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/selVocaSolveList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/selVocaHistList/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/appchecker/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/penaltyDetail/bloc.dart';


import 'dart:async';

import 'package:ttokssaem_flutter_app/config/app_init.dart';

void main() {
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    LicenseRegistry.addLicense(() async* {
      final license = await rootBundle.loadString('assets/google_fonts/OFL.txt');
      yield LicenseEntryWithLineBreaks(['assets/google_fonts'], license);
    });

    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      debugPrint('FlutterError: ${details.exceptionAsString()}');
    };

    // 화면 로테이션이 가능한 풀스크린 앱
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);

    // 세로 고정. 실패하거나 응답이 늦어도 앱 시작을 막지 않는다.
    try {
      await SystemChrome.setPreferredOrientations(
              [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown])
          .timeout(const Duration(seconds: 2));
    } catch (e) {
      debugPrint('setPreferredOrientations failed: $e');
    }

    // Firebase, 알림 등 초기화는 기다리지 않고 시작만 해 둔다.
    // 스플래시 화면이 제한 시간 안에서 기다린 뒤 로그인 화면으로 넘어간다.
    unawaited(AppInit.run());

    runApp(const MyApp());
  }, (Object error, StackTrace stack) {
    debugPrint('Uncaught error: $error\n$stack');
  });
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
        providers: [
          BlocProvider<VersionBloc>(
            create: (BuildContext context) => VersionBloc(),
          ),
          BlocProvider<AuthcheckBloc>(
            create: (BuildContext context) => AuthcheckBloc(),
          ),
          BlocProvider<JoinMemberBloc>(
            create: (BuildContext context) => JoinMemberBloc(),
          ),
          BlocProvider<FindidBloc>(
            create: (BuildContext context) => FindidBloc(),
          ),
          BlocProvider<FindpwBloc>(
            create: (BuildContext context) => FindpwBloc(),
          ),
          BlocProvider<CheckMemberIdBloc>(
            create: (BuildContext context) => CheckMemberIdBloc(),
          ),
          BlocProvider<LoginBloc>(
            create: (BuildContext context) => LoginBloc(),
          ),
          BlocProvider<MemberInfoBloc>(
            create: (BuildContext context) => MemberInfoBloc(),
          ),
          BlocProvider<UpdatePushBloc>(
            create: (BuildContext context) => UpdatePushBloc(),
          ),
          BlocProvider<UpdateMemberInfoBloc>(
            create: (BuildContext context) => UpdateMemberInfoBloc(),
          ),
          BlocProvider<UpdatePasswordBloc>(
            create: (BuildContext context) => UpdatePasswordBloc(),
          ),
          BlocProvider<WithdrawBloc>(
            create: (BuildContext context) => WithdrawBloc(),
          ),
          BlocProvider<NoticeListBloc>(
            create: (BuildContext context) => NoticeListBloc(),
          ),
          BlocProvider<TodayNoticeListBloc>(
            create: (BuildContext context) => TodayNoticeListBloc(),
          ),
          BlocProvider<TodayStudyPlanListBloc>(
            create: (BuildContext context) => TodayStudyPlanListBloc(),
          ),
          BlocProvider<RegStudyPlanListBloc>(
            create: (BuildContext context) => RegStudyPlanListBloc(),
          ),
          BlocProvider<AchiveStudyPlanListBloc>(
            create: (BuildContext context) => AchiveStudyPlanListBloc(),
          ),
          BlocProvider<DashboardStudyPlanBloc>(
            create: (BuildContext context) => DashboardStudyPlanBloc(),
          ),
          BlocProvider<SelStudentListBloc>(
            create: (BuildContext context) => SelStudentListBloc(),
          ),
          BlocProvider<StudyPlanListBloc>(
            create: (BuildContext context) => StudyPlanListBloc(),
          ),
          BlocProvider<RequestM2MBloc>(
            create: (BuildContext context) => RequestM2MBloc(),
          ),
          BlocProvider<M2mListBloc>(
            create: (BuildContext context) => M2mListBloc(),
          ),
          BlocProvider<UpdateM2MBloc>(
            create: (BuildContext context) => UpdateM2MBloc(),
          ),
          BlocProvider<SelVocaMemoListBloc>(
            create: (BuildContext context) => SelVocaMemoListBloc(),
          ),
          BlocProvider<RequestVocaTestBloc>(
            create: (BuildContext context) => RequestVocaTestBloc(),
          ),
          BlocProvider<FinishVocaTestBloc>(
            create: (BuildContext context) => FinishVocaTestBloc(),
          ),
          BlocProvider<SelVocaTestListBloc>(
            create: (BuildContext context) => SelVocaTestListBloc(),
          ),
          BlocProvider<SelVocaSolveListBloc>(
            create: (BuildContext context) => SelVocaSolveListBloc(),
          ),
          BlocProvider<SelVocaHistListBloc>(
            create: (BuildContext context) => SelVocaHistListBloc(),
          ),
          BlocProvider<AppCheckerBloc>(
            create: (BuildContext context) => AppCheckerBloc(),
          ),
          BlocProvider<PenaltyDetailBloc>(
            create: (BuildContext context) => PenaltyDetailBloc(),
          ),
        ],
        child: MaterialApp(
          title: 'Flutter Demo',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
          // This is the theme of your application.
          //
          // Try running your application with "flutter run". You'll see the
          // application has a blue toolbar. Then, without quitting the app, try
          // changing the primarySwatch below to Colors.green and then invoke
          // "hot reload" (press "r" in the console where you ran "flutter run",
          // or simply save your changes to "hot reload" in a Flutter IDE).
          // Notice that the counter didn't reset back to zero; the application
          // is not restarted.
          primarySwatch: Colors.blue,
          ),
          home: SplashScreenPage(),
       )
    );
  }
}
