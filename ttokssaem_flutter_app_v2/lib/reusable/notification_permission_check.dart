import 'package:app_settings/app_settings.dart';
import 'package:flutter/cupertino.dart';

import 'package:ttokssaem_flutter_app/config/app_init.dart';

/// 로그인 전에 앱 알림이 꺼져 있는지 확인하고, 꺼져 있으면 안내창을 띄워
/// 앱 알림 설정 화면으로 보낸다. 앱 실행 중 한 번만 안내한다.
class NotificationPermissionCheck {
  NotificationPermissionCheck._();

  static bool _shown = false;

  static Future<void> run(BuildContext context) async {
    if (_shown) return;

    // 첫 실행이면 시스템 권한 팝업에 사용자가 응답할 때까지 기다린다.
    await AppInit.permissionRequest;
    if (await AppInit.notificationsEnabled()) return;
    if (!context.mounted || _shown) return;
    _shown = true;

    await showCupertinoDialog<void>(
      context: context,
      builder: (BuildContext dialogContext) => CupertinoAlertDialog(
        title: const Text('알림이 꺼져 있습니다'),
        content: const Text(
            '알림이 꺼져 있으면 공지, 학습계획 등 중요한 알림을 받을 수 없습니다.\n설정에서 알림을 켜 주세요.'),
        actions: <CupertinoDialogAction>[
          CupertinoDialogAction(
            child: const Text('나중에'),
            onPressed: () => Navigator.pop(dialogContext),
          ),
          CupertinoDialogAction(
            isDefaultAction: true,
            child: const Text('설정으로 이동'),
            onPressed: () {
              Navigator.pop(dialogContext);
              AppSettings.openAppSettings(type: AppSettingsType.notification);
            },
          ),
        ],
      ),
    );
  }
}
