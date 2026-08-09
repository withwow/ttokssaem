# 프로젝트 아키텍처 및 흐름 (Architecture & Flow)

이 문서는 똑쌤 Node.js 관리자 시스템의 전체 디렉토리 구조와 API 요청 처리 흐름을 분석하고 설명합니다.

---

## 1. 디렉토리 및 파일 상세 구조 (Directory Structure)

프로젝트의 전체 디렉토리는 기능별로 명확하게 분리되어 있습니다.

```
ttokssaem_nodejs_admin/
├── bin/
│   └── www             # 애플리케이션 시작점 (HTTP 서버 생성 및 포트 리스닝)
├── app.js              # Express 애플리케이션 설정 (미들웨어, 세션, 뷰엔진, 라우터 허브)
├── config/             # DB, Redis, 로깅, JWT 등 인프라 설정 파일
│   ├── mysql.js        # MySQL 연결 정보
│   ├── redis.js        # Redis 연결 정보
│   ├── session.js      # Redis 세션 저장소 설정
│   ├── winston.js      # 파일 순환 및 콘솔 로깅 설정
│   ├── morgan.js       # HTTP 요청 로깅 설정
│   └── jwtconfig.js    # JWT 시크릿키 및 옵션
├── common/             # 프로젝트 공통 유틸리티 모듈 (DB 래퍼, JWT 인증, API 공통 응답 포맷 등)
│   ├── MysqlConn.js    # MyBatis XML 매퍼 등록 및 MySQL 커넥션 풀 관리
│   ├── Response.js     # 표준 API 응답 객체 생성기
│   ├── Code.js         # 응답 상태 코드(Enum)
│   ├── Jwt.js          # JWT 토큰 관리
│   ├── JwtAuth.js      # JWT 인증용 Express 미들웨어
│   └── MyUtil.js       # 기타 유틸리티 함수
├── routes/             # 라우팅 레이어
│   ├── *api.js         # RESTful API 엔드포인트 파일 (예: branchapi.js)
│   └── *.js            # HTML EJS 뷰 페이지 렌더링 파일 (예: branch.js)
├── services/           # 비즈니스 로직 레이어 (SQL 매핑 호출, 트랜잭션 처리, 응답 전송)
│   └── Svc*.js         # 기능별 서비스 클래스 (예: SvcBranch.js)
├── xml/                # MyBatis Mapper XML 파일 (모든 SQL 쿼리를 독립적으로 관리)
│   └── *.xml           # 기능별 SQL 쿼리 매퍼 (예: branch.xml)
├── views/              # EJS 뷰 템플릿 (어드민 UI 화면 구조)
├── public/             # 정적 리소스 (Javascript, CSS, Images)
├── cron/               # 백그라운드 스케줄러 (배치 작업 등)
│   └── cronJob.js
└── doc/                # 배포 가이드 및 인프라 기초 정보 (init.txt, system.txt, 엑셀 스케줄 등)
```

---

## 2. API 요청 처리 흐름 (Request-Response Lifecycle)

이 프로젝트는 **Route ➡️ Service ➡️ MyBatis XML ➡️ Service (DB Query) ➡️ Response**의 흐름으로 데이터를 처리합니다.
지점 목록 조회 (`/v1/selBranchList`) 기능을 예시로 흐름을 살펴보겠습니다.

### Step 1. Route 단계 (`routes/branchapi.js`)
사용자의 HTTP API 요청을 받아 적절한 서비스 객체를 생성하고 처리 메서드를 호출합니다.
```javascript
app.get('/v1/selBranchList', function (req, res) {
    let cmd = '/v1/selBranchList';
    var t = new ElapsedTimer(); // API 소요 시간 측정을 위한 타이머

    // Request의 query/body 매개변수와 req, res, 타이머를 서비스 클래스에 전달하며 인스턴스화
    let svc = new SvcBranch(cmd, req.query, req, res, t);
    svc.selBranchList(); // 서비스 메서드 호출
});
```

### Step 2. Service 단계: SQL 획득 (`services/SvcBranch.js`)
전달받은 요청 매개변수를 전처리하고 MyBatis XML Mapper를 통해 SQL 쿼리를 생성합니다.
```javascript
// MyBatis Mapper ID에 맞춰 SQL 쿼리 문자열을 생성
var sqltotcnt = MysqlConn.MAKESQL('branch', 'totCntBranch', param, _SqlFormat);
var sql = MysqlConn.MAKESQL('branch', 'selBranchList', param, _SqlFormat);
```

### Step 3. Mapper XML 단계 (`xml/branch.xml`)
동적 태그(`<if>`, `<where>`, `<trim>` 등)를 해석하여 최종 SQL 질의문을 컴파일합니다.
```xml
<mapper namespace="branch"> 
  <select id="selBranchList">
    SELECT * FROM ttokssaemdb.branch branch
    <where>
      <if test="query != undefined and query !=''">    
        AND branch.branchname LIKE #{likeQuery}
      </if> 
    </where>                 
    ...
  </select>
</mapper>
```

### Step 4. Service 단계: DB 쿼리 실행 (`services/SvcBranch.js`)
MySQL 커넥션을 풀에서 획득해 가져오고 쿼리를 실행한 후, 결과 데이터나 트랜잭션을 처리합니다.
```javascript
connection = await MysqlConn.pool.getConnection(async conn => conn);

let totcntrs = await connection.query(sqltotcnt); // 전체 행 수 조회
let rs = await connection.query(sql); // 실제 데이터 목록 조회
resdata.lists = rs[0];

connection.release(); // 커넥션 반납
```

### Step 5. Response 단계 (`services/SvcBranch.js` & `common/Response.js`)
결과를 표준화된 JSON 형식 패킷으로 구성하여 클라이언트에 최종 전송합니다.
```javascript
// SvcBranch.js 내부에서 호출
this._res.json(new Response(this._cmd, code, resdata, this._t).build());
```
이때 응답 데이터는 다음과 같은 JSON 규격을 따릅니다.
```json
{
  "cmd": "/v1/selBranchList",
  "code": 0,
  "data": {
    "draw": 1,
    "totcnt": 15,
    "lists": [...]
  }
}
```

---

## 3. 세션 및 권한 체크 방식 (`routes/` 내 컨트롤러)
* 뷰 페이지(`/branch`, `/member` 등) 렌더링 시에는 `services/SvcSession.js`를 사용해 사용자의 세션 정보 및 메뉴 권한을 검증합니다.
* 비로그인 상태일 경우 `res.redirect('/login')` 처리를 수행합니다.
