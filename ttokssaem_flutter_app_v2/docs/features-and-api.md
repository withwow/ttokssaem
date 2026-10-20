# 기능 및 API

기본 서버 주소는 `https://api.ttokssaem.com`이며 엔드포인트 상수는 `lib/config/api.dart`에 있다. 응답의 `code == 0`을 성공으로 해석하고, 그 외 코드는 `ApiProvider.ThrowError()`에서 사용자 메시지로 변환한다.

## 사용자 기능

| 영역 | 관련 화면 | 주요 BLoC/API |
| --- | --- | --- |
| 앱 버전·강제 업데이트 | 로그인 | `VersionBloc` / `/api/v1/version` |
| 로그인·인증 | 로그인 | `LoginBloc`, `AuthcheckBloc` / `/login`, `/authcheck` |
| 회원 | 가입, ID/PW 찾기, 정보·비밀번호 수정, 탈퇴 | `JoinMember`, `Findid`, `Findpw`, `CheckMemberId`, `MemberInfo`, `Update*`, `Withdraw` |
| 학습 계획 | 홈, 오늘 계획, 지난 계획, 상세 계획 | `TodayStudyPlanList`, `RegStudyPlanList`, `AchiveStudyPlanList`, `DashboardStudyPlan`, `StudyPlanList` |
| 학부모-학생 연결 | 학부모 홈, 연결 요청 | `SelStudentList`, `RequestM2M`, `M2mList`, `UpdateM2M` |
| 단어장 | 단어 시험/풀이/메모/이력 | `RequestVocaTest`, `FinishVocaTest`, `SelVoca*List` |
| 공지·알림 | 홈, 알림 | `TodayNoticeList`, `NoticeList`, Firebase Messaging |
| 앱 사용 검사 | 로그인(Android) | `AppChecker` 및 로컬 `device_apps` 플러그인 |

## 역할별 차이

| 역할 | 홈의 핵심 동작 |
| --- | --- |
| 학생 (`TYPE == 'S'`) | 자신의 오늘 계획·공지·학습 이력을 조회하고 단어 시험을 진행한다. Android에서는 로그인 직후 설치 앱 검사 흐름을 거친다. |
| 학부모 | 연결된 학생 목록을 조회하고 `TARGETID`로 대상을 선택한다. 학생별 오늘/지난 계획과 단어장 이력을 조회한다. |

## API 그룹

| 그룹 | 엔드포인트 |
| --- | --- |
| 계정 | `findID`, `findPW`, `checkMemberID`, `joinMember`, `login`, `authcheck`, `memberInfo`, `updatePush`, `updateMemberInfo`, `updatePassword`, `withdraw` |
| 공지·계획 | `selNoticeList`, `todayNoticeList`, `todayStudyPlanList`, `regStudyPlanList`, `achiveStudyPlanList`, `dashboardStudyPlan`, `studyPlanList` |
| 학부모 연결 | `selStudentList`, `requestM2M`, `selM2MList`, `updateM2M` |
| 단어장 | `requestVocaTest`, `finishVocaTest`, `selVocaMemoList`, `selVocaTestList`, `selVocaSolveList`, `selVocaHistList` |
| 기타 | `version`, `appchecker`, NEIS `schoolInfo` |

대부분의 똑쌤 API는 JSON POST이며 인증 API는 `accesstoken` 헤더를 요구한다. NEIS 학교 검색은 GET을 사용한다. 각 API의 요청 필드와 정확한 응답 모델은 `ApiProvider`의 개별 메서드 및 대응하는 `lib/model/*_model.dart`를 기준으로 확인한다.

## 푸시 알림

Firebase 초기화 후 FCM 토큰을 가져와 로그인 요청에 포함한다. 포그라운드 메시지는 Android 알림 채널 `Default`를 통해 로컬 알림으로 표시한다. iOS는 원격 알림 백그라운드 모드가 `Info.plist`에 등록되어 있다.
