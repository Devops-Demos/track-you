-- MySQL dump 10.13  Distrib 5.6.22, for osx10.8 (x86_64)
--
-- Host: 127.0.0.1    Database: itrack-test
-- ------------------------------------------------------
-- Server version	5.6.25

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
-- Table structure for table `Activites`
--

DROP TABLE IF EXISTS `Activites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Activites` (
  `activity` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dept` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `owner` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `plannedstartdate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `plannedenddate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `actualstartdate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `actualenddate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `levelofachievment` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `initiativeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Activites`
--

LOCK TABLES `Activites` WRITE;
/*!40000 ALTER TABLE `Activites` DISABLE KEYS */;
/*!40000 ALTER TABLE `Activites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AppView`
--

DROP TABLE IF EXISTS `AppView`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AppView` (
  `kpiId` varchar(255) DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `viewName` varchar(255) DEFAULT NULL,
  `emphasis` tinyint(1) DEFAULT NULL,
  `sequence` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AppView`
--

LOCK TABLES `AppView` WRITE;
/*!40000 ALTER TABLE `AppView` DISABLE KEYS */;
/*!40000 ALTER TABLE `AppView` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Budget`
--

DROP TABLE IF EXISTS `Budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Budget` (
  `currency` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comments` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `upfrontcost` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `permonthcost` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `initiativeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Budget`
--

LOCK TABLES `Budget` WRITE;
/*!40000 ALTER TABLE `Budget` DISABLE KEYS */;
INSERT INTO `Budget` VALUES (NULL,NULL,1,'2016-06-21 20:17:07','2016-06-21 20:17:07',NULL,NULL,NULL);
/*!40000 ALTER TABLE `Budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Issues`
--

DROP TABLE IF EXISTS `Issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Issues` (
  `issue` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `nextsteps` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `keymilestones` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `initiativeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Issues`
--

LOCK TABLES `Issues` WRITE;
/*!40000 ALTER TABLE `Issues` DISABLE KEYS */;
/*!40000 ALTER TABLE `Issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `KPI Milestone`
--

DROP TABLE IF EXISTS `KPI Milestone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `KPI Milestone` (
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `timepoint` date DEFAULT NULL,
  `targetvalue` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `actualvalue` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `initiativeid` int(11) DEFAULT NULL,
  `parentid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`),
  KEY `initiativeid` (`initiativeid`),
  KEY `parentid` (`parentid`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KPI Milestone`
--

LOCK TABLES `KPI Milestone` WRITE;
/*!40000 ALTER TABLE `KPI Milestone` DISABLE KEYS */;
INSERT INTO `KPI Milestone` VALUES (1,'2016-06-21','85.4','80.8',12,7),(2,'2016-06-21','10.4','22.1',1,19),(3,'2016-06-21','61.1','90.3',2,9),(4,'2016-06-21','61','98.7',12,24),(5,'2016-06-21','27','21.7',8,1),(6,'2016-06-21','86.7','51.8',8,1),(7,'2016-06-21','45.4','78.3',10,28),(8,'2016-06-21','82.4','14.6',10,28),(9,'2016-06-21','17.7','21.7',9,23),(10,'2016-06-21','96.9','71.3',1,1),(11,'2016-06-21','45.6','21.2',5,20),(12,'2016-06-21','22.6','2.9',4,29),(13,'2016-06-21','89.2','85.2',5,20),(14,'2016-06-21','20.7','2.4',5,18),(15,'2016-06-21','12.3','72.4',10,30),(16,'2016-06-21','4.1','71.1',3,16),(17,'2016-06-21','23.5','87.5',1,4),(18,'2016-06-21','36.1','70.9',8,1),(19,'2016-06-21','79.1','51.9',5,26),(20,'2016-06-21','33.1','82.9',12,14),(21,'2016-06-21','69.8','25',1,22),(22,'2016-06-21','41.1','44.3',12,14),(23,'2016-06-21','77.1','36.6',13,11),(24,'2016-06-21','84.2','57.8',13,11),(25,'2016-06-21','19.5','69.2',10,30),(26,'2016-06-21','18.6','55.7',4,3),(27,'2016-06-21','11.9','17.4',1,12),(28,'2016-06-21','47.1','71.3',2,2),(29,'2016-06-21','43.7','28.4',4,21),(30,'2016-06-21','7.4','44.2',12,7),(31,'2016-06-21','77.9','2.2',2,2),(32,'2016-06-21','52.2','60.2',4,3),(33,'2016-06-21','7.1','70.9',2,9),(34,'2016-06-21','78.7','46.4',13,5),(35,'2016-06-21','21','27',4,29),(36,'2016-06-21','63.7','58.6',3,16),(37,'2016-06-21','62.6','1.6',10,30),(38,'2016-06-21','7.6','23.6',1,22),(39,'2016-06-21','0.1','29.3',13,27),(40,'2016-06-21','28.1','60.9',4,3),(41,'2016-06-21','57','52.9',5,26),(42,'2016-06-21','99.3','37.1',10,10),(43,'2016-06-21','22.3','11.7',5,18),(44,'2016-06-21','1.7','4.8',5,18),(45,'2016-06-21','75.3','93',4,21),(46,'2016-06-21','42.7','0.2',13,11),(47,'2016-06-21','53.3','75.6',4,15),(48,'2016-06-21','38.5','50.5',1,12),(49,'2016-06-21','80.3','79.3',4,29),(50,'2016-06-21','76.6','17.4',3,16),(51,'2016-06-21','25.2','31.8',13,27),(52,'2016-06-21','70','42.9',8,13),(53,'2016-06-21','59.8','57.3',10,28),(54,'2016-06-21','67.8','38.7',4,21),(55,'2016-06-21','64.9','0.2',1,4),(56,'2016-06-21','81.4','79.1',2,9),(57,'2016-06-21','85.6','76.6',4,29),(58,'2016-06-21','51.5','2.3',8,25),(59,'2016-06-21','47.9','1.2',8,25),(60,'2016-06-21','0.6','79.8',10,30),(62,NULL,'123456',NULL,1,1),(63,NULL,'123456',NULL,1,1),(64,'2026-04-04','10','20',5,18),(65,'2026-04-01','12','30',5,18);
/*!40000 ALTER TABLE `KPI Milestone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Risk`
--

DROP TABLE IF EXISTS `Risk`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Risk` (
  `risk` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `nextsteps` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `keymilestones` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `initiativeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Risk`
--

LOCK TABLES `Risk` WRITE;
/*!40000 ALTER TABLE `Risk` DISABLE KEYS */;
/*!40000 ALTER TABLE `Risk` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activitycount`
--

DROP TABLE IF EXISTS `activitycount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activitycount` (
  `initiativeId` int(11) DEFAULT NULL,
  `completed` int(11) DEFAULT NULL,
  `delayed` int(11) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `ontrack` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitycount`
--

LOCK TABLES `activitycount` WRITE;
/*!40000 ALTER TABLE `activitycount` DISABLE KEYS */;
INSERT INTO `activitycount` VALUES (NULL,7,1,1,'2016-06-21 20:17:19','2016-06-21 20:17:19',1),(NULL,7,1,2,'2016-06-21 20:17:20','2016-06-22 10:03:23',1),(NULL,1,0,3,'2016-06-21 20:17:20','2016-06-22 10:03:23',0),(NULL,2,0,4,'2016-06-21 20:17:20','2016-06-22 10:03:23',1),(NULL,0,1,5,'2016-06-21 20:17:20','2016-06-21 20:17:20',0),(NULL,1,0,6,'2016-06-21 20:17:20','2016-06-21 20:17:20',0),(NULL,3,0,7,'2016-06-21 20:17:20','2016-06-21 20:17:20',0),(NULL,1,0,8,'2016-06-21 20:17:20','2016-06-21 20:17:20',0),(NULL,2,0,9,'2016-06-21 20:17:20','2016-06-21 20:17:20',0),(NULL,0,1,10,'2016-06-21 20:17:20','2016-06-21 20:17:20',0),(NULL,1,0,11,'2016-06-21 20:17:20','2016-06-21 20:17:20',0),(NULL,1,0,12,'2016-06-21 20:17:20','2016-06-21 20:17:20',1),(NULL,NULL,NULL,13,'2016-06-22 10:03:23','2016-06-22 10:03:23',NULL),(NULL,NULL,NULL,14,'2016-06-22 10:03:23','2016-06-22 10:03:23',NULL);
/*!40000 ALTER TABLE `activitycount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appViews`
--

DROP TABLE IF EXISTS `appViews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appViews` (
  `kpiId` int(11) DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `emphasis` tinyint(1) DEFAULT NULL,
  `sequence` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `viewname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appViews`
--

LOCK TABLES `appViews` WRITE;
/*!40000 ALTER TABLE `appViews` DISABLE KEYS */;
INSERT INTO `appViews` VALUES (NULL,1,NULL,NULL,'2016-06-21 20:17:09','2016-06-21 20:17:09',NULL);
/*!40000 ALTER TABLE `appViews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evidence`
--

DROP TABLE IF EXISTS `evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evidence` (
  `title` varchar(1023) COLLATE utf8_unicode_ci DEFAULT NULL,
  `link` varchar(4096) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `initiativeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`),
  KEY `initiativeid` (`initiativeid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidence`
--

LOCK TABLES `evidence` WRITE;
/*!40000 ALTER TABLE `evidence` DISABLE KEYS */;
INSERT INTO `evidence` VALUES ('test1','',1,'2016-07-04 16:06:43','2016-07-04 16:06:43',2),('test1','',2,'2016-07-04 16:09:24','2016-07-04 16:09:24',2);
/*!40000 ALTER TABLE `evidence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `executivesummary`
--

DROP TABLE IF EXISTS `executivesummary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `executivesummary` (
  `accomplishments` longtext COLLATE utf8_unicode_ci,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `sectorsummary` longtext COLLATE utf8_unicode_ci,
  `decisionsrequired` longtext COLLATE utf8_unicode_ci,
  `majorissues` longtext COLLATE utf8_unicode_ci,
  `proposedsolution` longtext COLLATE utf8_unicode_ci,
  `plannedactivities` longtext COLLATE utf8_unicode_ci,
  `keyperformancedrivers` longtext COLLATE utf8_unicode_ci,
  `sectorreformactivities` longtext COLLATE utf8_unicode_ci,
  `initiativeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `executivesummary`
--

LOCK TABLES `executivesummary` WRITE;
/*!40000 ALTER TABLE `executivesummary` DISABLE KEYS */;
/*!40000 ALTER TABLE `executivesummary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `initiative`
--

DROP TABLE IF EXISTS `initiative`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `initiative` (
  `description` longtext COLLATE utf8_unicode_ci,
  `details` longtext COLLATE utf8_unicode_ci,
  `dept` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `artifactsUpdatedAt` datetime DEFAULT NULL,
  `status` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `initiativeid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parentid` int(11) DEFAULT NULL,
  `title` varchar(4096) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avgachievmentlevel` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `plannedstartdate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `plannedenddate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `actualstartdate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `actualenddate` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `activitycount` int(11) DEFAULT NULL,
  `priorityachievementtargetratio` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`initiativeid`),
  KEY `owner` (`owner`),
  KEY `parentid` (`parentid`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `initiative`
--

LOCK TABLES `initiative` WRITE;
/*!40000 ALTER TABLE `initiative` DISABLE KEYS */;
INSERT INTO `initiative` VALUES (NULL,NULL,NULL,NULL,NULL,NULL,'master','2016-06-21 20:17:07','2016-06-21 20:17:20',0,-1,'Master',NULL,NULL,NULL,NULL,NULL,1,NULL),('Rati apconrik kol ijsob repet girud widsi zuzowo taf aci pohgak cucrekac za apca kozu he.','Zanafo owiut ehire gedladza ava dozifbi rawi ce ja luvaw jondo bol si.','A',9,'2016-06-22 10:03:24',NULL,'Priority','2016-06-21 20:17:07','2016-06-22 10:03:24',1,0,'Priority 1 (Evicid Extension)',NULL,NULL,NULL,NULL,NULL,14,NULL),('To zetvu agoikkat co kika od irutoblos fapi hijejaomo onuzikbon civasev apcapji naajihoz habtomjud ur abeafo.','Iza alani gas wunbu zajadbuw dob kafefje nazic vo ikidalec nesciweg de logcili.','B',9,'2016-06-21 20:17:07',NULL,'Priority','2016-06-21 20:17:07','2016-06-21 20:17:20',2,0,'Priority 2 (Beodu Boulevard)',NULL,NULL,NULL,NULL,NULL,2,'0.2434334322864698'),('Zanakjem gumvobza ojmi da uluvelur goco jivfuiv zi wi ubrilmu jet occogegi ruef fu pareku aboissi hurribo.','Woheba vibogpij larbo ser hif kak zo lororap pi ornul kugbecki wadrowib buhfe ze.','A',8,'2016-06-21 20:17:07',NULL,'Priority','2016-06-21 20:17:07','2016-06-22 10:03:23',3,0,'Priority 3 (Odsak Plaza)',NULL,NULL,NULL,NULL,NULL,13,NULL),('Dokapis ipwo vicok vehrik guv ih oniriz podeab fu jibite muaf dekoc fodu nofloke luh vuj jug.','Hidwi aha uviv kuzdi juhfulik obikukbur bu cahbi cosju de fifujdab wa ib komlon ka uzah.','C',11,'2016-06-21 20:17:07',NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',4,2,'Initiative 4 (Refuh River)',NULL,NULL,NULL,NULL,NULL,3,'0.7079062623007955'),('Sugaj udabesu pa noaw pa makuzoj sirnesbav jafjij revva mouku emguc kadse supfilko tuctuom lawaz ufauro hovragfu kiwgih.','Mumak sulodwi du sezeg suzi pachuzbe vu cuslorep to adego neasgut nullezod cerpo fugo.','B',6,'2016-06-21 20:17:07',NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',5,2,'Initiative 5 (Cacbon View)',NULL,NULL,NULL,NULL,NULL,4,'-0.12384145216194457'),('Sekciso kewesuzav fotutle ib gushevoc eh jifdo rih iktir su sicureete igewudez ope awalo toccon jag foj.','Otditfu huc ze wijmitgu valofev wu jefiho jazepne cankadoh opboir bititwes ne.','B',4,NULL,NULL,'Initiative','2016-06-21 20:17:07','2016-06-22 10:11:44',6,2,'Initiative 6 (Revij Turnpike)',NULL,NULL,NULL,NULL,NULL,5,'NaN'),('Obupaf rurhebfa raj ci uzo zernit jucije vof co aztudjot jamon zegi.','Fejugwof vulor guf uvi bauwa nimwu mev vi fag ki odudegen omci pa ozfenoni hav zod ruwwo.','A',4,NULL,NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',7,2,'Initiative 7 (Zasup Heights)',NULL,NULL,NULL,NULL,NULL,6,'NaN'),('Vuf cusoda cej makku nuvarari awizu silziw ho badum mamaluk ijidi namaij.','Egeg meklilu ode norwih lesga afwam irejaji pi ucueg fobjiveg wamadat tin tuvlisci.','A',14,'2016-06-22 10:03:23',NULL,'initiative','2016-06-21 20:17:07','2016-06-22 10:03:23',8,2,'Initiative 8 (Wiow Pass)',NULL,NULL,NULL,NULL,NULL,7,'-0.4988390550018456'),('Beraco ku fi firpicri nojsup uplecol gu guovsaf cis pa jidowgub poc burwilaz gaggebo.','Resu ega mamuwaha gi ap zi taguw niduz siho awi kivdiztu dibmisbu ceh ov oti.','C',8,'2016-06-21 20:17:07',NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',9,8,'Initiative 9 (Fetnuv Way)',NULL,NULL,NULL,NULL,NULL,8,'0.796437659033079'),('Pamapcus fu mijtackuw nehga co kewivte mes ke be diw fin meilno fa zoszo usta wu mujajo.','Geki fa oco kezeg vodukmi omipohko vufusu zu elgum zanep gob oz ugeozag vifo.','C',2,'2016-06-21 20:17:07',NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',10,8,'Initiative 10 (Nudut Court)',NULL,NULL,NULL,NULL,NULL,9,'1.3359100852327241'),('Or ji oghaler fagi atenemi ukme umha boogo nogul mileih ca linje bewhu.','Riukemi it vihpaszah jogeva til ja kunej eke ed jegvikle sevjinmow winorot wohpo niv.','A',3,NULL,NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',11,6,'Initiative 11 (Pelu Avenue)',NULL,NULL,NULL,NULL,NULL,10,'NaN'),('Tukwipuze hebidpod ma osoju vace vaz huhvekter do ehuum bafescu teonu vutfipi iviwot.','Jig camihelis pa kuh wiloh ciz ise evirekha zijutuvi rioh ohodekej fiok pubej tivif ihduk nu.','A',2,'2016-06-21 20:17:07',NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',12,5,'Initiative 12 (Cehsi Drive)',NULL,NULL,NULL,NULL,NULL,11,'-0.276933599722607'),('Judtudu gugzi hucu jabaizu refoojo mutuj ra cafarik he zadvo doz ujohen huozhuz.','Baguhu jimikgad casullo jathakag fuzuza ila ug egwo gacguce gililu ejabam evoaz di vi tutpo gog cutep.','B',10,'2016-06-21 20:17:07',NULL,'initiative','2016-06-21 20:17:07','2016-06-21 20:17:20',13,5,'Initiative 13 (Jembik Plaza)',NULL,NULL,NULL,NULL,NULL,12,'0.06955053405892084'),(NULL,NULL,NULL,6,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',14,10,'Acitvity 14 (Zope Turnpike)',NULL,'06/28/16','07/07/16','06/16/16','05/28/16',NULL,NULL),(NULL,NULL,NULL,2,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',15,7,'Acitvity 15 (Sacek Lane)',NULL,'07/18/16','09/08/16','08/21/16','08/28/16',NULL,NULL),(NULL,NULL,NULL,5,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',16,12,'Acitvity 16 (Wuji Boulevard)',NULL,'07/17/16','08/30/16','08/31/16','09/19/16',NULL,NULL),(NULL,NULL,NULL,7,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',17,13,'Acitvity 17 (Idfo Square)',NULL,'07/14/16','09/18/16','09/17/16','10/29/16',NULL,NULL),(NULL,NULL,NULL,5,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',18,13,'Acitvity 18 (Kodi Mill)',NULL,'06/25/16','07/19/16','07/05/16','07/11/16',NULL,NULL),(NULL,NULL,NULL,8,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',19,7,'Acitvity 19 (Emufuj Ridge)',NULL,'07/18/16','08/31/16','07/25/16','07/05/16',NULL,NULL),(NULL,NULL,NULL,11,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',20,4,'Acitvity 20 (Galwir Turnpike)',NULL,'07/14/16','09/17/16','08/23/16','09/09/16',NULL,NULL),(NULL,NULL,NULL,7,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',21,13,'Acitvity 21 (Kolem Ridge)',NULL,'06/05/16','06/24/16','05/18/16','05/16/16',NULL,NULL),(NULL,NULL,NULL,8,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',22,7,'Acitvity 22 (Netheg Center)',NULL,'07/06/16','08/27/16','08/07/16','08/24/16',NULL,NULL),(NULL,NULL,NULL,14,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',23,11,'Acitvity 23 (Unowe Street)',NULL,'05/30/16','06/16/16','06/25/16','08/12/16',NULL,NULL),(NULL,NULL,NULL,1,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',24,9,'Acitvity 24 (Zovi Way)',NULL,'06/20/16','07/17/16','06/03/16','05/18/16',NULL,NULL),(NULL,NULL,NULL,5,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',25,7,'Acitvity 25 (Pofito Terrace)',NULL,'07/08/16','08/16/16','08/19/16','09/13/16',NULL,NULL),(NULL,NULL,NULL,3,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',26,10,'Acitvity 26 (Wosrow Boulevard)',NULL,'07/06/16','08/24/16','08/25/16','09/29/16',NULL,NULL),(NULL,NULL,NULL,10,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',27,10,'Acitvity 27 (Eloku Court)',NULL,'06/06/16','06/28/16','05/23/16','05/24/16',NULL,NULL),(NULL,NULL,NULL,13,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',28,13,'Acitvity 28 (Binjew Pass)',NULL,'06/21/16','07/21/16','07/24/16','08/26/16',NULL,NULL),(NULL,NULL,NULL,6,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',29,7,'Acitvity 29 (Mitez Ridge)',NULL,'06/11/16','07/03/16','05/21/16','05/10/16',NULL,NULL),(NULL,NULL,NULL,1,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',30,13,'Acitvity 30 (Papem Way)',NULL,'07/17/16','08/16/16','08/16/16','08/20/16',NULL,NULL),(NULL,NULL,NULL,10,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',31,4,'Acitvity 31 (Kulob Highway)',NULL,'05/22/16','05/12/16','04/19/16','04/16/16',NULL,NULL),(NULL,NULL,NULL,3,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',32,9,'Acitvity 32 (Giod Street)',NULL,'06/29/16','08/09/16','08/13/16','09/19/16',NULL,NULL),(NULL,NULL,NULL,3,NULL,NULL,'activity','2016-06-21 20:17:07','2016-06-21 20:17:09',33,12,'Acitvity 33 (Hucu Plaza)',NULL,'07/06/16','08/10/16','07/02/16','06/13/16',NULL,NULL),(NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2016-06-21 21:23:46','2016-06-21 21:23:46',35,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(NULL,NULL,NULL,1,NULL,NULL,NULL,'2016-06-22 10:03:23','2016-06-22 10:03:23',36,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `initiative` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `initiative_participants__user_participatedinitiatives`
--

DROP TABLE IF EXISTS `initiative_participants__user_participatedinitiatives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `initiative_participants__user_participatedinitiatives` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `initiative_participants` int(11) DEFAULT NULL,
  `user_participatedInitiatives` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `initiative_participants__user_participatedinitiatives`
--

LOCK TABLES `initiative_participants__user_participatedinitiatives` WRITE;
/*!40000 ALTER TABLE `initiative_participants__user_participatedinitiatives` DISABLE KEYS */;
INSERT INTO `initiative_participants__user_participatedinitiatives` VALUES (1,6,11),(2,2,9);
/*!40000 ALTER TABLE `initiative_participants__user_participatedinitiatives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kpi`
--

DROP TABLE IF EXISTS `kpi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kpi` (
  `kpi` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `uom` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `baseline` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `target` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `widget` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `sno` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `kpitype` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parentkpi` int(11) DEFAULT NULL,
  `hasdrilldown` tinyint(1) DEFAULT NULL,
  `iscalculated` tinyint(1) DEFAULT NULL,
  `statusseparator1` float DEFAULT NULL,
  `statusseparator2` float DEFAULT NULL,
  `initiativeid` int(11) DEFAULT NULL,
  PRIMARY KEY (`sno`),
  KEY `parentkpi` (`parentkpi`),
  KEY `initiativeid` (`initiativeid`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kpi`
--

LOCK TABLES `kpi` WRITE;
/*!40000 ALTER TABLE `kpi` DISABLE KEYS */;
INSERT INTO `kpi` VALUES ('KPI sno (1) bogup','mah','18.4','2.45','bignumber',NULL,1,'Gizor ri hourume apu ho jivpuw ivirunvuk ruk jajmi olkuduvi nikwozja rebiw dikjo kasjedpo nu.','2016-06-21 20:17:10','2016-06-22 10:03:23','output',NULL,NULL,NULL,3.75,12.1,8),('KPI sno (2) le','mu','0.55','48.85','dial',NULL,2,'Ala bopfalwap ne ve peil wif dapilos fiiju jasfa feziobi ner samdimel efuawuubo samtuni baiki ugoni.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,31.3,44.1,2),('KPI sno (3) gimjeak','opb','39.55','37.7','bignumber',NULL,3,'Adji hoz okaivnu kote kivih pozujve tobutek we uksicti ehugoko uwofe bojaaba zanuf zupomfo vohisewag bo.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,6.3,48.45,4),('KPI sno (4) ha','jow','35.15','38','bignumber',NULL,4,'Peztos fevhi tobvudo rukze cedpej um moj puh undusabo osevod fuwjufoz avocu uc beno igwun opu.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,33.35,10.6,1),('KPI sno (5) homfeti','ged','47.7','18.65','bignumber',NULL,5,'Ega hahikpum errulob je ga rilizu veeklep aletisog ka avicozjuc bijujatu miugizeg.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,1.15,45.3,13),('KPI sno (6) mufu','fae','48.3','47.2','bignumber',NULL,6,'Adu debpisen joveppep taimu rawonov hojrurfo urane hok furto duribal decdaezu razdukti ug duzakku sepfo goluow zanipu.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,39.3,45.9,3),('KPI sno (7) lac','agf','26.65','15.95','bignumber',NULL,7,'Za te nooboefi bagelu si iti hi bem at pudgosul coj zuv zoj coj bafege doze zoca mumbus.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,6.15,26.5,12),('KPI sno (8) fowum','jor','40.85','4.45','barometer',NULL,8,'Uran buj zu ef hovumwa ezahe ti coble vezlamle fetretfeh lir in om.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,9.95,12.15,3),('KPI sno (9) va','lu','36','29.9','bignumber',NULL,9,'Cu olepi gop sufagri fogvokhok ekfenic imipatot jaze wul vapu at oh vapsujag funjufta esligi.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',3,NULL,NULL,28.45,32.4,2),('KPI sno (10) bo','count','7.55','9.3','barometer',NULL,10,'Zirulfo ha ibu igvutgif citvukon oje fa bebifag sopik hubjodris sovu labukmor.','2016-06-21 20:17:10','2016-06-22 10:03:23','output',1,NULL,NULL,17.55,6.35,NULL),('KPI sno (11) suoke','awe','30.4','38.1','bignumber',NULL,11,'Biron ihiet tu ehhar tis zagda gekvoj gi ofofiffa vubueri ec bug ecfa babewaz vupnojar.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,19,32.6,13),('KPI sno (12) ovmovjo','lam','2.6','32.95','dial',NULL,12,'Fuzhav ajave uzici tone tetlesugo loja zir fum novdavew fuz ipi evu weskaj babvugar.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,0.95,15.55,1),('KPI sno (13) tat','apu','10','2.1','barometer',NULL,13,'Ran fehopu howikini netwi le giwon mob dobotru mu jisapi tapob kefi ubcov zicata desor hem kem gerge.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,37.55,36.2,8),('KPI sno (14) gudtup','sik','43.45','47.15','dial',NULL,14,'Mame mif agumo ja kahkeh zumouhu pivulek bi gew tita ucoik mam co.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,36.45,50.3,12),('KPI sno (15) wukbocmir','ud','10.6','23.75','bignumber',NULL,15,'Pebopav waz ewu ju juclus uluzu balu hew ar ginar aftalot savrok vuwu jamih do nimirju kotgiv vofaru.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,18.3,43.45,4),('KPI sno (16) zopeh','ro','21.85','15.05','bignumber',NULL,16,'Gihtojnul lezfib pi ko piuk lowzam mihredapu uf letin ukabi enifed tiwipegog.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,39.15,20.6,3),('KPI sno (17) tionce','ver','18.2','44.05','barometer',NULL,17,'Poja folweren dem ilinizpoh huhin di zenruteno fe woj jopfof zi pekza zudad.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,19.6,1.35,12),('KPI sno (18) kotun','noh','38.2','15.3','dial',NULL,18,'Kimsome gat rowapji in kepsikpor umufeto latlabpar kospo ihve tobe voci be roloripa lagcimrud bag hovicsop ji.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,44.15,24.05,5),('KPI sno (19) hu','jig','46.55','49.1','dial',NULL,19,'Jizpowkep irle ijepog mo ke vandu lis lirwicso ni bihevsiw fowu gapo.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,8.45,49.55,1),('KPI sno (20) etefi','pih','39.55','26.1','dial',NULL,20,'Cancipmit rowze nedmuk zori nasifbed gumiwe mizufol asropuwi ehi hivlofa cev alo fakim horda zar tede.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,29.05,39.45,5),('KPI sno (21) moaz','ota','26.05','6.35','dial',NULL,21,'Vejoc boj dof bom lew wutriklut zu hecvum ep suhido hegbamor wa pe ovasemah ced ha.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,8.05,36.9,4),('KPI sno (22) dutuj','koz','37.95','25.35','dial',NULL,22,'Julmek pacavi gor gobiw dirog nulicja bevel junitar pezobo wu dupnoleh bak posuawu raafuv pak tugmav hiel.','2016-06-21 20:17:10','2016-06-21 20:17:10','outcome',NULL,NULL,NULL,21.95,11.65,1),('KPI sno (23) pewo','ima','37.35','39.45','bignumber',NULL,23,'Tufudfaj modo nivok rojdeer kof laszizog efolene kinajroj rulpirar ipesulen giji bu keg akorigcaf gu pifleg oredofo.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,46.15,43.35,9),('KPI sno (24) ijoco','dom','12.8','23.7','dial',NULL,24,'Sac kaf nohvinmol cog fud he ifolu cagda casembo adeffi afoko tapaj olo.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,45.95,48.5,12),('KPI sno (25) olne','lok','37.15','1.9','dial',NULL,25,'Fejuz ketali ofeabbew faz lewihhi ma un ra wawi wocfiil suphic sube.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,46,30.55,8),('KPI sno (26) je','ara','8.3','35.85','barometer',NULL,26,'Osecizuk kugu gopitoboc tew ujuzopoj hif asostu kagah retavdi deaca gifef kemzuguw heviri kez upi.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,19.55,6.25,5),('KPI sno (27) jehijona','vab','33.2','5.75','barometer',NULL,27,'Epi veciwpon nosdebwu ha adwevaha mohav inji za gokowhu id wo pobbenhad ruhwetu uhzot pimihcu mipmo waumo gadowof.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,22.85,7.95,13),('KPI sno (28) pogig','pou','30','31.4','barometer',NULL,28,'Zizogfak duvlivku zijevfa gehig nonaj kekavuj ipuetanoz haha jatoh ugur fevta lagholoj es jivippo fihwadis.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,29.2,4.75,10),('KPI sno (29) mejfovwo','ol','43.4','30.65','bignumber',NULL,29,'Naded vo uvu ce ej cewmimla wadoro umakunpiv ewoked fotlake eku ninitenu miztipika zekoz hoil zasavgi topuh.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,2.45,28.65,4),('KPI sno (30) gin','dav','40.1','30.55','dial',NULL,30,'Jevzibpo cobosaro nisufekib onfe vilet wivos okuojezak mebasi daheduw isu jofa mu usugam.','2016-06-21 20:17:10','2016-06-21 20:17:10','output',NULL,NULL,NULL,44.3,9.05,10),('test','count',NULL,NULL,NULL,NULL,32,NULL,'2016-06-22 10:03:23','2016-06-22 10:03:23',NULL,1,NULL,NULL,NULL,NULL,NULL),('test','count',NULL,NULL,NULL,NULL,33,NULL,'2016-06-22 10:03:24','2016-06-22 10:03:24',NULL,1,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `kpi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `mainfield` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(255) COLLATE utf8_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('6OF6IRjslYJ72geFnoRuVYfAvcDs--z_',1466522254,'{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2016-06-21T15:17:33.876Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1},\"csrfSecret\":\"LOuqzXHJoOjVgsHUx1M3mHsN\"}'),('Zs2u51fxSo3NePsRjuiHqric-Rl-eme4',1466572306,'{\"cookie\":{\"originalMaxAge\":1800000,\"expires\":\"2016-06-22T05:11:45.980Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1},\"csrfSecret\":\"W4-lu5kakeJFZKB9R5J-rXRN\",\"_garbage\":\"Wed Jun 22 2016 10:11:44 GMT+0530 (IST)\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `ispasswordreset` tinyint(1) DEFAULT NULL,
  `temppassword` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `viewall` tinyint(1) DEFAULT NULL,
  `updatealloutcomekpis` tinyint(1) DEFAULT NULL,
  `updatealloutputkpis` tinyint(1) DEFAULT NULL,
  `updateallissuelogs` tinyint(1) DEFAULT NULL,
  `updateallactivities` tinyint(1) DEFAULT NULL,
  `updateallexecutivesummaries` tinyint(1) DEFAULT NULL,
  `crudartifacts` tinyint(1) DEFAULT NULL,
  `crudusers` tinyint(1) DEFAULT NULL,
  `viewparentage` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('admin@test.com','Admin','Test','A','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',1,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,1,1,1,1,1,1,1,1,0),('user1@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',2,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,0,0,1,0),('user2@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',3,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,0,1,0,0),('user3@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',4,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,1,0,0,0),('user4@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',5,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,1,0,0,0,0),('user5@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',6,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,1,0,0,0,0,0),('user6@test.com','User','C','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',7,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,1,0,0,0,0,0,0),('user7@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',8,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,1,0,0,0,0,0,0,0),('user8@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',9,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,1,0,0,0,0,0,0,0,0),('general@test.com','User','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',10,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,0,0,0,0),('metwe@zi.co.uk','Jay Peters','A','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',11,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,0,0,0,0),('fupcuti@osrom.io','Leroy Schneider','C','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',12,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,0,0,0,0),('cap@jacis.io','Lora Mann','B','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',13,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,0,0,0,0),('sufzojoj@bup.com','Andre Higgins','C','user','$2a$10$Z0qv2EnPI.qgNzhPSGH8y.gVTas7qzS1CG7cPlZmIfjkyYlmVa5pu',14,'2016-06-21 20:17:10','2016-06-21 20:17:11',0,NULL,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-07-07 16:43:11
