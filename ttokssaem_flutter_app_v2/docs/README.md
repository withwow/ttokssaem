# 똑쌤 Flutter 앱 문서

이 문서는 `ttokssaem_flutter_app` 저장소를 2026-10-16 기준으로 코드 분석해 정리한 것이다. 앱은 학생과 학부모가 학습 계획, 단어장, 1:1 문의, 알림을 이용하는 Flutter 모바일 앱이다.

## 문서 목록

| 문서 | 내용 |
| --- | --- |
| [아키텍처](architecture.md) | 시작 흐름, 디렉터리 책임, 상태·네트워크·인증 구조 |
| [기능 및 API](features-and-api.md) | 역할별 화면, 기능 흐름, 서버 API 목록 |
| [개발·운영 점검](development-and-risks.md) | 실행 방법, 플랫폼 설정, 확인된 개선 우선순위 |

## 빠른 시작

```bash
flutter pub get
flutter run
```

`pubspec.yaml`의 앱 버전은 `1.11.0+1110`이며 Dart SDK 제약은 `>=2.17.3 <3.0.0`이다. Firebase 설정 파일과 로컬 Android 서명 키가 갖춰진 환경에서 실행·배포해야 한다. 자세한 사항은 [개발·운영 점검](development-and-risks.md)을 참고한다.

## 한눈에 보기

- 앱 진입점: `lib/main.dart`
- 최초 화면: `SplashScreenPage` → `LoginPage`
- 역할 분기: 로그인 응답의 `type`이 `S`이면 학생, 그 외에는 학부모 홈
- 상태 관리: `flutter_bloc`의 이벤트·상태·Bloc 3파일 묶음
- 백엔드: `https://api.ttokssaem.com/api/...`
- 외부 연동: Firebase Messaging/로컬 알림, NEIS 학교 검색, Android 설치 앱 검사
