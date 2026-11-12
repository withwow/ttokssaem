import 'package:flutter/material.dart';

import 'package:ttokssaem_flutter_app/config/app_init.dart';
import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/ui/login.dart';

class SplashScreenPage extends StatefulWidget {
  @override
  _SplashScreenPageState createState() => _SplashScreenPageState();
}

class _SplashScreenPageState extends State<SplashScreenPage> {
  // 스플래시 최소 표시 시간
  static const Duration _minDisplay = Duration(seconds: 2);
  // 초기화(Firebase, 알림 등)를 기다리는 최대 시간. 넘으면 그냥 진행한다.
  static const Duration _maxInitWait = Duration(seconds: 6);

  bool _navigated = false;

  Future<void> _start() async {
    await Future.wait([
      Future.delayed(_minDisplay),
      AppInit.waitAtMost(_maxInitWait),
    ]);
    _goToLogin();
  }

  void _goToLogin() {
    if (!mounted || _navigated) return;
    _navigated = true;
    Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => LoginPage()),
        (Route<dynamic> route) => false);
  }

  @override
  void initState() {
    super.initState();
    _start();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: WillPopScope(
      onWillPop: () {
        return Future.value(false);
      },
      child: Container(
        color: TTOK_GREEN,
        child: Align(
          // The underline makes a mathematically centered logo look low.
          // Shift it slightly upward for an optical center.
          alignment: Alignment(0, -0.06),
          child: Image.asset('assets/images/logo_banner_trans_450.png',
              height: 126),
        ),
      ),
    ));
  }
}
