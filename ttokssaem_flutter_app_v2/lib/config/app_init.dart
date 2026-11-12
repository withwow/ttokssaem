import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:package_info_plus/package_info_plus.dart';

import 'package:ttokssaem_flutter_app/config/constant.dart';
import 'package:ttokssaem_flutter_app/firebase_options.dart';

/// 앱 시작 시 필요한 초기화(버전 정보, Firebase, 로컬 알림)를 담당한다.
///
/// 이전에는 이 작업들이 모두 끝나야 runApp()이 호출되어, 하나라도 실패하거나
/// 지연되면(예: iOS 알림 권한 팝업 대기, Firebase 초기화 지연) 첫 화면이
/// 그려지지 않고 검은 화면에 머물렀다. 이제 runApp()을 먼저 호출하고, 스플래시
/// 화면이 이 초기화를 제한 시간 안에서만 기다린다. 실패해도 앱은 계속 진행한다.
class AppInit {
  AppInit._();

  static Future<void>? _future;

  static const AndroidNotificationChannel channel = AndroidNotificationChannel(
    'Default', // id
    'Default Channel', // title
    description: 'This channel is default.', // description
    importance: Importance.high,
  );

  static final FlutterLocalNotificationsPlugin localNotifications =
      FlutterLocalNotificationsPlugin();

  /// 초기화는 한 번만 실행된다. 여러 번 호출해도 같은 Future를 돌려준다.
  static Future<void> run() => _future ??= _run();

  /// 스플래시에서 사용: 초기화를 최대 [timeout]까지만 기다린다.
  /// 시간이 지나도 초기화는 백그라운드에서 계속 진행된다.
  static Future<void> waitAtMost(Duration timeout) async {
    try {
      await run().timeout(timeout);
    } catch (e) {
      _log('AppInit wait ended early: $e');
    }
  }

  static Future<void> _run() async {
    await _guard('version', _loadVersion);
    final firebaseReady = await _guard('firebase', _initFirebase);
    await _guard('local notifications', _initLocalNotifications);
    if (firebaseReady) {
      _listenForegroundMessages();
      unawaited(_guard('push token', _loadPushToken));
    }
    // 권한 팝업은 기다리지 않는다. 화면은 이미 그려진 상태에서 팝업만 뜬다.
    unawaited(_guard('notification permission', _requestIosPermission));
  }

  static Future<void> _loadVersion() async {
    final packageInfo = await PackageInfo.fromPlatform();
    APP_VERSION = packageInfo.version;
  }

  static Future<void> _initFirebase() async {
    await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
    await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
      alert: true,
      badge: true,
      sound: true,
    );
  }

  static Future<void> _initLocalNotifications() async {
    await localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(channel);

    const initializationSettings = InitializationSettings(
      android: AndroidInitializationSettings('@mipmap/ic_launcher'),
      // 권한 요청은 initialize()에서 하지 않는다. initialize()가 사용자 응답을
      // 기다리게 되어 시작이 멈출 수 있기 때문이다. 아래에서 따로 요청한다.
      iOS: DarwinInitializationSettings(
        requestSoundPermission: false,
        requestBadgePermission: false,
        requestAlertPermission: false,
      ),
    );

    await localNotifications.initialize(initializationSettings);
  }

  static Future<void> _requestIosPermission() async {
    await localNotifications
        .resolvePlatformSpecificImplementation<
            IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(alert: true, badge: true, sound: true);
  }

  static Future<void> _loadPushToken() async {
    PUSHTOKEN = await FirebaseMessaging.instance.getToken();
    if (kDebugMode) {
      print("PUSHTOKEN : ${PUSHTOKEN ?? 'token NULL!'}");
    }
  }

  static void _listenForegroundMessages() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      final notification = message.notification;
      if (notification == null) return;
      final details = NotificationDetails(
        android: AndroidNotificationDetails(
          channel.id,
          channel.name,
          channelDescription: channel.description,
        ),
        iOS: const DarwinNotificationDetails(),
      );
      try {
        await localNotifications.show(
          notification.hashCode,
          notification.title,
          notification.body,
          details,
        );
      } catch (e) {
        _log('show notification failed: $e');
      }
    });

    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      if (kDebugMode) {
        print(message);
      }
    });
  }

  /// 단계별 실패를 삼켜서 다음 단계와 앱 진행이 막히지 않게 한다.
  static Future<bool> _guard(String step, Future<void> Function() body) async {
    try {
      await body();
      return true;
    } catch (e, s) {
      _log('AppInit [$step] failed: $e\n$s');
      return false;
    }
  }

  static void _log(String message) {
    // 릴리즈에서도 logcat/콘솔에서 확인할 수 있도록 debugPrint 사용
    debugPrint(message);
  }
}

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  if (kDebugMode) {
    print('Handling a background message ${message.messageId}');
  }
}
