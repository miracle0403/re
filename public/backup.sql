-- MySQL dump 10.16  Distrib 10.1.36-MariaDB, for Linux (i686)
--
-- Host: localhost    Database: revolver
-- ------------------------------------------------------
-- Server version	10.1.36-MariaDB

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
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (2);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feeder`
--

DROP TABLE IF EXISTS `feeder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `feeder` (
  `user` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeder`
--

LOCK TABLES `feeder` WRITE;
/*!40000 ALTER TABLE `feeder` DISABLE KEYS */;
/*!40000 ALTER TABLE `feeder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `info`
--

DROP TABLE IF EXISTS `info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `info` (
  `user` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `info`
--

LOCK TABLES `info` WRITE;
/*!40000 ALTER TABLE `info` DISABLE KEYS */;
/*!40000 ALTER TABLE `info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'FREE FEEDER SLOT AVAILABLE!','Hello dear! We are pleased to inform you that as of today till 12pm on the launch of Swift Revolver, there is a contest for the highest recruiter! Asides from the referral bonus you will get, you will get your first free slot into the feeder matrix without paying. To qualify for this, Register then refer... See you at the top ...keep winning','2018-10-20 18:17:32');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(11) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `payer` varchar(255) NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `bank` varchar(255) NOT NULL,
  `accountName` varchar(255) NOT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile` (
  `user` varchar(255) NOT NULL,
  `bank` text NOT NULL,
  `account_name` text NOT NULL,
  `account_number` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES ('Miracle0403','ACCESS BANK','LAWRENCE MIRACLE','0713462272'),('Zarrinah','Fidelity','Zarrinah','6170866814'),('Onyiluvy','GTBANK ','Nwone onyinyechi peace ','0226358656'),('moshoba77','fcmb','moshoba77','5681688018');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset`
--

DROP TABLE IF EXISTS `reset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reset` (
  `user` varchar(255) NOT NULL,
  `status` text,
  `code` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset`
--

LOCK TABLES `reset` WRITE;
/*!40000 ALTER TABLE `reset` DISABLE KEYS */;
/*!40000 ALTER TABLE `reset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('vWiv9mTZPs8i0WqtNAFkaAeB1Hqsli_e',1545173914,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":{\"user_id\":2}}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `sponsor` text,
  `username` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `verification` text,
  `status` text,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `code` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `paid` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'dfdfdfdf','ghghghgh','uyuyuyuy',NULL,NULL,'ght@ghj.co','806117',1,234,'yuyuyuyu',NULL,'2018-10-21 21:18:42'),(2,'ghghghgh','Miracle0403','Miracle Lawrence ','no','active','mify1@yahoo.com','8061179366',12,234,'$2a$10$maeCIK0AaefpxoQ9oT3Di.5XD0nFBlWVt0ckg1NpUOAKUuafIqvWq',NULL,'2018-10-21 21:24:10'),(3,'Miracle0403','Donblas ','Uchechi munonye ','no','active','donmunonye@gmail.com','8116848710',0,234,'$2a$10$ZIe5.gKYQkHsvwIcxOphqekx0qXWYFRUwlTRnpiVp9fSBws65mmbO',NULL,'2018-10-23 05:57:45'),(4,'Miracle0403','Chidoz01','Chidozie Lawrence','no','active','emmasco007@yahoo.com','8035015722',2,234,'$2a$10$YZoe2YiC24YJ1L.1HvbN8eJjB8Zsov0FlN.E1WPYXde7XATcc8c7e',NULL,'2018-10-23 09:44:43'),(5,'Chidoz01','Onyiluvy','Onyinyechi Nwone','no','active','onyinwone@yahoo.com','8137733118',1,234,'$2a$10$liO1FVe8rMh1KJpik/judOZvFMo0SZz1mxpa2AAXPCuVjxrwyOkIa',NULL,'2018-10-23 09:51:17'),(6,'Miracle0403','Zarrinah','Nduka C Queen','no','active','Ndukaqueen25@gmail.com','7038915835',0,234,'$2a$10$gK.q6NFmpv9dO8TKAXN5j.LzjRvHoEtotkgI68.Gg0XXdJFv3ujjq',NULL,'2018-10-23 12:30:40'),(7,'Miracle0403','Kelydon123','Onwuka Kelechi Collins ','no','active','onwukakelechi@gmail.com','08080661276',1,234,'$2a$10$cqRba0iPDLcfaNe98w.NcOVqpeDn08CvDbqzjWVBPS8vYtxPCmUVe',NULL,'2018-10-23 18:36:01'),(8,'Miracle0403','Muzanich','Miracle Lawrence ','no','active','lawrencehope59@gmail.com','8132549296',1,234,'$2a$10$j4WVtJCNGTk5WV9K/zL/t.HmuuYbvuVjnYLYgStf2CuanTstHV1x6',NULL,'2018-10-24 20:39:08'),(9,'Muzanich','special1','Chibuzo Madubuike','no','active','geniuzmadubuike1010@gmail.com','8068966124',0,234,'$2a$10$HgPf4e0u/BVebIekqJtkQ.ASQvGisGBObdBqhhEd2Z.YLHm3991Ce',NULL,'2018-10-24 20:52:29'),(10,'Onyiluvy','Ifeysamuel ','Ifeanyi Samuel ','no','active','Ifeysamuel@yahoo.com','08034465506',0,234,'$2a$10$3Rnkc3Sm4pZJW.NkMJxDNun3WUdQEPsdSN691Vw0RGBV4YQ1tZTuC',NULL,'2018-10-27 09:50:32'),(11,'Miracle0403','Gideonukonu','Gideon Njoku Ukonu','no','active','gideonnjokujnr@gmail.com','08160206880',0,234,'$2a$10$WlRvizERmm7PQZLQLHoHru./rIc99BeDb4tvaG.InBs.vCegXGTM2',NULL,'2018-10-27 11:05:49'),(12,'Miracle0403','moshoba77','Israel mayowa','no','active','Idikanmoshoba@gmail.com','08037521177',0,234,'$2a$10$jT6sgttX7WzJ8jToVrGYlOedlZRsUbkinVcVSZEo7Oct5.rcvSAxm',NULL,'2018-10-28 13:50:21'),(13,'Miracle0403','Great Oak ','Samuel Chikezie ','no','active','iquo74@gmail.com','8037308186',0,234,'$2a$10$ZmMMkGI1w2msSqqClThA3uNu6diT9ZyjLkPqr6rSLvv74qxK3CE0m',NULL,'2018-10-29 07:19:11'),(14,'Miracle0403','BBSPICE ','Nwankwo Blessing ','no','active','lewisbbspice@gmail.com','08084285242',0,234,'$2a$10$AgxTWdK51ucEh6UXHAug0eLo9h.3l2n9OPZ12.NuE/kMZOMFTwkIi',NULL,'2018-10-30 18:24:40'),(15,'Miracle0403','hudu adamu','hudu adamu','no','active','adamu@hudu.com','08165799705',0,234,'$2a$10$h7aD3sMfo7FYqHCrxv3vYeLERbU2CGoe2WCwGNwkuP3W/ErFzB2FW',NULL,'2018-10-30 21:45:16'),(16,'Chidoz01','adamu hudu',' hudu adamu','no','active','hudu@yahoo.com','08165799705',0,234,'$2a$10$tJAl7A1gjO6TxpjK4aSFGO9DLJYqQHxers.3W9XkqzfzdAiNTyV9K',NULL,'2018-10-30 21:58:47'),(17,'Miracle0403','Asolan009','Salako Wasiu .O','no','active','adisasalako@gmail.com','07064760853',0,234,'$2a$10$y4cn.zHsEUVAziI7ti0ecO9w31KprotQOD1e1PrEm6A.yxTsHMdMa',NULL,'2018-10-31 06:43:10'),(18,'Miracle0403','Kemi4real','Oluwakemi Oluwasegun ','no','active','oluwakemioluwasegun011@gmail.com','7060972220',0,234,'$2a$10$6xkNfjU2RAYRBfQ1DRkiqu/rAWtUrPkQeMbQqnRuHVflNeTju4.2y',NULL,'2018-11-09 06:47:15'),(19,'Kelydon123','Lastdonv','Nwokocha Uchechukwu ','no','active','greathenrymiteviii@gmail.com','8065408787',0,234,'$2a$10$C1tP4Yo2ZZVDAvJ3PJE8UuG3xmJ8v7Ts6hvcClwrur/Hz3zqgnlE2',NULL,'2018-11-14 09:52:16');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tree`
--

DROP TABLE IF EXISTS `user_tree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_tree` (
  `sponsor` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `number` int(11) DEFAULT NULL,
  `feeder` varchar(255) DEFAULT NULL,
  `stage1` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tree`
--

LOCK TABLES `user_tree` WRITE;
/*!40000 ALTER TABLE `user_tree` DISABLE KEYS */;
INSERT INTO `user_tree` VALUES ('dfdfdfdf','ghghghgh',1,38,NULL,'yes','yes'),('ghghghgh','Miracle0403',2,37,0,NULL,NULL),('Miracle0403','Donblas ',35,36,0,NULL,NULL),('Miracle0403','Chidoz01',27,34,0,NULL,NULL),('Chidoz01','Onyiluvy',30,33,0,NULL,NULL),('Miracle0403','Zarrinah',25,26,0,NULL,NULL),('Miracle0403','Kelydon123',21,24,0,NULL,NULL),('Miracle0403','Muzanich',17,20,0,NULL,NULL),('Muzanich','special1',18,19,0,NULL,NULL),('Onyiluvy','Ifeysamuel ',31,32,0,NULL,NULL),('Miracle0403','Gideonukonu',15,16,0,NULL,NULL),('Miracle0403','moshoba77',13,14,0,NULL,NULL),('Miracle0403','Great Oak ',11,12,0,NULL,NULL),('Miracle0403','BBSPICE ',9,10,0,NULL,NULL),('Miracle0403','hudu adamu',7,8,0,NULL,NULL),('Chidoz01','adamu hudu',28,29,0,NULL,NULL),('Miracle0403','Asolan009',5,6,0,NULL,NULL),('Miracle0403','Kemi4real',3,4,0,NULL,NULL),('Kelydon123','Lastdonv',22,23,0,NULL,NULL);
/*!40000 ALTER TABLE `user_tree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verify`
--

DROP TABLE IF EXISTS `verify`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verify` (
  `user` varchar(255) NOT NULL,
  `status` text,
  `code` varchar(255) NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verify`
--

LOCK TABLES `verify` WRITE;
/*!40000 ALTER TABLE `verify` DISABLE KEYS */;
INSERT INTO `verify` VALUES ('Miracle0403','active','$2a$10$XdzKOZH67aLfC5go4RyOjezEehaDaVHWyfJDUOETbcbBrBpROPL5W','2018-10-21 21:24:10'),('Donblas ','active','$2a$10$tTekW6fCSWld64zHp36gBukkYQ8ZUnn3uGkKtuYcdfn5lvH.5urP6','2018-10-23 05:57:46'),('Chidoz01','active','$2a$10$IpXmsjjRA.BsrVEiJgAUw.rfWTdQzK1Br1pTkRcIF6Hp7v15CLjkK','2018-10-23 09:44:44'),('Onyiluvy','active','$2a$10$/EOe.KYWFF8gXTV4sjD4eeH0zwY.xzppSe9HK69jlmsr4ju0Jjj2G','2018-10-23 09:51:18'),('Zarrinah','active','$2a$10$8Oo6/HXP0X9DwWXH3qJhNOi0jkLqoPE7CLvTJ.x5jLWG0glNy.tsq','2018-10-23 12:30:41'),('Kelydon123','active','$2a$10$dyPtUkL7Rj7pVKeb59lSwuPda8sLkVEdQQatZ2dtrBMdmobqoln7q','2018-10-23 18:36:01'),('Muzanich','active','$2a$10$jEBzVEuY01qpW2rVIxAi/uCkXYzkeS4W1FKjNscaGGFI0o8WOaCf2','2018-10-24 20:39:08'),('special1','active','$2a$10$APEAt/NlwzAwt7yiCrZh5uceEqTIcGuf5fv6/pV6Q9R/r.PRzEQCm','2018-10-24 20:52:30'),('Ifeysamuel ','active','$2a$10$ePAu06rf4QZZqYkCj3NrtOnjF7aqIpSLaRoerZnapfpWxNal7d392','2018-10-27 09:50:33'),('Gideonukonu','active','$2a$10$eTANVzQbiOSau3ygMOi6r.q1w1mU7bSmZQJZoXyuB75Y1DCcUyLC.','2018-10-27 11:05:49'),('moshoba77','active','$2a$10$l2jIMtTJ.sXuNqqcBARVdOEPWd44Jc7CndJIFTPUw0eDn7mLjoDNO','2018-10-28 13:50:22'),('Great Oak ','active','$2a$10$dsprRZQ6GT8e6LFGN3RBXu/nINwq1P42TV8jFST9Oq2LdO7LCwxyK','2018-10-29 07:19:11'),('BBSPICE ','active','$2a$10$MA3/kvyAi9zLgwrjfuyJCemfcTGVuSmnt2JLtXHo5nSmpVVx1u.ZG','2018-10-30 18:24:40'),('hudu adamu','active','$2a$10$g6VkTER2n9eJl9.kQ96J8.IuBgtvuIxKm6je2I5Leb.MgUvb5fSvu','2018-10-30 21:45:16'),('adamu hudu','active','$2a$10$Kb8/8mSuWFrj93THi2hVTOGjJhkehkkTBabOwN7PUBd.gCSqAgeOO','2018-10-30 21:58:48'),('Asolan009','active','$2a$10$8GZd8uXHJ8MBo4r5teVXROSdP8m8zCPeoFJcIcx78L7WjPnm/frAy','2018-10-31 06:43:11'),('Kemi4real','active','$2a$10$zZmejmxX1jafBPnBaDNpn.asThbS7.hoMVKpMLSpceFLFFo.5oSNe','2018-11-09 06:47:15'),('Lastdonv','active','$2a$10$yVdFjKqYFddZTnSrSbEyhOIs1bwB4EbDBGzyDg1P6GobAKg5Nr/tW','2018-11-14 09:52:16');
/*!40000 ALTER TABLE `verify` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-17 23:11:21
