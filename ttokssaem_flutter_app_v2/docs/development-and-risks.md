# 개발·운영 점검

## 개발 환경과 명령

```bash
flutter pub get
flutter analyze
flutter test
flutter run
```

- 언어 제약: Dart `>=2.17.3 <3.0.0`
- 주요 패키지: `flutter_bloc`, `dio`, Firebase Core/Messaging, `flutter_local_notifications`, `flutter_secure_storage`
- Android: Kotlin DSL(`android/app/build.gradle.kts`), Java 11, Firebase Google Services 플러그인
- 플랫폼 폴더: Android, iOS, Linux, macOS, Web, Windows가 존재하지만 앱 기능에는 Android/iOS 특화 코드가 포함된다.

Android release 빌드는 `android/key.properties`에 서명 키 설정이 있어야 한다. 이 파일 또는 키스토어를 저장소에 새로 추가하지 않는다. Firebase 설정도 플랫폼별 비밀 관리 정책에 따라 점검한다.

## 테스트 현황

`test/widget_test.dart`는 Flutter 기본 Counter 예제를 그대로 참조한다. 현재 앱의 시작점은 Firebase 초기화와 로그인 화면이므로 이 테스트는 실제 UI와 일치하지 않아 유지보수 대상이다. 우선 로그인 역할 분기, 토큰 헤더 처리, 학부모 대상 선택, 핵심 BLoC 성공/실패 상태를 테스트로 교체하는 것이 좋다.

## 확인된 개선 우선순위

| 우선순위 | 관찰 내용 | 권장 조치 |
| --- | --- | --- |
| 운영 유지 | NEIS API 키가 `ApiProvider.neis()` URL 문자열에 포함되어 있다. | 학교 검색 기능의 현재 동작 전제이므로 유지한다. 값을 변경·삭제하기 전에는 NEIS 학교 검색과 배포 환경 영향을 반드시 확인한다. |
| 높음 | 디버그 로그가 액세스 토큰·요청 데이터를 출력한다. | 인증 정보와 개인정보를 마스킹하고 릴리스/로그 수집 경로를 점검한다. |
| 높음 | 인증·역할·선택 학생이 mutable 전역 변수에 있다. | 인증 상태 저장소와 앱 상태 계층으로 이전하고, 로그아웃·토큰 만료 흐름을 명확히 한다. |
| 중간 | `pubspec.yaml`의 Dart 상한은 3 미만이지만 lockfile에는 최신 Flutter SDK 제약 패키지가 보인다. | 실제 CI/개발 Flutter 버전을 고정하고 SDK·의존성 호환성을 검증한다. |
| 중간 | `ApiProvider`가 HTTP, 응답 코드, 모델 변환을 한 클래스에 모두 둔다. | Dio 설정/인터셉터, API 리포지터리, 오류 타입을 분리해 테스트 가능성을 높인다. |
| 중간 | 학생/학부모 탭 컨테이너 코드가 거의 중복된다. | 공통 탭 셸을 추출하고 역할별 페이지 목록만 주입한다. |
| 낮음 | `MaterialApp.title`이 `Flutter Demo`이며 기본 README도 남아 있다. | 실제 제품명과 프로젝트 안내로 교체한다. |

## 변경 시 주의점

- `main.dart`에 전역 BLoC이 모여 있으므로 기능 BLoC 추가·제거 시 provider 등록도 함께 확인한다.
- 인증 API를 수정하면 로그인, 자동 입력, `ACCESSTOKEN` 헤더, 토큰 만료 처리까지 함께 회귀 확인한다.
- 학부모 화면은 `TARGETID`가 비어 있을 때 첫 연결 학생을 기본 선택한다. 대상 전환 후 모든 탭의 재조회 여부를 확인한다.
- 푸시 기능 변경 시 Android 포그라운드 알림과 iOS 권한·백그라운드 수신을 모두 실기기에서 확인한다.
