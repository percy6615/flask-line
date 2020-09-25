-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 192.168.4.121    Database: wraproject
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `pump_car`
--

DROP TABLE IF EXISTS `pump_car`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pump_car` (
  `car_id` varchar(45) NOT NULL,
  `unit` varchar(45) NOT NULL,
  `car_name` varchar(45) NOT NULL,
  PRIMARY KEY (`car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pump_car`
--

LOCK TABLES `pump_car` WRITE;
/*!40000 ALTER TABLE `pump_car` DISABLE KEYS */;
INSERT INTO `pump_car` VALUES ('1','第二河川局','二河-01'),('2','第二河川局','二河-02'),('3','第二河川局','二河-03'),('4','第二河川局','二河-04'),('5','第三河川局','三河-01'),('6','第三河川局','三河-02');
/*!40000 ALTER TABLE `pump_car` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pump_mission_list`
--

DROP TABLE IF EXISTS `pump_mission_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pump_mission_list` (
  `mission_id` varchar(64) NOT NULL,
  `sender` varchar(45) DEFAULT NULL,
  `report_no` varchar(64) DEFAULT NULL,
  `base_unit` varchar(45) DEFAULT NULL,
  `dispatch_unit` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `mission_status` varchar(45) DEFAULT NULL,
  `num` int DEFAULT NULL,
  `support_location` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `remarks` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `dispatch_car_list` varchar(45) DEFAULT NULL,
  `site_condition` varchar(45) DEFAULT NULL,
  `flood_deep` varchar(5) DEFAULT NULL,
  `site_pic_url` varchar(150) DEFAULT NULL,
  `read_status` int DEFAULT NULL,
  `contact` varchar(45) DEFAULT NULL,
  `x` double DEFAULT NULL,
  `y` double DEFAULT NULL,
  PRIMARY KEY (`mission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pump_mission_list`
--

LOCK TABLES `pump_mission_list` WRITE;
/*!40000 ALTER TABLE `pump_mission_list` DISABLE KEYS */;
INSERT INTO `pump_mission_list` VALUES ('65b8a1fb-e007-472a-b8d3-e1b2e575d30a','ad','RP202009231033','第一河川局','第三河川局','進行預佈',5,'桃園市中壢區中央西路888號','氣象局預報大雨即將來襲，請盡速前往進行預佈作業!','2020-09-23 10:34:51','三河-01,三河-02','運送中','45','./disasterpics/65b8a1fb-e007-472a-b8d3-e1b2e575d30a/2020924132515.jpg',1,'test',121,24),('9f1bb9c0-a7db-439b-a63c-a70bf2e6fbc4','ad','RP12365854','第六河川局','第二河川局','任務解除',2,'桃園市龍潭區','請立即處理','2020-09-21 15:07:09','二河-01,二河-02','運送中','75','./disasterpics/9f1bb9c0-a7db-439b-a63c-a70bf2e6fbc4/test.jpg',1,'test',121,24),('d647597a-d6b6-4552-bcad-4fc1923719f7','ad','RP77778888','第一河川局','第三河川局','上車待命',3,'桃園市龍潭區','盡速支援','2020-09-24 13:38:26',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('db1a102d-5be6-4cfa-8f0a-8788146bb584','ad','RP698745','第四河川局','第三河川局','進行預佈',5,'桃園市中壢區中正路125號','快!!!!!!!!!','2020-09-22 16:31:06','三河-01,三河-02','運送中','65','./disasterpics/db1a102d-5be6-4cfa-8f0a-8788146bb584/2020924164312.jpeg',1,'test',121,24);
/*!40000 ALTER TABLE `pump_mission_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_account`
--

DROP TABLE IF EXISTS `user_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_account` (
  `account` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `line_id` varchar(64) DEFAULT NULL,
  `group_name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_account`
--

LOCK TABLES `user_account` WRITE;
/*!40000 ALTER TABLE `user_account` DISABLE KEYS */;
INSERT INTO `user_account` VALUES ('ad','ad','ad','U07c6547bd9f55764e69d401af4d845af','第三河川局'),('admin01','admin01','黃寶賜',NULL,NULL),('Lance','lance1234','黃寶賜','U46af7fe06da5a3705281d861e832bff9','第一河川局'),('test01','test0101','水利署-1',NULL,NULL),('test02','test0202','水利署-2',NULL,NULL),('test03','test0303','水利署-3',NULL,NULL),('test04','test0404','水利署-4',NULL,NULL),('test05','test0505','水利署-5',NULL,NULL),('test06','test0606','水利署-6',NULL,NULL),('test07','test0707','水利署-7',NULL,NULL),('test08','test0808','水利署-8',NULL,NULL),('test09','test0909','水利署-9',NULL,NULL),('test10','test1010','水利署-10',NULL,NULL),('test11','test1111','水利署-11',NULL,NULL),('test12','test1212','水利署-12',NULL,NULL),('test13','test1313','水利署-13',NULL,NULL),('test14','test1414','水利署-14',NULL,NULL),('test15','test1515','水利署-15',NULL,NULL),('test16','test1616','水利署-16',NULL,NULL),('test17','test1717','水利署-17',NULL,NULL),('test18','test1818','水利署-18',NULL,NULL),('test19','test1919','水利署-19',NULL,NULL),('test20','test2020','水利署-20',NULL,NULL);
/*!40000 ALTER TABLE `user_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'wraproject'
--

--
-- Dumping routines for database 'wraproject'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-25  9:40:11
