-- =====================================================================
-- 수능/평시 시간표 자동 전환 : 어드민 메뉴 등록
-- 반드시 어드민(ttokssaem_nodejs_admin) 배포 "후" 실행
--   (먼저 실행하면 사이드바에 메뉴가 보이지만 눌렀을 때 404)
-- 메뉴는 로그인 시 세션에 올라가므로 실행 후 재로그인해야 보임
-- =====================================================================

SET NAMES utf8;

-- 상위 메뉴 '시스템'(MENU00000002) 아래에 추가. 운영 DB의 상위 메뉴 ID가 다르면 바꿔서 실행
INSERT INTO ttokssaemdb.cmm_menu (menu_id, menu, premenuid, menusort, uri, menulev, icon, useyn, reg_dt, upd_dt)
SELECT 'MENU_TIMETBL', '시간표 기간 관리', 'MENU00000002', 104, '/timetable', 2, 'chevron-right', 'Y', NOW(), NOW()
  FROM DUAL
 WHERE NOT EXISTS (SELECT 1 FROM ttokssaemdb.cmm_menu WHERE menu_id = 'MENU_TIMETBL');

-- 권한 매핑: 시스템(AUTH00000000)만 사용. 다른 권한에 열려면 '권한&메뉴 매핑' 화면에서 추가
INSERT IGNORE INTO ttokssaemdb.cmm_auth_menu (auth_id, menu_id, btn_read, btn_reg, btn_upd, btn_del, btn_xlsd, btn_xlsu, reg_dt)
VALUES ('AUTH00000000', 'MENU_TIMETBL', 'Y', 'Y', 'Y', 'Y', 'N', 'N', NOW());

-- 되돌리기
-- DELETE FROM ttokssaemdb.cmm_auth_menu WHERE menu_id = 'MENU_TIMETBL';
-- DELETE FROM ttokssaemdb.cmm_menu WHERE menu_id = 'MENU_TIMETBL';
