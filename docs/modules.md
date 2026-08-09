# 핵심 공통 모듈 가이드 (Core Modules Guide)

이 문서는 프로젝트 내의 공통 유틸리티 모듈들의 구조와 사용법에 대해 설명합니다.

---

## 1. 데이터베이스 커넥션 풀 & 쿼리 생성기 (`common/MysqlConn.js`)

`mybatis-mapper`를 초기화하고 MySQL 데이터베이스 커넥션을 관리하는 코어 모듈입니다.

### 주요 속성 및 메서드
* **`pool`**: `mysql2/promise` 기반의 커넥션 풀입니다. 비동기(`async/await`) 방식으로 커넥션을 획득하여 쿼리를 수행할 수 있습니다.
* **`MAKESQL(namespace, id, param, _sqlformat)`**: XML 파일로 작성된 MyBatis 쿼리를 Javascript 파라미터와 맵핑하여 실행 가능한 SQL 문자열로 변환합니다. 변환된 SQL 쿼리는 자동으로 디버그 로그에 출력됩니다.

### 사용 예시 (Service 레이어 내부)
```javascript
const MysqlConn = require('../common/MysqlConn');

async function getBranchInfo(branchId) {
    const param = { branchid: branchId };
    
    // xml/branch.xml 파일의 namespace="branch", id="selBranch" 쿼리를 생성
    const sql = MysqlConn.MAKESQL('branch', 'selBranch', param, { language: 'sql', indent: '  ' });
    
    let connection = null;
    try {
        // 커넥션 풀로부터 커넥션 획득
        connection = await MysqlConn.pool.getConnection(async conn => conn);
        const [rows] = await connection.query(sql); // 쿼리 실행
        return rows[0];
    } catch (err) {
        _logger.error(err.stack);
        throw err;
    } finally {
        if (connection) {
            connection.release(); // 커넥션 반납
        }
    }
}
```

---

## 2. API 표준 응답 포맷 모듈 (`common/Response.js` & `common/Code.js`)

클라이언트에 규격화된 포맷으로 REST API 결과를 응답할 수 있도록 포맷팅하는 모듈입니다.

### `common/Code.js` (상태 코드 정의)
`enum` 패키지를 이용해 내부 API 결과 상태 코드를 관리합니다.
* `Code.Api.OK.value` (`0`): 정상 처리
* `Code.Api.DB_ERROR.value` (`100`): 데이터베이스 에러
* `Code.Api.SESSION_TIMEOUT.value` (`999`): 세션 만료

### `common/Response.js` (응답 데이터 매핑)
생성자 파라미터로 명령 경로, 결과 코드, 전달할 데이터, 타이머 객체를 받아 JSON 응답을 빌드합니다.

### 사용 예시
```javascript
const Response = require('../common/Response');
const Code = require('../common/Code');
const ElapsedTimer = require('../common/ElapsedTimer');

app.post('/v1/example', (req, res) => {
    const t = new ElapsedTimer();
    const cmd = '/v1/example';
    
    try {
        const data = { message: "success" };
        res.json(new Response(cmd, Code.Api.OK.value, data, t).build());
    } catch (err) {
        res.json(new Response(cmd, Code.Api.DB_ERROR.value, {}, t).build());
    }
});
```

---

## 3. JWT 인증 모듈 (`common/Jwt.js` & `common/JwtAuth.js`)

JSON Web Token을 이용한 로그인 토큰 발행 및 토큰 유효성 검증을 담당하는 미들웨어 모듈입니다.

### `common/Jwt.js`
* **`sign(user)`**: 사용자의 기본 정보(id, email 등)를 페이로드에 담아 액세스 토큰을 암호화하여 발급합니다.
* **`verify(token)`**: 전달받은 토큰이 정상적으로 서명되었는지, 유효기간이 지나지는 않았는지 해독 및 검증합니다.

### `common/JwtAuth.js` (미들웨어)
HTTP 요청 헤더에 있는 `accesstoken` 값을 확인하고 해독하여, 유효한 토큰일 경우 `req.body.userid = user.id`와 같이 사용자 ID를 설정해준 뒤 다음 라우터로 넘겨주고, 유효하지 않으면 즉시 에러 응답 패킷을 클라이언트에 전송합니다.

### 사용 예시 (라우터에 미들웨어 등록)
```javascript
const JwtAuth = require('../common/JwtAuth');

// API 엔드포인트에 JwtAuth.checkToken 미들웨어를 두 번째 인자로 전달하여 보호
app.post('/v1/secure-api', JwtAuth.checkToken, function (req, res) {
    // JwtAuth.checkToken에서 검증이 완료된 경우 req.body.userid에 사용자 ID가 설정됨
    const loginUser = req.body.userid;
    ...
});
```

---

## 4. 공통 유틸리티 (`common/MyUtil.js`)
* **`RemoteIp(req)`**: 프록시 환경(AWS Nginx 로드밸런서 등)을 고려하여 클라이언트의 실제 IP 주소를 추출합니다. (`x-forwarded-for` 또는 `remoteAddress`에서 포트 제외하고 리턴)
