-- =====================================================================
-- 수능/평시 시간표 자동 전환 : 테이블 생성 + 시드
-- 언제 실행해도 운영에 영향 없음 (신규 테이블만 생성, 기존 테이블 변경 없음)
-- MySQL 5.1 호환 (DATETIME 기본값 사용 안 함)
-- =====================================================================

SET NAMES utf8;

-- 특별 시간표(수능 등) 적용 기간
CREATE TABLE IF NOT EXISTS ttokssaemdb.timetable_period (
  periodid    INT          NOT NULL AUTO_INCREMENT,
  branchid    VARCHAR(10)  NOT NULL DEFAULT 'ALL' COMMENT 'ALL=전 지점 공통, 그 외=지점 전용(준비만)',
  mode        VARCHAR(10)  NOT NULL DEFAULT 'CSAT' COMMENT '적용 시간표 (timetable_slot.mode)',
  title       VARCHAR(50)  NOT NULL COMMENT '예: 2027학년도 수능',
  startdate   VARCHAR(8)   NOT NULL COMMENT 'YYYYMMDD, 포함',
  enddate     VARCHAR(8)   NOT NULL COMMENT 'YYYYMMDD, 포함',
  useyn       VARCHAR(1)   NOT NULL DEFAULT 'Y',
  memo        VARCHAR(200) NULL,
  reguserid   VARCHAR(20)  NULL,
  regdate     DATETIME     NULL,
  upddate     DATETIME     NULL,
  PRIMARY KEY (periodid),
  KEY idx_timetable_period_date (useyn, startdate, enddate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='시간표 적용 기간';

-- 모드별 교시 정의 (class = studyplan.class 값)
CREATE TABLE IF NOT EXISTS ttokssaemdb.timetable_slot (
  mode        VARCHAR(10)  NOT NULL COMMENT 'NORMAL=평시, CSAT=수능',
  class       INT          NOT NULL COMMENT 'studyplan.class (1부터)',
  code        VARCHAR(10)  NOT NULL COMMENT '교시 식별 (P0~P8, LUNCH, DINNER) - 모드 간 매핑용',
  label       VARCHAR(20)  NOT NULL COMMENT '0교시, 점심시간',
  shortlabel  VARCHAR(10)  NOT NULL COMMENT '목록용 짧은 이름',
  timetext    VARCHAR(40)  NULL     COMMENT '08:00 ~ 08:30',
  PRIMARY KEY (mode, class)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='시간표 교시 정의';

-- 시드: 현재 앱/어드민에 하드코딩된 값 그대로 (재실행해도 중복 없음)
INSERT IGNORE INTO ttokssaemdb.timetable_slot (mode, class, code, label, shortlabel, timetext) VALUES
  ('NORMAL',  1, 'P1',     '1교시',    '1교시', '08:00 ~ 09:50'),
  ('NORMAL',  2, 'P2',     '2교시',    '2교시', '10:00 ~ 11:50'),
  ('NORMAL',  3, 'LUNCH',  '점심시간', '점  심', '11:50 ~ 12:59'),
  ('NORMAL',  4, 'P3',     '3교시',    '3교시', '13:00 ~ 14:50'),
  ('NORMAL',  5, 'P4',     '4교시',    '4교시', '15:00 ~ 16:50'),
  ('NORMAL',  6, 'DINNER', '저녁시간', '저  녁', '16:50 ~ 17:59'),
  ('NORMAL',  7, 'P5',     '5교시',    '5교시', '18:00 ~ 19:50'),
  ('NORMAL',  8, 'P6',     '6교시',    '6교시', '20:00 ~ 21:50'),
  ('NORMAL',  9, 'P7',     '7교시',    '7교시', '22:00 ~ 23:50'),
  ('NORMAL', 10, 'P8',     '8교시',    '8교시', '24:00 ~ 01:00'),
  ('CSAT',    1, 'P0',     '0교시',    '0교시', '08:00 ~ 08:30'),
  ('CSAT',    2, 'P1',     '1교시',    '1교시', '08:40 ~ 10:00'),
  ('CSAT',    3, 'P2',     '2교시',    '2교시', '10:30 ~ 12:10'),
  ('CSAT',    4, 'LUNCH',  '점심시간', '점  심', '12:10 ~ 13:00'),
  ('CSAT',    5, 'P3',     '3교시',    '3교시', '13:10 ~ 14:20'),
  ('CSAT',    6, 'P4',     '4교시',    '4교시', '14:50 ~ 16:37'),
  ('CSAT',    7, 'DINNER', '저녁시간', '저  녁', '16:40 ~ 17:59'),
  ('CSAT',    8, 'P5',     '5교시',    '5교시', '18:00 ~ 19:50'),
  ('CSAT',    9, 'P6',     '6교시',    '6교시', '20:00 ~ 21:50'),
  ('CSAT',   10, 'P7',     '7교시',    '7교시', '22:00 ~ 23:50'),
  ('CSAT',   11, 'P8',     '8교시',    '8교시', '24:00 ~ 01:00');

-- 시드: 2026년 수능 기간 (2027학년도 수능 2026-11-19, 종료일 포함)
INSERT INTO ttokssaemdb.timetable_period (branchid, mode, title, startdate, enddate, useyn, memo, reguserid, regdate)
SELECT 'ALL', 'CSAT', '2027학년도 수능', '20261019', '20261119', 'Y', '초기 이관', 'system', NOW()
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM ttokssaemdb.timetable_period WHERE startdate = '20261019' AND enddate = '20261119');

-- 확인
SELECT mode, COUNT(*) FROM ttokssaemdb.timetable_slot GROUP BY mode;   -- NORMAL 10, CSAT 11
SELECT * FROM ttokssaemdb.timetable_period;
