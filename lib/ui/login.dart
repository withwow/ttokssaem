import 'dart:core';
import 'dart:math'; // Import for sqrt

import 'package:universal_io/io.dart';
import 'package:dio/dio.dart';
import 'package:store_redirect/store_redirect.dart';

import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:device_apps/device_apps.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/reusable/global_function.dart';

import 'package:ttokssaem_flutter_app/bloc/version/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/login/bloc.dart';
import 'package:ttokssaem_flutter_app/bloc/appchecker/bloc.dart';

import 'package:ttokssaem_flutter_app/ui/member/signup.dart';
import 'package:ttokssaem_flutter_app/ui/member/findpw.dart';
import 'package:ttokssaem_flutter_app/ui/member/findid.dart';

import 'package:ttokssaem_flutter_app/ui/home/student.dart';
import 'package:ttokssaem_flutter_app/ui/home/parent.dart';

import '../model/appChecker_model.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  static final storage =
      FlutterSecureStorage(); //flutter_secure_storage 사용을 위한 초기화 작업

  bool _stateVersionConfirm = false;

  bool _obscureText = true;
  IconData _iconVisible = Icons.visibility_off;

  late VersionBloc _versionBloc;
  late LoginBloc _loginBloc;
  late AppCheckerBloc _appCheckerBloc;

  CancelToken apiToken = CancelToken(); // used to cancel fetch data from API

  final _globalFunction = GlobalFunction();

  late TextEditingController useridController;
  late TextEditingController userpwController;

  final List<String> _appsToCheck = [
    "com.whatsapp", // WhatsApp
    "com.facebook.katana", // Facebook
    "com.instagram.android", // Instagram
    "com.kakao.talk", // 카톡
    "jp.naver.line.android", // 라인
    "com.iloen.melon", // 멜론
    "com.nhn.android.webtoon", // 네이버웹툰
    "net.daum.android.webtoon", // 카카오웹툰
    "com.anytoon.anytoon", // 애니툰
  ];
  final Map<String, bool> _appsStatus = {}; // 앱 설치 상태 저장

  void _toggleObscureText() {
    setState(() {
      _obscureText = !_obscureText;
      if (_obscureText == true) {
        _iconVisible = Icons.visibility_off;
      } else {
        _iconVisible = Icons.visibility;
      }
    });
  }

  void _setStateVersionConfirm() {
    setState(() {
      _stateVersionConfirm = true;
    });
  }

  void _versionCheck() async {
    String _os = 'editor';
    String _version = APP_VERSION;
    if (Platform.isAndroid) _os = 'andr';
    if (Platform.isIOS) _os = 'ios';

    _versionBloc.add(Version(os: _os, version: _version, apiToken: apiToken));
  }

  bool isTablet(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final diagonal = sqrt(size.width * size.width +
        size.height * size.height); // Use sqrt function from dart:math

    // 대각선 크기가 1100픽셀 이상이면 태블릿으로 간주
    return diagonal > 1100;
  }

  Future<void> checkMultipleApps() async {
    // 태블릿 여부 확인
    String deviceType = isTablet(context) ? 'tablet' : 'phone';
    if (deviceType == 'tablet') {
      // 앱 설치 여부 확인
      List<AppCheckDataModel> lists = [];
      try {
        for (String packageName in _appsToCheck) {
          bool isInstalled = await DeviceApps.isAppInstalled(packageName);
          if (kDebugMode) {
            print('app : ${packageName}');
            print('isInstalled : ${isInstalled}');
          }

          if (isInstalled) {
            lists.add(AppCheckDataModel(
                appname: packageName)); // AppCheckDataModel 생성 및 추가
          }
        }
      } catch (e) {}

      if (lists.isNotEmpty) {
        _appCheckerBloc.add(
            AppChecker(device: deviceType, lists: lists, apiToken: apiToken));
      }
    }

    Navigator.push(
        context, MaterialPageRoute(builder: (context) => StudentPage()));
  }

  void _showMinorUpdate(BuildContext context) {
    showCupertinoDialog<void>(
      context: context,
      builder: (BuildContext context) => CupertinoAlertDialog(
        title: Text('업데이트'),
        content: Text('업데이트 내용이 있습니다. 업데이트 하시겠습니까?'),
        actions: <CupertinoDialogAction>[
          CupertinoDialogAction(
            child: Text('아니오'),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
          CupertinoDialogAction(
            child: Text('업데이트'),
            isDestructiveAction: true,
            onPressed: () {
              Navigator.pop(context);

              // Go to Market
              StoreRedirect.redirect(
                androidAppId: "com.sevendays.ttokssaem",
                iOSAppId: "1636579327",
              );
            },
          )
        ],
      ),
    );
  }

  void _showMajorUpdate(BuildContext context) {
    showCupertinoDialog<void>(
      context: context,
      builder: (BuildContext context) => CupertinoAlertDialog(
        title: Text('업데이트'),
        content: Text('업데이트 내용이 있습니다. 업데이트 후 정상적으로 이용 가능합니다'),
        actions: <CupertinoDialogAction>[
          CupertinoDialogAction(
            child: Text('종료'),
            onPressed: () {
              if (Platform.isIOS) {
                exit(0);
              } else {
                SystemNavigator.pop();
              }
            },
          ),
          CupertinoDialogAction(
            child: Text('업데이트'),
            isDestructiveAction: true,
            onPressed: () {
              Navigator.pop(context);

              // Go to Market
              StoreRedirect.redirect(
                androidAppId: "com.sevendays.ttokssaem",
                iOSAppId: "1636579327",
              );
            },
          )
        ],
      ),
    );
  }

  _loadStorageMethod() async {
    String? _userid = await storage.read(key: 'userid');
    String? _userpw = await storage.read(key: 'userpw');

    useridController.text = _userid ?? '';
    userpwController.text = _userpw ?? '';
  }

  _saveStorageMethod() async {
    await storage.write(key: 'userid', value: useridController.text.toString());
    await storage.write(key: 'userpw', value: userpwController.text.toString());
  }

  @override
  void initState() {
    useridController = TextEditingController();
    userpwController = TextEditingController();

    _versionBloc = BlocProvider.of<VersionBloc>(context);
    _loginBloc = BlocProvider.of<LoginBloc>(context);
    _appCheckerBloc = BlocProvider.of<AppCheckerBloc>(context);

    _versionCheck();

    //비동기로 flutter secure storage 정보를 불러오는 작업.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadStorageMethod();
    });

    super.initState();
  }

  @override
  void dispose() {
    useridController.dispose();
    userpwController.dispose();
    apiToken.cancel();
    super.dispose();
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
        child: MultiBlocListener(listeners: [
          BlocListener<VersionBloc, VersionState>(listener: (context, state) {
            if (state is VersionError) {
              Navigator.pop(context);
              Fluttertoast.showToast(
                  msg: state.errorMessage,
                  toastLength: Toast.LENGTH_LONG,
                  backgroundColor: Colors.red,
                  textColor: Colors.white,
                  fontSize: 13);
            }
            if (state is VersionWaiting) {
              FocusScope.of(context).unfocus();
              _globalFunction.showProgressDialog(context);
            }
            if (state is VersionSuccess) {
              Navigator.pop(context);

              if (kDebugMode) {
                print('data version : ${state.versionData.version}');
              }
              switch (state.versionData.version) {
                case 1:
                  // Minor
                  _showMinorUpdate(context);
                  // 버전 확인 완료
                  _setStateVersionConfirm();
                  break;
                case 2:
                  // Major
                  _showMajorUpdate(context);
                  break;
                default:
                  // 버전 확인 완료
                  _setStateVersionConfirm();
                  break;
              }
            }
          }),
          BlocListener<LoginBloc, LoginState>(listener: (context, state) {
            if (state is LoginError) {
              Navigator.pop(context);
              Fluttertoast.showToast(
                  msg: state.errorMessage,
                  toastLength: Toast.LENGTH_LONG,
                  backgroundColor: Colors.red,
                  textColor: Colors.white,
                  fontSize: 13);
            }
            if (state is LoginWaiting) {
              FocusScope.of(context).unfocus();
              _globalFunction.showProgressDialog(context);
            }
            if (state is LoginSuccess) {
              Navigator.pop(context);

              if (kDebugMode) {
                print(
                    'data Login.accesstoken : ${state.loginData.accesstoken}');
                print('data Login.type : ${state.loginData.type}');
              }
              ACCESSTOKEN = state.loginData.accesstoken;
              TYPE = state.loginData.type;

              Navigator.pop(context);

              if (TYPE == 'S') {
                // 학생
                if (!Platform.isAndroid) {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => StudentPage()));
                } else {
                  checkMultipleApps();
                }
              } else {
                // 학부모
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => ParentPage()));
              }
            }
          }),
          BlocListener<AppCheckerBloc, AppCheckerState>(
              listener: (context, state) {}),
        ], child: PopScope()));
  }

  // this function is used for exit the application, user must click back button two times
  DateTime? _currentBackPressTime;
  Future<bool> _onWillPop() {
    DateTime now = DateTime.now();
    if (_currentBackPressTime == null ||
        now.difference(_currentBackPressTime!) > Duration(seconds: 2)) {
      _currentBackPressTime = now;
      Fluttertoast.showToast(
          msg: '다시 한번 더 누르면 종료합니다.', toastLength: Toast.LENGTH_SHORT);
      return Future.value(false);
    }
    return Future.value(true);
  }

  PopScope() {
    return WillPopScope(
      onWillPop: _onWillPop,
      child: LoginForm(),
    );
  }

  InputDecoration _inputDecoration({
    required String label,
    required IconData icon,
    Widget? suffixIcon,
  }) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: BLACK77),
      prefixIcon: Icon(icon, color: TTOK_GREEN, size: 21),
      suffixIcon: suffixIcon,
      filled: true,
      fillColor: const Color(0xFFF6F8F7),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 17),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: TTOK_GREEN, width: 1.5),
      ),
    );
  }

  void _login() {
    final memberid = useridController.text.trim();
    final memberpw = userpwController.text;

    if (memberid.isEmpty || memberpw.isEmpty) {
      _globalFunction.showFailedToast('아이디와 비밀번호를 입력하세요.');
      return;
    }

    if (memberid == 'guest1' ||
        memberid == 'guest2' ||
        memberid == 'teacher1' ||
        memberid == 'parent1' ||
        memberid == 'parent2') {
      BRANCHID = DEMO_BRANCHID;
    }

    _saveStorageMethod();
    _loginBloc.add(Login(
      memberid: memberid,
      memberpw: memberpw,
      os: Platform.isIOS ? 'ios' : 'andr',
      pushtoken: PUSHTOKEN ?? '',
      apiToken: apiToken,
    ));
  }

  LoginForm() {
    return Scaffold(
      backgroundColor: TTOK_GREEN,
      body: AnnotatedRegion<SystemUiOverlayStyle>(
        value: Platform.isIOS
            ? SystemUiOverlayStyle.light
            : const SystemUiOverlayStyle(
                statusBarIconBrightness: Brightness.light),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) => SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 28),
              child: ConstrainedBox(
                constraints:
                    BoxConstraints(minHeight: constraints.maxHeight - 48),
                child: IntrinsicHeight(
                  child: Column(
                    children: [
                      const SizedBox(height: 24),
                      Image.asset(
                        'assets/images/logo_banner_trans_450.png',
                        height: 74,
                        fit: BoxFit.contain,
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        '오늘의 학습을 차분하게 시작해요',
                        style:
                            TextStyle(color: Color(0xFFD5E5DF), fontSize: 15),
                      ),
                      const SizedBox(height: 34),
                      Container(
                        width: double.infinity,
                        constraints: const BoxConstraints(maxWidth: 440),
                        padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x33000000),
                              blurRadius: 20,
                              offset: Offset(0, 10),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const Text(
                              '로그인',
                              style: TextStyle(
                                color: BLACK21,
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              '계정 정보로 로그인해 주세요.',
                              style: TextStyle(color: BLACK77, fontSize: 14),
                            ),
                            const SizedBox(height: 24),
                            TextField(
                              keyboardType: TextInputType.text,
                              textInputAction: TextInputAction.next,
                              controller: useridController,
                              decoration: _inputDecoration(
                                  label: '아이디', icon: Icons.person_outline),
                            ),
                            const SizedBox(height: 12),
                            TextField(
                              obscureText: _obscureText,
                              textInputAction: TextInputAction.done,
                              controller: userpwController,
                              onSubmitted: (_) {
                                if (_stateVersionConfirm) _login();
                              },
                              decoration: _inputDecoration(
                                label: '비밀번호',
                                icon: Icons.lock_outline,
                                suffixIcon: IconButton(
                                  icon: Icon(_iconVisible,
                                      color: BLACK77, size: 21),
                                  tooltip:
                                      _obscureText ? '비밀번호 표시' : '비밀번호 숨기기',
                                  onPressed: _toggleObscureText,
                                ),
                              ),
                            ),
                            Align(
                              alignment: Alignment.centerRight,
                              child: TextButton(
                                onPressed: () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => FindpwPage()),
                                ),
                                style: TextButton.styleFrom(
                                  foregroundColor: TTOK_GREEN,
                                  padding: const EdgeInsets.only(
                                      top: 10, bottom: 10),
                                ),
                                child: const Text('비밀번호를 잊으셨나요?'),
                              ),
                            ),
                            const SizedBox(height: 8),
                            SizedBox(
                              height: 54,
                              child: ElevatedButton(
                                onPressed: _stateVersionConfirm ? _login : null,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: TTOK_YELLOW,
                                  disabledBackgroundColor:
                                      BUTTON_DISABLED_COLOR,
                                  foregroundColor: BLACK21,
                                  disabledForegroundColor:
                                      BUTTON_DISABLED_TEXT_COLOR,
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                ),
                                child: const Text(
                                  '로그인',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text('처음 이용하시나요?',
                                    style: TextStyle(color: BLACK77)),
                                TextButton(
                                  onPressed: () => Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => SignupPage()),
                                  ),
                                  style: TextButton.styleFrom(
                                    foregroundColor: TTOK_GREEN,
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8),
                                  ),
                                  child: const Text('회원등록'),
                                ),
                                const Text('·',
                                    style: TextStyle(color: BLACK77)),
                                TextButton(
                                  onPressed: () => Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => FindidPage()),
                                  ),
                                  style: TextButton.styleFrom(
                                    foregroundColor: TTOK_GREEN,
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8),
                                  ),
                                  child: const Text('아이디 찾기'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      const SizedBox(height: 28),
                      const Text(
                        '문의  031.759.7700',
                        style: TextStyle(
                            color: TTOK_YELLOW,
                            fontSize: 16,
                            fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Ver $APP_VERSION',
                        style: const TextStyle(
                            color: Color(0xFFD5E5DF), fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
