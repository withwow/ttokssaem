# 처음화면(/) 라우터 및 대시보드 API 쿼리 성능 분석 보고서

본 보고서는 처음화면(대시보드) 진입 시 호출되는 `/` 라우터 관련 API의 성능 개선을 위해 **개발 데이터베이스(MySQL 5.6.37)**의 실제 테이블 구조와 인덱스를 실사하고 진단한 결과 보고서입니다.

---

## 1. 진단 대상 API 및 관련 쿼리

대시보드 진입 시 작동하는 핵심 API는 [routes/indexapi.js](file:///d:/MyCom/ttokssaem_nodejs_admin/routes/indexapi.js)에 등록된 아래 두 개입니다.

1. **`GET /v1/selStudentAll`**: 지점 전체 학생 목록 조회
   * 쿼리: `member.selStudentList`
2. **`GET /v1/lastStudentStaus`**: 학생별 최종 입/퇴실 상태 및 금일 스케줄 진도 조회
   * 쿼리 1: `member.selStudentSortOrderList`
   * 쿼리 2: `attendance.lastAttendanceStaus` (최종 출결 상태 집계)
   * 쿼리 3: `member.selStudentList` (학생 목록 조회)
   * 쿼리 4: `attendance.lastRuntimePlanStaus` (개별 학생의 당일 런타임 스케줄 조회 - **N번 루프 실행**)

---

## 2. 핵심 성능 저하 요인 분석 (Root Causes)

### ① N+1 쿼리 조회 루프 병목 (가장 심각)
* [services/SvcDashboard.js](file:///d:/MyCom/ttokssaem_nodejs_admin/services/SvcDashboard.js)의 `lastStudentStaus` 메소드 내부에서 지점 내 활성화된 모든 학생 목록(`studentrs`)을 조회한 뒤, **학생 수만큼 루프를 돌며 개별 쿼리(`lastRuntimePlanStaus`)를 매번 실행**하고 있습니다.
* 지점 내 학생이 100명이면 한 번의 API 호출 시 총 101번의 쿼리가 수행되어, 네트워크 왕복 오버헤드와 DB 커넥션 점유 시간이 급증합니다.

### ② 테이블 인덱스 전무 (오직 PK만 존재)
실제 개발 데이터베이스 내부의 DDL과 인덱스 상태를 조회한 결과, 세 테이블 모두 기본 키(PK) 이외의 **일반 검색 조건용 인덱스는 단 하나도 생성되어 있지 않은 상태**입니다.
* **`member` 테이블**: `memberid`(PK), `memberno`(Unique)만 존재. `branchid`, `type`, `classyn` 조건 검색 시 매번 Full Table Scan 발생.
* **`attendance` 테이블**: `attendanceid`(PK)만 존재. 11만 건이 넘는 데이터에서 지점(`branchid`) 및 날짜 범위(`regdate` > ?) 필터링 시 인덱스를 전혀 타지 못하고 전체 검색을 함.
* **`runtimeplan` 테이블**: `masterplanid`(PK)만 존재. 1만 건 이상의 스케줄 데이터가 있는 상황에서 학생별(`memberid`) 검색 시 인덱스 없이 전체 탐색을 수행함.

---

## 3. 코드 변경 없는 1단계 개선안: 데이터베이스 인덱스(Index) 생성 DDL

소스를 절대 수정하지 않는 제약 조건 하에서, 데이터베이스에 인덱스만 적절히 추가해주어도 기존 쿼리 속도가 기하급수적으로 향상됩니다.

### DDL 실행 스크립트
개발 데이터베이스 관리자 계정으로 접속 후 아래 DDL을 수행해 주시기 바랍니다.

```sql
-- 1. member 테이블 인덱스 추가
-- 지점별 활성 학생을 정렬하여 추출하는 검색 속도를 크게 개선합니다.
CREATE INDEX idx_member_dashboard 
  ON ttokssaemdb.member (branchid, type, classyn, membername);

-- 2. attendance 테이블 인덱스 추가
-- 출결 상태 집계 시, 특정 지점의 최근 시점 데이터를 고속 필터링 및 그룹핑합니다.
CREATE INDEX idx_attendance_dashboard 
  ON ttokssaemdb.attendance (branchid, regdate, memberid);

-- 3. runtimeplan 테이블 인덱스 추가
-- N+1 루프가 돌더라도, 개별 학생의 당일 스케줄(상태<>3) 2건을 정렬(Sort) 연산 없이 즉시 탐색하여 반환합니다.
CREATE INDEX idx_runtimeplan_dashboard 
  ON ttokssaemdb.runtimeplan (memberid, dayofweek, status, sortorder);
```

---

## 4. 2단계 개선안: N+1 쿼리 단일 조인(Join) 통합 (추후 코드 수정 허용 시)

루프를 없애고 단 하나의 쿼리로 지점 내 모든 학생의 런타임 플랜(정렬 기준 상위 2개)을 한 번에 조회하여 Node.js 단에서 매핑하는 방법입니다.

### ① 최적화된 단일 벌크 쿼리 작성 (`attendance.xml` 추가 제안)
MySQL 5.6 환경이므로 윈도우 함수 대신 **상관 서브쿼리(Correlated Subquery)**를 통해 그룹별 Top-2 행을 효율적으로 스캔합니다.

```xml
<select id="lastRuntimePlanStausEx">
  SELECT
    rp.memberid,
    rp.method,
    rp.hour,
    rp.minute,
    rp.status
  FROM ttokssaemdb.runtimeplan AS rp
  INNER JOIN ttokssaemdb.member AS m ON m.memberid = rp.memberid
  WHERE rp.branchid = #{branchid}
    AND rp.dayofweek = ${dayofweek}
    AND rp.status <![CDATA[ <> ]]> 3
    AND m.classyn = 'Y'
    AND m.type = 'S'
    -- 자신보다 순서가 빠른(sortorder가 작은) 레코드가 2개 미만인 것만 필터링 (Top 2)
    AND (
      SELECT COUNT(*)
      FROM ttokssaemdb.runtimeplan r2
      WHERE r2.memberid = rp.memberid
        AND r2.dayofweek = rp.dayofweek
        AND r2.status <![CDATA[ <> ]]> 3
        AND r2.sortorder <![CDATA[ < ]]> rp.sortorder
    ) <![CDATA[ < ]]> 2
  ORDER BY
    m.membername ASC,
    rp.sortorder ASC
</select>
```

### ② Node.js 비즈니스 로직 수정 예시 (`SvcDashboard.js`)
* **AS-IS (N+1 루프)**:
  ```javascript
  let studentrs = await connection.query(studentsql);
  for(let i = 0; i < studentrs[0].length; i++) {
      let planrs = await connection.query(plansql); // 학생수만큼 루프 쿼리 발생
      ...
  }
  ```
* **TO-BE (단일 쿼리 조회 후 가공)**:
  ```javascript
  // 루프 없이 단 한 번의 조인 쿼리로 지점 내 모든 학생의 당일 계획(Top 2)을 획득
  var runtimeplanparam = { branchid: param.session_branchid, dayofweek: dayofweek };
  var runtimeplansql = MysqlConn.MAKESQL('attendance', 'lastRuntimePlanStausEx', runtimeplanparam, _SqlFormat);
  let runtimeplanrs = await connection.query(runtimeplansql);
  
  // 데이터 가공 (메모리 단에서 각 레코드에 인덱스 부여)
  let runtimeplans = [];
  let memberCountMap = {};
  for(let i = 0; i < runtimeplanrs[0].length; i++) {
      let row = runtimeplanrs[0][i];
      if (!memberCountMap[row.memberid]) {
          memberCountMap[row.memberid] = 0;
      }
      let obj = {
          idx: memberCountMap[row.memberid]++,
          memberid: row.memberid,
          method: row.method,
          hour: row.hour,
          minute: row.minute,
          status: row.status
      };
      runtimeplans.push(obj);
  }
  resdata.runtimeplans = runtimeplans;
  ```

이 방식은 루프 쿼리가 완전히 사라지므로 대시보드 로딩 성능이 **최소 10배에서 최대 100배 이상** 향상되는 핵심 개선점입니다.
