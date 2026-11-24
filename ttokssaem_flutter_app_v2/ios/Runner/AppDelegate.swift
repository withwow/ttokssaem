import Flutter
import UIKit
import firebase_messaging

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    // UIScene 앱은 플러그인이 didFinishLaunching 이후에 등록되므로, 알림 센터 delegate를
    // 여기서 미리 설정해야 iOS에서 푸시가 표시되고 탭 이벤트가 전달된다.
    FLTFirebaseMessagingPlugin.configureNotificationCenterDelegate()
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // iOS 27부터 UIScene 생명주기가 필수. 엔진은 FlutterSceneDelegate가 만들고,
  // 플러그인은 엔진이 준비되면 여기서 등록한다.
  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
  }
}
