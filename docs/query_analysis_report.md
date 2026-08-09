# 똑쌤 Node.js 관리자 시스템 쿼리 점검 및 성능 개선 보고서

본 보고서는 똑쌤 Node.js 관리자 시스템의 MyBatis XML Mapper 쿼리를 전반적으로 점검하고, 데이터베이스 인덱스 추가와 쿼리 구조 튜닝을 통해 속도 향상(성능 개선)을 도모하기 위한 점검 결과 보고서입니다.

---

## 1. 종합 점검 의견
현재 프로젝트의 쿼리들은 복잡한 비즈니스 조건에 맞춰 작성되어 있으나, 데이터가 누적됨에 따라 속도 저하를 유발할 수 있는 몇 가지 전형적인 **Anti-Pattern**이 식별되었습니다.

* **인덱스 미사용 유발 요인**: WHERE 절에서의 컬럼 좌변 가공 및 비트 연산자 사용.
* **불필요한 반복 탐색**: SELECT 절 내 다중 스칼라 서브쿼리(Scalar Subquery) 사용으로 인한 테이블 반복 스캔.
* **묵시적 형변환**: 숫자 타입 컬럼에 대한 `LIKE` 조건 매핑.
* **정렬 비용**: 복합 인덱스가 부재한 상태에서의 대용량 `ORDER BY` + `LIMIT` 연산으로 인한 File Sort 발생.

아래 가이드에 따라 **인덱스를 적절히 추가**하고, 추후 개발용 데이터베이스가 준비되는 대로 **쿼리를 함께 최적화**하는 것을 권장합니다.

---

## 2. 공통 성능 저하 요인 및 개선 가이드

### ① 좌변 가공 (Column Function) 지양
* **문제점**: `DATE_FORMAT(member.classexpiredate, '%Y-%m-%d') = ...` 처럼 인덱스 컬럼 자체를 함수로 감싸서 비교하면, 해당 컬럼에 인덱스가 있더라도 옵티마이저가 인덱스를 타지 못하고 **Full Table Scan**을 하게 됩니다.
* **해결책**: 우변의 비교 값을 파라미터단에서 날짜 형식으로 가공하여 전달하고, 좌변은 순수 컬럼 상태로 비교해야 합니다.
  * *AS-IS*: `DATE_FORMAT(member.classexpiredate, '%Y-%m-%d') = #{date}`
  * *TO-BE*: `member.classexpiredate = STR_TO_DATE(#{date}, '%Y-%m-%d')` (또는 Between 범위 비교)

### ② SELECT 절 스칼라 서브쿼리 최적화
* **문제점**: 데이터 목록을 페이징 처리하여 가져오는 쿼리(`selMemberList`, `selVocaTestList` 등)의 SELECT 절에 다수의 서브쿼리가 포함되어 있습니다. 메인 쿼리에서 페이징되어 10~50건이 조회되더라도, 인덱스가 최적화되지 않았다면 매 로우마다 서브쿼리 대상 테이블을 Full Scan 하게 되어 급격한 성능 저하가 발생합니다.
* **해결책**: 서브쿼리 조건 컬럼에 대한 **복합 인덱스 설정**이 필수적이며, 필요한 경우 메인 쿼리와 `LEFT JOIN` 구조로 결합하여 하나의 실행계획으로 처리해야 합니다.

### ③ 묵시적 형변환(Implicit Type Conversion) 제거
* **문제점**: 가격/금액과 같은 숫자 데이터인 `payment.price` 컬럼에 `LIKE` 연산자를 쓰면 DBMS 내부적으로 문자열 변환이 일어나 인덱스를 활용할 수 없게 됩니다.
* **해결책**: 숫자 데이터 필터링은 정확한 동등 비교(`=`) 또는 범위 비교(`>=`, `<=`)를 사용해야 합니다.

### ④ 비트 연산 조건 인덱스 무력화 방안
* **문제점**: `(vocaplan.dayofweek & POW(2, ${dayofweek}) != 0)` 비트 연산 조건은 인덱스를 타지 못합니다.
* **해결책**: 데이터양이 아주 많지 않다면, 조건절의 다른 선행 조건(`stopyn`, `branchid`) 컬럼들을 인덱스로 묶어 검색 범위를 먼저 줄여주어야 합니다.

---

## 3. 테이블별 권장 추가 인덱스 (Index) 설계안

개발 데이터베이스 구축 시 성능 보장을 위해 아래 인덱스들의 생성을 검토해야 합니다.

| 대상 테이블 | 인덱스 컬럼 구성 | 용도 및 기대 효과 |
| :--- | :--- | :--- |
| **`member`** | `(branchid, type, classyn)` | 지점별 원생 목록 조회(`selMemberList`, `selStudentsMember`) 시 Full Scan 방지 |
| | `(memberid, classyn)` | 회원 가입 및 로그인, 만료일 대상 조회 최적화 |
| **`blackmark`** | `(memberid, cancelyn, regdate, point)` | 특정 학생의 전체/최근 벌점 합산(`selMemberList` 내 서브쿼리) 및 최근 벌점 2건 조회(`loadLastBlackmarks`) 성능 극대화 |
| **`vocaexam`** | `(memberid, memodate, degree)` | 특정 날짜에 치른 단어 시험의 최종 회차 조회 속도 개선 |
| **`checkvocaplan`**| `(memberid, memodate)` | 일자별 단어 진도 확인 및 삭제(`delVocaTest`) 시 인덱스 스캔 |
| | `(memberid, id DESC)` | 특정 학생의 가장 최신 단어 학습 플랜(`checkVocaPlan`)을 `LIMIT 1`로 즉시 역순 조회 |
| **`vocasolve`** | `(memberid, memodate, degree)` | 단어 풀이 이력 목록 조회(`selVocaSolveList`) 시 탐색 범위 최소화 |
| **`vocaplan`** | `(branchid, stopyn, memberid)` | 지점별 활성화된 단어 플랜 일괄 조회 최적화 |
| **`studyplan`** | `(memberid, plandate, class)` | 일일 학습 계획 조회(`selStudyplan`) 시 정렬(`ORDER BY class`) 비용 제거 |
| **`masterplan`** | `(memberid, dayofweek, sortorder)` | 요일별 마스터 계획 조회 시 File Sort 제거 및 즉시 반환 |
| **`runtimeplan`** | `(memberid, dayofweek, hour)` | 요일/시간 조건 상태 변경(`changePrevStatus`) 쿼리 튜닝 |
| **`payment`** | `(memberid, regdate)` | 특정 회원의 결제 히스토리 범위 검색(`dailyPayment`) 최적화 |

---

## 4. 상세 쿼리 튜닝 분석 (Before / After 제안)

### 📌 [Tuning 1] `member.xml` - `beforedays` (좌변 가공 개선)
* **기존 쿼리 (AS-IS)**:
  ```xml
  SELECT member.branchid, member.memberid, member.membername,
         DATE_FORMAT(member.classexpiredate, '%m월 %d일') classexpiredate
  FROM ttokssaemdb.member member
  WHERE classyn = 'Y'
    AND DATE_FORMAT(member.classexpiredate, '%Y-%m-%d') = DATE_FORMAT(DATE_ADD(STR_TO_DATE(#{schdate}, '%Y-%m-%d'), INTERVAL ${days} DAY), '%Y-%m-%d')
  ```
  * **원인**: `classexpiredate` 컬럼에 `DATE_FORMAT` 함수를 씌워 비교하므로 인덱스를 전혀 타지 못함.
* **개선 쿼리 (TO-BE)**:
  ```xml
  SELECT member.branchid, member.memberid, member.membername,
         DATE_FORMAT(member.classexpiredate, '%m월 %d일') classexpiredate
  FROM ttokssaemdb.member member
  WHERE classyn = 'Y'
    -- 컬럼을 가공하지 않고 우변의 매개변수를 DATE 형으로 가공하여 직접 비교
    AND member.classexpiredate = DATE_ADD(STR_TO_DATE(#{schdate}, '%Y-%m-%d'), INTERVAL ${days} DAY)
  ```
  * **효과**: `member.classexpiredate`에 지정된 인덱스를 활용하여 O(1) 수준으로 특정 날짜 만료 원생을 찾아냅니다.

---

### 📌 [Tuning 2] `vocatest.xml` - `selVocaTestList` (스칼라 서브쿼리 & 정렬 성능 개선)
* **기존 쿼리 (AS-IS)**:
  ```xml
  SELECT ...
    IFNULL((SELECT total FROM ttokssaemdb.vocaexam WHERE memodate = vocatest.memodate AND memberid = vocatest.memberid ORDER BY degree DESC LIMIT 1), 0) total,
    IFNULL((SELECT wrong FROM ttokssaemdb.vocaexam WHERE memodate = vocatest.memodate AND memberid = vocatest.memberid ORDER BY degree DESC LIMIT 1), 0) wrong
  FROM ...
  ```
  * **원인**: 서브쿼리가 SELECT 절에 여러 개 존재하고, 각각 `ORDER BY degree DESC LIMIT 1`을 수행함. 이로 인해 행마다 정렬 연산(File Sort)이 발생하여 매우 비효율적임.
* **개선 방안**:
  1. `vocaexam` 테이블에 `(memberid, memodate, degree DESC)` 복합 인덱스 구성.
  2. 인덱스가 잡혀 있다면 서브쿼리 내 `ORDER BY degree DESC LIMIT 1`은 Table Scan과 Sort 없이 인덱스의 가장 첫 번째 값을 곧바로 읽어오게 되므로 부하가 최소화됩니다.
  3. 만약 대량 조회가 일어난다면 서브쿼리 대신, 최신 degree 데이터를 가진 Inline View를 한 번에 `LEFT JOIN` 하도록 수정하는 편이 성능에 훨씬 유리합니다.

---

### 📌 [Tuning 3] `member.xml` - `selMemberList` (스칼라 서브쿼리 튜닝)
* **기존 쿼리 (AS-IS)**:
  ```xml
  SELECT ...
    IFNULL((SELECT SUM(point) FROM blackmark WHERE memberid = member.memberid),0) total_blackmark,
    IFNULL((SELECT SUM(point) FROM blackmark WHERE memberid = member.memberid AND ( regdate > LAST_DAY(NOW() - interval 1 month) AND regdate <= LAST_DAY(NOW()) )), 0) month_blackmark
  FROM ttokssaemdb.member member, ttokssaemdb.branch branch
  ...
  ```
  * **원인**: 목록 조회 시 벌점 테이블(`blackmark`)에 대하여 누적 벌점과 최근 한 달 벌점을 합산하는 서브쿼리가 행마다 실행됨.
* **개선 방안**:
  * `blackmark` 테이블에 `(memberid, cancelyn, regdate, point)` 인덱스를 생성하여 해당 쿼리들이 테이블 전체를 풀스캔하지 않고 지정된 범위만 인덱스 스캔(Index Range Scan)하여 즉시 결과를 내도록 유도합니다.

---

*본 보고서는 코드 미수정 원칙에 의거하여 소스 파일을 직접 변경하지 않고 개선 포인트를 점검하여 문서화하였습니다.*
