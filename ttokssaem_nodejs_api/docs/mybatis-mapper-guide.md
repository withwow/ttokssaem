# MyBatis Mapper 작성 가이드

이 프로젝트의 SQL Mapper는 `xml/` 아래에 두고 `common/MysqlConn.js`에 Mapper 파일을 등록한다.

## SQL 본문은 CDATA로 작성

각 SQL 문은 XML 예약 문자(`>`, `<`, `&`)로 인한 파싱 오류를 막기 위해 전체 본문을 `CDATA`로 감싼다.

```xml
<select id="selExample">
  <![CDATA[
  SELECT memberid, membername
  FROM ttokssaemdb.member
  WHERE branchid = #{branchid}
    AND regdate <= LAST_DAY(NOW())
  ]]>
</select>
```

- `CDATA` 안에서는 `&lt;`, `&gt;` 같은 XML 이스케이프 대신 SQL 연산자 `<`, `>`를 그대로 쓴다.
- SQL 일부만 감싸지 말고, 각 `select`·`insert`·`update`·`delete`의 SQL 전체를 감싼다.
- `CDATA` 영역 안에 `]]>` 문자열이 필요한 경우에는 SQL을 분리해 작성한다.

## 파라미터 바인딩 규칙

이 프로젝트에서는 파라미터 성격에 따라 다음 규칙을 사용한다.

| 값 종류 | 표기 | 예시 |
| --- | --- | --- |
| 문자형 | `#{...}` | `memberid = #{memberid}` |
| 숫자형 | `${...}` | `LIMIT ${length} OFFSET ${start}` |

문자형 값은 반드시 `#{...}`로 바인딩한다. `${...}`는 SQL 문자열에 그대로 치환되므로 숫자형으로 검증·제한된 값에만 사용한다. 숫자형 페이지 값은 서비스 계층에서 범위를 제한한 뒤 Mapper에 전달한다.

## 새 Mapper 추가 절차

1. `xml/<기능>.xml`에 Mapper와 SQL을 추가한다.
2. `common/MysqlConn.js`의 `mapperLocations`에 해당 XML 파일을 등록한다.
3. 서비스에서는 `Mysql.MAKESQL('<namespace>', '<statementId>', params)` 형식으로 호출한다.
4. XML 형식 검사와 해당 API의 정상·오류 응답을 확인한다.

## 점검 항목

- XML 구문 오류가 없는가
- SQL 전체가 CDATA로 감싸졌는가
- 문자형은 `#{...}`, 검증된 숫자형은 `${...}` 규칙을 따르는가
- `${...}`로 전달되는 숫자형에 범위 제한이 있는가
- 새 XML 파일을 `MysqlConn.js`에 등록했는가
