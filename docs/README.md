# 똑쌤 Node.js 관리자 시스템 프로젝트 문서 (ttokssaem_nodejs_admin)

이 문서는 똑쌤 Node.js 관리자 시스템의 아키텍처, 디렉토리 구조, 개발 설정 및 구동 방법을 정리한 문서입니다. 재접속 시 개발 및 유지보수를 수월하게 진행할 수 있도록 돕기 위해 작성되었습니다.

---

## 1. 프로젝트 개요 (Overview)
본 프로젝트는 **똑쌤 서비스의 백엔드 관리 시스템**입니다. Node.js Express 프레임워크를 기반으로 하며, MySQL 데이터베이스와 Redis 캐시/세션, EJS 템플릿 엔진을 활용하여 관리자 기능 및 API 서비스를 제공합니다.

## 2. 주요 기술 스택 (Tech Stack)
* **Backend Framework**: Node.js Express (`~4.16.1`)
* **Database**: MySQL 2 (`mysql2` 패키, `mybatis-mapper`를 통한 XML 기반 SQL 쿼리 관리)
* **Session & Cache**: Redis (`redis`, `connect-redis`, `express-session` 기반 세션 관리)
* **View Engine**: EJS (`~2.6.1`, `/views` 디렉토리의 화면 템플릿 렌더링)
* **Logging**: Winston (`winston`) & Morgan (`morgan`)을 조합하여 커스텀 로그 관리 및 순환 파일 로깅 (`rotating-file-stream`) 지원
* **Scheduling**: `cron-cluster` 패키지를 이용한 분산 환경/단일 환경 배치 작업 스케줄링
* **Authentication**: JWT (`jsonwebtoken`, `rand-token`) 기반 API 토큰 인증

---

## 3. 디렉토리 가이드 문서 목록
재접속 후 필요한 작업 영역에 맞는 세부 문서를 확인하세요.

1. **[시작하기 & 배포 가이드 (getting_started.md)](./getting_started.md)**
   * 로컬 개발 환경 실행 방법 (`npm run dev`)
   * 환경 변수 구성 (`.env` 파일 설명)
   * 운영 서버 설치/배포 명령어 (Node.js, Git, PM2, Nginx 등)
2. **[프로젝트 아키텍처 및 흐름 (architecture.md)](./architecture.md)**
   * 디렉토리 및 파일 상세 구조 설명
   * Request-Response 데이터 흐름 설명 (Router ➡️ Service ➡️ MyBatis XML ➡️ MysqlConn ➡️ Response)
3. **[핵심 공통 모듈 가이드 (modules.md)](./modules.md)**
   * 데이터베이스 실행기 (`common/MysqlConn.js`) 사용법
   * JWT 토큰 및 미들웨어 (`common/Jwt.js`, `common/JwtAuth.js`)
   * 표준 응답 포맷 모듈 (`common/Response.js`)

---

*참고: 본 `docs` 폴더 내의 모든 문서들은 코드를 수정하지 않고 오직 프로젝트 이해를 돕기 위한 분석 자료로만 제공됩니다.*
