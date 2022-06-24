-- MySQL dump 10.13  Distrib 8.0.25, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: ttok
-- ------------------------------------------------------
-- Server version	5.7.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `branchid` varchar(10) NOT NULL COMMENT '지점 아이디',
  `branchname` varchar(45) NOT NULL COMMENT '지점명',
  `ceo` varchar(45) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `useyn` varchar(5) DEFAULT 'Y',
  `regdate` datetime DEFAULT NULL,
  PRIMARY KEY (`branchid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES ('BR00000000','시스템','시스템','070-0000-0000','Y','2022-06-23 07:50:52'),('BR00000001','본점','김선미','070-1234-1234','Y','2022-06-23 07:48:36');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cmm_auth`
--

DROP TABLE IF EXISTS `cmm_auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cmm_auth` (
  `auth_id` varchar(12) CHARACTER SET utf8mb4 NOT NULL COMMENT '권한 아이디',
  `auth` varchar(100) NOT NULL COMMENT '권한명',
  `level` int(11) DEFAULT '1',
  `useyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용여부',
  `reg_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  `upd_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`auth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='권한';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cmm_auth`
--

LOCK TABLES `cmm_auth` WRITE;
/*!40000 ALTER TABLE `cmm_auth` DISABLE KEYS */;
INSERT INTO `cmm_auth` VALUES ('AUTH000000','시스템 관리자',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41'),('AUTH000001','원장',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41'),('AUTH000002','팀장',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41'),('AUTH000003','선생님',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41'),('AUTH000004','모니터링',1,'Y','2022-06-23 08:01:41','2022-06-23 08:01:41');
/*!40000 ALTER TABLE `cmm_auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cmm_auth_menu`
--

DROP TABLE IF EXISTS `cmm_auth_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cmm_auth_menu` (
  `auth_id` varchar(12) CHARACTER SET utf8mb4 NOT NULL COMMENT '권한 아이디',
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cmm_auth_menu`
--

LOCK TABLES `cmm_auth_menu` WRITE;
/*!40000 ALTER TABLE `cmm_auth_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `cmm_auth_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cmm_menu`
--

DROP TABLE IF EXISTS `cmm_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cmm_menu` (
  `menu_id` varchar(12) CHARACTER SET utf8mb4 NOT NULL COMMENT '메뉴 아이디',
  `menu` varchar(100) NOT NULL COMMENT '메뉴명',
  `premenuid` varchar(12) DEFAULT '' COMMENT '상위메뉴 아이디',
  `menusort` int(11) NOT NULL DEFAULT '1' COMMENT '정렬순서',
  `uri` varchar(50) DEFAULT '' COMMENT 'URI',
  `menulev` int(11) NOT NULL DEFAULT '1' COMMENT '레벨',
  `icon` varchar(20) DEFAULT 'home' COMMENT '아이콘',
  `useyn` varchar(1) NOT NULL DEFAULT 'Y' COMMENT '사용여부',
  `reg_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일시',
  `upd_dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '수정일시',
  PRIMARY KEY (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='메뉴';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cmm_menu`
--

LOCK TABLES `cmm_menu` WRITE;
/*!40000 ALTER TABLE `cmm_menu` DISABLE KEYS */;
/*!40000 ALTER TABLE `cmm_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequence`
--

DROP TABLE IF EXISTS `sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequence` (
  `seq_name` varchar(50) NOT NULL,
  `seq_currval` bigint(20) NOT NULL,
  PRIMARY KEY (`seq_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequence`
--

LOCK TABLES `sequence` WRITE;
/*!40000 ALTER TABLE `sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `branchid` varchar(10) NOT NULL COMMENT '지점 아이디',
  `userid` varchar(20) NOT NULL COMMENT '유저 아이디',
  `userpw` varchar(45) NOT NULL COMMENT '비밀번호',
  `authority` varchar(10) NOT NULL COMMENT '권한',
  `username` varchar(20) DEFAULT NULL COMMENT '이름',
  `contact` varchar(20) DEFAULT NULL COMMENT '연락처',
  `email` varchar(45) DEFAULT NULL COMMENT '이메일',
  `useyn` varchar(5) DEFAULT 'Y' COMMENT '사용유무\\nY : 사용\\nN : 사용안함',
  `regdate` datetime DEFAULT NULL COMMENT '등록일자',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('BR00000000','admin','154AE5B3B4BF145C69086EC6A57369CA','AUTH000000','시스템','070-0000-0000','admin@system.com','Y',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'ttok'
--
/*!50003 DROP FUNCTION IF EXISTS `nextval` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` FUNCTION `nextval`(p_seq_name CHAR(50) CHARSET UTF8) RETURNS bigint(20) unsigned
    MODIFIES SQL DATA
    DETERMINISTIC
BEGIN
 INSERT INTO tb_sequence 
  SET SEQ_NAME=IFNULL(p_seq_name,'DEFAULT'), SEQ_CURRVAL=(@v_current_value:=1)
 ON DUPLICATE KEY
  UPDATE SEQ_CURRVAL=(@v_current_value:=seq_currval+1);
 RETURN @v_current_value;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-24 10:42:38
