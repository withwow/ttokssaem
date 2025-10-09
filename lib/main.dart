
import 'package:package_info_plus/package_info_plus.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/requestVocaTest/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/studyPlanList/bloc.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
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


/*
Firebase Messaging
 */
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'firebase_options.dart';

/*
Firebase Messaging
 */
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  if (kDebugMode) {
    print('Handling a background message ${message.messageId}');
  }
}

late AndroidNotificationChannel channel;
late FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin;


void main() async {
  LicenseRegistry.addLicense(() async* {
    final license = await rootBundle.loadString('assets/google_fonts/OFL.txt');
    yield LicenseEntryWithLineBreaks(['assets/google_fonts'], license);
  });

  // this function makes application always run in portrait mode
  WidgetsFlutterBinding.ensureInitialized();


  // Version
  GetVersion();

  // 화면 로테이션이 가능한 풀스크린 앱
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);

  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]).then((_) async {
    /*
    Firebase Messaging
   */
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    channel = const AndroidNotificationChannel(
      'Default', // id
      'Default Channel', // title
      description:
      'This channel is default.', // description
      importance: Importance.high,
    );

    var initialzationSettingsAndroid =
    AndroidInitializationSettings('@mipmap/ic_launcher');

    var initialzationSettingsIOS = DarwinInitializationSettings(
      requestSoundPermission: true,
      requestBadgePermission: true,
      requestAlertPermission: true,
    );

    flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

    await flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);

    var initializationSettings = InitializationSettings(
        android: initialzationSettingsAndroid, iOS: initialzationSettingsIOS);

    await flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
    );

    await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );

    GetToken();

    runApp(const MyApp());
  });

}

void GetVersion() async {
  PackageInfo packageInfo = await PackageInfo.fromPlatform();
  APP_VERSION = packageInfo.version;
}
void GetToken() async {
  PUSHTOKEN = await FirebaseMessaging.instance.getToken();
  if (kDebugMode) {
    print("디버그 모드 입니다.");
    print("PUSHTOKEN : ${PUSHTOKEN ?? 'token NULL!'}");
  }else if (kReleaseMode) {
    print("릴리즈 모드 입니다.");
  }
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {

  @override
  void initState() {

    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      RemoteNotification? notification = message.notification;
      AndroidNotification? android = message.notification?.android;
      var androidNotiDetails = AndroidNotificationDetails(
        channel.id,
        channel.name,
        channelDescription: channel.description,
      );
      var iOSNotiDetails = const DarwinNotificationDetails();
      var details =
      NotificationDetails(android: androidNotiDetails, iOS: iOSNotiDetails);
      if (notification != null) {
        flutterLocalNotificationsPlugin.show(
          notification.hashCode,
          notification.title,
          notification.body,
          details,
        );
      }
    });

    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      if (kDebugMode) {
        print(message);
      }
    });

  }

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