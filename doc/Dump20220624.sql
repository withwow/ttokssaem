DROP TABLE IF EXISTS `branch`;
CREATE TABLE `branch` (
  `branchid` varchar(10) NOT NULL COMMENT '지점 아이디',
  `branchname` varchar(45) NOT NULL COMMENT '지점명',
  `ceo` varchar(45) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `useyn` varchar(5) DEFAULT 'Y',
  `regdate` datetime DEFAULT NULL,
  PRIMARY KEY (`branchid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `branch` WRITE;
INSERT INTO `branch` VALUES ('BR00000000','시스템','시스템','070-0000-0000','Y','2022-06-23 07:50:52'),('BR00000001','1호점','김선미','070-1234-1234','Y','2022-06-23 07:48:36');
UNLOCK TABLES;

DROP TABLE IF EXISTS `cmm_auth`;
CREATE TABLE `cmm_auth` (
  `auth_id` varchar(12) CHARACTER SET utf8 NOT NULL COMMENT '권한 아이디',
  `auth` varchar(100) NOT NULL COMMENT '권한명',
  `level` int(11) DEFAULT '1',
  `useyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용여부',
  `reg_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  `upd_dt` timestamp NULL COMMENT '수정일시',
  PRIMARY KEY (`auth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='권한';

LOCK TABLES `cmm_auth` WRITE;
INSERT INTO `cmm_auth` VALUES ('AUTH00000000','시스템',1,'Y','2022-06-26 10:33:56','2022-06-26 10:33:56'),('AUTH00000001','원장',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41'),('AUTH00000002','팀장',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41'),('AUTH00000003','선생님',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41'),('AUTH00000004','모니터링',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41');
UNLOCK TABLES;

--
-- Table structure for table `cmm_auth_menu`
--

DROP TABLE IF EXISTS `cmm_auth_menu`;
CREATE TABLE `cmm_auth_menu` (
  `auth_id` varchar(12) CHARACTER SET utf8 NOT NULL COMMENT '권한 아이디',
  `menu_id` varchar(12) NOT NULL COMMENT '메뉴 아이디',
  `btn_read` varchar(1) DEFAULT 'Y' COMMENT '읽기',
  `btn_reg` varchar(1) DEFAULT 'N' COMMENT '등록',
  `btn_upd` varchar(1) DEFAULT 'N' COMMENT '수정',
  `btn_del` varchar(1) DEFAULT 'N' COMMENT '삭제',
  `btn_xlsd` varchar(1) DEFAULT 'N' COMMENT '엑셀다운로드',
  `btn_xlsu` varchar(1) DEFAULT 'N' COMMENT '엑셀업로드',
  `reg_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  PRIMARY KEY (`auth_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='권한 매뉴 매칭';

--
-- Dumping data for table `cmm_auth_menu`
--

LOCK TABLES `cmm_auth_menu` WRITE;
INSERT INTO `cmm_auth_menu` VALUES ('AUTH00000000','MENU00000001','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000002','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000003','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000004','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000005','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000006','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000007','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000008','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000009','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000010','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000011','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000012','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000013','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000014','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000015','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000000','MENU00000016','Y','N','N','N','N','N','2022-06-26 07:05:52'),('AUTH00000001','MENU00000001','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000002','N','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000003','N','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000004','N','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000005','N','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000006','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000007','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000008','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000009','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000010','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000011','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000012','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000013','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000014','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000015','Y','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000001','MENU00000016','N','N','N','N','N','N','2022-06-26 10:34:32'),('AUTH00000002','MENU00000001','Y','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000002','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000003','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000004','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000005','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000006','Y','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000007','Y','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000008','Y','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000009','Y','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000010','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000011','Y','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000012','Y','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000013','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000014','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000015','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000002','MENU00000016','N','N','N','N','N','N','2022-06-28 01:42:31'),('AUTH00000003','MENU00000001','Y','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000002','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000003','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000004','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000005','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000006','Y','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000007','Y','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000008','Y','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000009','Y','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000010','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000011','Y','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000012','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000013','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000014','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000015','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000003','MENU00000016','N','N','N','N','N','N','2022-06-28 01:42:52'),('AUTH00000004','MENU00000001','Y','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000002','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000003','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000004','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000005','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000006','Y','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000007','Y','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000008','Y','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000009','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000010','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000011','Y','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000012','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000013','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000014','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000015','N','N','N','N','N','N','2022-06-26 10:36:09'),('AUTH00000004','MENU00000016','N','N','N','N','N','N','2022-06-26 10:36:09');
UNLOCK TABLES;

--
-- Table structure for table `cmm_menu`
--

DROP TABLE IF EXISTS `cmm_menu`;
CREATE TABLE `cmm_menu` (
  `menu_id` varchar(12) CHARACTER SET utf8 NOT NULL COMMENT '메뉴 아이디',
  `menu` varchar(100) NOT NULL COMMENT '메뉴명',
  `premenuid` varchar(12) DEFAULT '' COMMENT '상위메뉴 아이디',
  `menusort` int(11) NOT NULL DEFAULT '1' COMMENT '정렬순서',
  `uri` varchar(50) DEFAULT '' COMMENT 'URI',
  `menulev` int(11) NOT NULL DEFAULT '1' COMMENT '레벨',
  `icon` varchar(20) DEFAULT 'home' COMMENT '아이콘',
  `useyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용여부',
  `reg_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  `upd_dt` timestamp NULL COMMENT '수정일시',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='메뉴';

--
-- Dumping data for table `cmm_menu`
--

LOCK TABLES `cmm_menu` WRITE;
INSERT INTO `cmm_menu` VALUES ('MENU00000001','독서실 현황','',0,'/',2,'home','Y','2021-07-27 01:38:45','2022-06-26 07:15:00'),('MENU00000002','시스템','',100,'',1,'lock','Y','2021-07-27 01:38:45','2021-07-27 05:48:59'),('MENU00000003','권한 관리','MENU00000002',101,'/auth',2,'chevron-right','Y','2021-07-27 01:38:45','2022-06-26 07:16:50'),('MENU00000004','메뉴 관리','MENU00000002',102,'/menu',2,'chevron-right','Y','2021-07-27 01:38:45','2022-06-26 07:17:00'),('MENU00000005','권한&메뉴 매핑','MENU00000002',103,'/auth_menu',2,'chevron-right','Y','2021-07-27 01:38:45','2021-07-27 05:47:05'),('MENU00000006','학생','',200,'/student',1,'user','Y','2021-07-27 01:38:45','2022-06-26 07:12:46'),('MENU00000007','조회','',300,'',1,'trending-up','Y','2021-07-27 01:38:45','2022-06-26 07:17:46'),('MENU00000008','알림 사항','MENU00000007',301,'/notice',2,'chevron-right','Y','2021-07-27 05:50:43','2022-06-28 20:22:05'),('MENU00000009','벌점 내역','MENU00000007',302,'/blackmarks',2,'chevron-right','Y','2021-07-27 05:51:49','2022-06-28 20:22:15'),('MENU00000010','결제 내역','MENU00000007',303,'/payment',2,'chevron-right','Y','2021-07-27 05:52:45','2022-06-28 20:22:24'),('MENU00000011','출결 사항','MENU00000007',304,'/attendance',2,'chevron-right','Y','2021-07-27 05:53:24','2022-06-28 20:22:34'),('MENU00000012','학생 매칭 요청','',400,'/match',1,'link','Y','2021-07-27 05:54:16','2022-06-26 07:18:37'),('MENU00000013','선생님 관리',NULL,500,'/user',1,'box','Y','2021-07-27 05:55:30','2022-06-26 08:49:26'),('MENU00000014','회원 관리','',600,'/member',1,'users','Y','2021-07-27 05:56:02','2022-06-26 08:49:48'),('MENU00000015','상품 관리',NULL,700,'/goods',1,'shopping-bag','Y','2021-07-27 05:56:47','2022-06-26 08:51:02'),('MENU00000016','지점 관리',NULL,800,'/branch',1,'grid','Y','2021-07-27 05:57:02','2022-06-26 09:02:22');
UNLOCK TABLES;

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
CREATE TABLE `family` (
  `familyid` int(11) NOT NULL AUTO_INCREMENT,
  `memberid` varchar(20) NOT NULL COMMENT '아이디',
  `parentid` varchar(20) NOT NULL COMMENT '부모 아이디',
  PRIMARY KEY (`familyid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
INSERT INTO `family` VALUES (1,'1111','2222'),(2,'3333','2222');
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `branchid` varchar(10) DEFAULT NULL,
  `goodsid` varchar(10) NOT NULL,
  `type` varchar(5) DEFAULT 'P' COMMENT 'P :  기간제\nC :  소모품',
  `goodsname` varchar(45) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `useyn` varchar(5) DEFAULT NULL,
  `regdate` datetime DEFAULT NULL,
  PRIMARY KEY (`goodsid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='상품';

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
INSERT INTO `goods` VALUES ('BR00000000','GOODS00002','P','1개월 학습관리 케어권',240000,'Y','2022-06-27 15:50:13'),('BR00000000','GOODS00005','P','231312',1312331,'Y','2022-06-27 17:37:14'),('BR00000001','GOODS00010','P','1개월 독서실 이용권',180000,'Y','2022-06-28 09:45:13'),('BR00000001','GOODS00011','P','1개월 사물함 이용권',20000,'Y','2022-06-28 09:45:31');
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `memberno` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` varchar(10) NOT NULL,
  `memberid` varchar(20) NOT NULL,
  `memberpw` varchar(45) NOT NULL,
  `type` varchar(5) NOT NULL DEFAULT 'S' COMMENT 'S : 학생\\\\n\\nP : 부모',
  `membername` varchar(20) DEFAULT NULL COMMENT '이름',
  `schoolcode` varchar(12) DEFAULT NULL COMMENT '학교코드',
  `schoolname` varchar(20) DEFAULT NULL COMMENT '학교명',
  `grade` varchar(5) DEFAULT '5' COMMENT '학년\n1 : \n2 :\n3 : \n4 : 재수\n5 : 기타',
  `gender` varchar(5) NOT NULL DEFAULT 'M' COMMENT 'M :Male\nF: Female',
  `contact` varchar(20) DEFAULT NULL COMMENT '연락처',
  `email` varchar(45) DEFAULT NULL COMMENT '이메일',
  `os` varchar(5) NOT NULL DEFAULT 'andr' COMMENT 'ios : iOS\nandr : Android\n',
  `pushtoken` varchar(200) DEFAULT NULL COMMENT '푸시토큰',
  `marketing` varchar(5) DEFAULT 'Y' COMMENT '마케팅동의',
  `push` varchar(5) DEFAULT 'Y' COMMENT '푸시 수신 동의',
  `regdate` varchar(45) DEFAULT NULL COMMENT '가입일',
  PRIMARY KEY (`memberid`),
  UNIQUE KEY `memberno_UNIQUE` (`memberno`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
INSERT INTO `member` VALUES (3,'BR00000001','1111','154AE5B3B4BF145C69086EC6A57369CA','S','홍길동','7551012','금광중학교','1','M','01034567890','email@email.com','andr','cwaCKi39QniHimMXNjco-4:APA91bE7B2OlMF97w_jaf1QaIpJyu9hsF-9vf7XELNWtzuoFJ6okHCy07vgpifprRQqOf4aexvCiTn5ouh8boVayD4tdBRq069W9mcVXaFmz9A-VyoCCEn-SdmIQhpQTZsMpIhHFDssM','Y','Y','2022-07-13 15:58:06'),(4,'BR00000001','2222','154AE5B3B4BF145C69086EC6A57369CA','P','아빠',NULL,NULL,'5','M','01022223333','email@email.com','andr','cwaCKi39QniHimMXNjco-4:APA91bE7B2OlMF97w_jaf1QaIpJyu9hsF-9vf7XELNWtzuoFJ6okHCy07vgpifprRQqOf4aexvCiTn5ouh8boVayD4tdBRq069W9mcVXaFmz9A-VyoCCEn-SdmIQhpQTZsMpIhHFDssM','Y','Y','2022-06-30 14:04:23'),(5,'BR00000001','3333','154AE5B3B4BF145C69086EC6A57369CA','S','홍길순','7551012','금광중학교','2','F','01011112222','email@email.com','andr',NULL,'Y','Y','2022-06-30 14:04:23'),(1,'BR00000001','member1','154AE5B3B4BF145C69086EC6A57369CA','S','학생1','7010057','가락고등학교','1','M','01012345678','withwow@gmail.com','andr',NULL,'Y','Y','2022-06-30 14:04:23'),(2,'BR00000001','member2','154AE5B3B4BF145C69086EC6A57369CA','S','학생2','7010057','가락고등학교','1','M','01023456789','withwow@gmail.com','andr',NULL,'Y','Y','2022-06-30 14:04:23');
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `noticeid` bigint(20) NOT NULL AUTO_INCREMENT,
  `branchid` varchar(10) NOT NULL COMMENT '지점 아이디',
  `memberid` varchar(20) NOT NULL COMMENT '수신 아이디\n',
  `category` varchar(5) DEFAULT 'Z' COMMENT 'A: 출결\nB: 공지\nZ: 기타',
  `title` varchar(20) DEFAULT NULL,
  `message` varchar(45) DEFAULT NULL,
  `regdate` datetime DEFAULT NULL,
  `readyn` varchar(5) DEFAULT 'N',
  `readdate` datetime DEFAULT NULL,
  `needaggreyn` varchar(5) DEFAULT 'N',
  `aggreyn` varchar(5) DEFAULT 'N',
  `aggredate` datetime DEFAULT NULL,
  PRIMARY KEY (`noticeid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
INSERT INTO `notice` VALUES (1,'BR00000001','1111','Z','타이틀 1','메시지 내용','2022-07-18 10:45:21','Y','2022-07-19 09:13:10','N','N',NULL),(2,'BR00000001','1111','Z','타이틀 2','메시지 내용','2022-07-18 10:45:28','Y','2022-07-19 09:13:10','N','N',NULL),(3,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:29','Y','2022-07-19 09:13:10','N','N',NULL),(4,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:29','Y','2022-07-19 09:09:47','N','N',NULL),(5,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:30','Y','2022-07-19 09:09:47','N','N',NULL),(6,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:30','Y','2022-07-19 09:09:47','N','N',NULL),(7,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:31','Y','2022-07-19 09:09:47','N','N',NULL),(8,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:31','Y','2022-07-19 09:09:47','N','N',NULL),(9,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:32','Y','2022-07-19 09:09:47','N','N',NULL),(10,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:32','Y','2022-07-19 09:09:47','N','N',NULL),(11,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:33','Y','2022-07-19 09:09:47','N','N',NULL),(12,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:33','Y','2022-07-19 09:09:47','N','N',NULL),(13,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:34','Y','2022-07-19 09:09:47','N','N',NULL),(14,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:34','Y','2022-07-19 09:08:57','N','N',NULL),(15,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:35','Y','2022-07-19 09:08:57','Y','Y','2022-07-18 22:06:06'),(16,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:35','Y','2022-07-19 09:08:57','Y','Y','2022-07-18 22:11:42'),(17,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:36','Y','2022-07-19 09:08:57','N','N',NULL),(18,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:36','Y','2022-07-19 09:08:57','N','N',NULL),(19,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:37','Y','2022-07-19 09:08:57','N','N',NULL),(20,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:37','Y','2022-07-19 09:08:57','N','N',NULL),(21,'BR00000001','1111','Z','타이틀','메시지 내용','2022-07-18 10:45:38','Y','2022-07-19 09:08:57','N','N',NULL),(22,'BR00000001','1111','Z','타이틀 22','메시지 내용','2022-07-18 10:45:38','Y','2022-07-19 09:08:57','Y','Y','2022-07-18 22:11:58'),(23,'BR00000001','1111','Z','타이틀 23','홍길동 학생이 입실하였습니다.','2022-07-18 10:45:39','Y','2022-07-19 09:08:57','Y','Y','2022-07-18 20:08:30'),(24,'BR00000001','1111','A','타이틀24','홍길동 학생이 입실하였습니다.','2022-07-20 11:26:44','Y','2022-07-20 11:30:15','N','N',NULL),(25,'BR00000001','1111','A','타이틀24','홍길동 학생이 입실하였습니다.','2022-07-20 11:51:29','Y','2022-07-20 11:51:40','N','N',NULL);
UNLOCK TABLES;

--
-- Table structure for table `pushsendmsg`
--

DROP TABLE IF EXISTS `pushsendmsg`;
CREATE TABLE `pushsendmsg` (
  `sendid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '일련번호',
  `title` varchar(200) NOT NULL COMMENT '타이틀',
  `message` varchar(500) NOT NULL COMMENT '메시지내용',
  `pushtoken` varchar(250) NOT NULL COMMENT '푸시토큰',
  `linkurl` varchar(100) NOT NULL DEFAULT '' COMMENT '클릭시 연결될 화면',
  `os` varchar(45) NOT NULL DEFAULT '' COMMENT '운영체제',
  `reserved` char(1) DEFAULT 'I' COMMENT 'R : Reserved message\\nI : Instant message',
  `senddate` datetime NULL COMMENT '전송 요청 시간',
  PRIMARY KEY (`sendid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='(요청)전송할 메시지';

--
-- Dumping data for table `pushsendmsg`
--

LOCK TABLES `pushsendmsg` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `pushsentmsg`
--

DROP TABLE IF EXISTS `pushsentmsg`;
CREATE TABLE `pushsentmsg` (
  `sentid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '전송 한 일련번호',
  `sendid` bigint(20) NOT NULL COMMENT '전송 요청 일련번호',
  `title` varchar(200) NOT NULL COMMENT '타이틀',
  `message` varchar(500) NOT NULL COMMENT '메시지내용',
  `linkurl` varchar(100) NOT NULL COMMENT '클릭시 연결될 화면',
  `pushtoken` varchar(250) NOT NULL COMMENT '푸시토큰',
  `os` varchar(45) NOT NULL DEFAULT '' COMMENT '운영체제',
  `reserved` char(1) DEFAULT 'I' COMMENT 'R : Reserved message\\nI : Instant message',
  `senddate` datetime NULL COMMENT '전송 요청 시간',
  `sentdate` datetime NULL COMMENT '전송 한 시간',
  `response` varchar(255) DEFAULT NULL COMMENT '메시지 송신 후 응답',
  PRIMARY KEY (`sentid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='(요청)전송할 메시지';

--
-- Dumping data for table `pushsentmsg`
--

LOCK TABLES `pushsentmsg` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `sequence`
--

DROP TABLE IF EXISTS `sequence`;
CREATE TABLE `sequence` (
  `seq_name` varchar(50) NOT NULL,
  `seq_currval` bigint(20) NOT NULL,
  PRIMARY KEY (`seq_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `sequence`
--

LOCK TABLES `sequence` WRITE;
INSERT INTO `sequence` VALUES ('ttok.auth',4),('ttok.branch',4),('ttok.goods',11),('ttok.menu',16);
UNLOCK TABLES;

--
-- Table structure for table `studyplan`
--

DROP TABLE IF EXISTS `studyplan`;
CREATE TABLE `studyplan` (
  `studyplanid` bigint(20) NOT NULL AUTO_INCREMENT,
  `branchid` varchar(10) NOT NULL,
  `memberid` varchar(20) NOT NULL,
  `class` varchar(5) DEFAULT NULL COMMENT '교시',
  `study` varchar(45) DEFAULT NULL COMMENT '학습 계획',
  `plandate` varchar(8) DEFAULT NULL,
  `achieveyn` varchar(5) DEFAULT 'N' COMMENT '목표 달성 여부',
  `regdate` datetime DEFAULT NULL,
  PRIMARY KEY (`studyplanid`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `studyplan`
--

LOCK TABLES `studyplan` WRITE;
INSERT INTO `studyplan` VALUES (56,'BR00000001','1111','1','수학','20220719','Y','2022-07-19 22:38:13'),(57,'BR00000001','1111','7','영어','20220719','Y','2022-07-19 22:38:13'),(58,'BR00000001','1111','8','과학','20220719','Y','2022-07-19 22:38:13'),(61,'BR00000001','1111','1','1111','20220720','Y','2022-07-20 12:59:05'),(62,'BR00000001','1111','2','22222','20220720','Y','2022-07-20 12:59:05'),(63,'BR00000001','1111','3','3333','20220720','Y','2022-07-20 12:59:05'),(64,'BR00000001','1111','4','4444','20220720','Y','2022-07-20 12:59:05'),(65,'BR00000001','1111','5','5555','20220720','Y','2022-07-20 12:59:05'),(66,'BR00000001','1111','6','6666','20220720','Y','2022-07-20 12:59:05'),(67,'BR00000001','1111','7','77777','20220720','Y','2022-07-20 12:59:05'),(68,'BR00000001','1111','8','88888','20220720','Y','2022-07-20 12:59:05'),(69,'BR00000001','1111','1','1111','20220718','Y','2022-07-20 15:01:42'),(70,'BR00000001','1111','2','1111','20220718','Y','2022-07-20 15:01:45'),(71,'BR00000001','1111','3','1111','20220718','Y','2022-07-20 15:01:47'),(72,'BR00000001','1111','1','1111','20220717','Y','2022-07-20 15:02:57'),(73,'BR00000001','1111','2','1111','20220717','Y','2022-07-20 15:02:58'),(74,'BR00000001','1111','3','1111','20220717','Y','2022-07-20 15:02:59'),(75,'BR00000001','1111','4','1111','20220717','Y','2022-07-20 15:02:59'),(76,'BR00000001','1111','5','1111','20220717','Y','2022-07-20 15:03:01'),(77,'BR00000001','1111','1','1111','20220716','Y','2022-07-20 15:04:13'),(78,'BR00000001','1111','1','1111','20220716','Y','2022-07-20 15:04:14'),(79,'BR00000001','1111','1','1111','20220716','Y','2022-07-20 15:04:14'),(80,'BR00000001','1111','1','1111','20220716','Y','2022-07-20 15:04:15'),(81,'BR00000001','1111','1','1111','20220716','Y','2022-07-20 15:04:15'),(82,'BR00000001','1111','1','1111','20220715','Y','2022-07-20 15:04:48'),(83,'BR00000001','1111','2','1111','20220715','Y','2022-07-20 15:04:49'),(84,'BR00000001','1111','1','1111','20220714','Y','2022-07-20 16:57:01'),(85,'BR00000001','1111','1','1111','20220714','Y','2022-07-20 16:57:02'),(86,'BR00000001','1111','1','1111','20220714','Y','2022-07-20 16:57:04'),(87,'BR00000001','1111','1','1111','20220713','Y','2022-07-20 16:57:11'),(88,'BR00000001','1111','1','1111','20220713','Y','2022-07-20 16:57:12'),(89,'BR00000001','1111','1','1111','20220713','Y','2022-07-20 16:57:13'),(90,'BR00000001','1111','1','1111','20220713','Y','2022-07-20 16:57:16'),(91,'BR00000001','1111','1','1111','20220712','Y','2022-07-20 16:57:27'),(92,'BR00000001','1111','1','1111','20220712','Y','2022-07-20 16:57:28'),(93,'BR00000001','1111','1','1111','20220712','Y','2022-07-20 16:57:28'),(94,'BR00000001','1111','1','1111','20220712','Y','2022-07-20 16:57:29'),(95,'BR00000001','1111','1','1111','20220712','Y','2022-07-20 16:57:29'),(96,'BR00000001','1111','1','1111','20220712','Y','2022-07-20 16:57:30'),(97,'BR00000001','1111','1','1111','20220711','Y','2022-07-20 16:58:05'),(98,'BR00000001','1111','1','1111','20220711','Y','2022-07-20 16:58:05'),(99,'BR00000001','1111','1','1111','20220711','Y','2022-07-20 16:58:06'),(100,'BR00000001','1111','1','1111','20220711','Y','2022-07-20 16:58:06'),(101,'BR00000001','1111','1','1111','20220711','Y','2022-07-20 16:58:06'),(102,'BR00000001','1111','1','1111','20220710','Y','2022-07-20 16:58:12'),(103,'BR00000001','1111','1','1111','20220710','Y','2022-07-20 16:58:12'),(104,'BR00000001','1111','1','1111','20220710','Y','2022-07-20 16:58:12'),(105,'BR00000001','1111','1','1111','20220710','Y','2022-07-20 16:58:13'),(106,'BR00000001','1111','1','1111','20220710','Y','2022-07-20 16:58:13'),(107,'BR00000001','1111','1','1111','20220710','Y','2022-07-20 16:58:14');
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `branchid` varchar(10) NOT NULL COMMENT '지점 아이디',
  `userid` varchar(20) NOT NULL COMMENT '유저 아이디',
  `userpw` varchar(45) NOT NULL COMMENT '비밀번호',
  `auth_id` varchar(12) NOT NULL COMMENT '권한',
  `username` varchar(20) DEFAULT NULL COMMENT '이름',
  `contact` varchar(20) DEFAULT NULL COMMENT '연락처',
  `email` varchar(45) DEFAULT NULL COMMENT '이메일',
  `useyn` varchar(5) DEFAULT 'Y' COMMENT '사용유무\\nY : 사용\\nN : 사용안함',
  `regdate` datetime DEFAULT NULL COMMENT '등록일자',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
INSERT INTO `user` VALUES ('BR00000000','admin','154AE5B3B4BF145C69086EC6A57369CA','AUTH00000000','시스템','070-0000-0000','admin@system.com','Y','2022-06-28 09:57:03'),('BR00000001','user1','154AE5B3B4BF145C69086EC6A57369CA','AUTH00000001','원장','070-0000-0000','user1@user.com','Y','2022-06-28 09:57:03');
UNLOCK TABLES;

--
-- Table structure for table `version`
--

DROP TABLE IF EXISTS `version`;
CREATE TABLE `version` (
  `os` varchar(10) NOT NULL COMMENT 'OS',
  `version` varchar(10) NOT NULL COMMENT '버전',
  `reviewversion` varchar(10) NOT NULL COMMENT '리뷰 진행중 버전',
  PRIMARY KEY (`version`,`os`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='버전 관리';

--
-- Dumping data for table `version`
--

LOCK TABLES `version` WRITE;
INSERT INTO `version` VALUES ('andr','1.0.0','0.0.0'),('editor','1.0.0','0.0.0'),('ios','1.0.0','0.0.0');
UNLOCK TABLES;

--
-- Table structure for table `webhooksendmsg`
--

DROP TABLE IF EXISTS `webhooksendmsg`;
CREATE TABLE `webhooksendmsg` (
  `sendid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '일련번호',
  `text` varchar(200) NOT NULL COMMENT '내용',
  `title` varchar(50) NOT NULL COMMENT '타이틀',
  `message` varchar(500) NOT NULL COMMENT '상세',
  `reserved` char(1) DEFAULT 'I' COMMENT 'R : Reserved message\\nI : Instant message',
  `senddate` datetime NULL COMMENT '전송 요청 시간',
  PRIMARY KEY (`sendid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='(요청)전송할 메시지';

--
-- Dumping data for table `webhooksendmsg`
--

LOCK TABLES `webhooksendmsg` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `webhooksentmsg`
--

DROP TABLE IF EXISTS `webhooksentmsg`;
CREATE TABLE `webhooksentmsg` (
  `sentid` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '전송 한 일련번호',
  `sendid` bigint(20) NOT NULL COMMENT '전송 요청 일련번호',
  `text` varchar(200) NOT NULL COMMENT '내용',
  `title` varchar(50) NOT NULL COMMENT '타이틀',
  `message` varchar(500) NOT NULL COMMENT '상세',
  `reserved` char(1) DEFAULT 'I' COMMENT 'R : Reserved message\\nI : Instant message',
  `senddate` datetime NULL COMMENT '전송 요청 시간',
  `sentdate` datetime NULL COMMENT '전송 한 시간',
  `response` varchar(255) DEFAULT NULL COMMENT '메시지 송신 후 응답',
  PRIMARY KEY (`sentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='(요청)전송할 메시지';

--
-- Dumping data for table `webhooksentmsg`
--

LOCK TABLES `webhooksentmsg` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `withdraw`
--

DROP TABLE IF EXISTS `withdraw`;
CREATE TABLE `withdraw` (
  `withdrawid` int(11) NOT NULL AUTO_INCREMENT,
  `branchid` varchar(10) NOT NULL,
  `memberid` varchar(20) NOT NULL,
  `regdate` datetime DEFAULT NULL,
  `confirmyn` varchar(5) DEFAULT 'N' COMMENT 'Y : 승인\nN : 미승인',
  `confirmdate` datetime DEFAULT NULL,
  PRIMARY KEY (`withdrawid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `withdraw`
--

LOCK TABLES `withdraw` WRITE;
UNLOCK TABLES;

--
-- Dumping routines for database 'ttok'
--
CREATE FUNCTION `nextval`(p_seq_name CHAR(50) CHARSET UTF8) RETURNS bigint(20) unsigned
    MODIFIES SQL DATA
    DETERMINISTIC
BEGIN
 INSERT INTO tb_sequence 
  SET SEQ_NAME=IFNULL(p_seq_name,'DEFAULT'), SEQ_CURRVAL=(@v_current_value:=1)
 ON DUPLICATE KEY
  UPDATE SEQ_CURRVAL=(@v_current_value:=seq_currval+1);
 RETURN @v_current_value;
END;

-- Dump completed on 2022-07-24 21:31:59
