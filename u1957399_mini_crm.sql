--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` text COLLATE utf8mb4_unicode_ci,
  `ya_disk` text COLLATE utf8mb4_unicode_ci,
  `clients` longtext COLLATE utf8mb4_unicode_ci,
  `order_date` datetime DEFAULT NULL,
  `moveon_date_geodesy` datetime DEFAULT NULL,
  `moveon_date_geodesy2` datetime DEFAULT NULL,
  `moveon_date_cadastre` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `sum` text COLLATE utf8mb4_unicode_ci,
  `payment_status` text COLLATE utf8mb4_unicode_ci,
  `work_type` text COLLATE utf8mb4_unicode_ci,
  `work_add_type` text COLLATE utf8mb4_unicode_ci,
  `work_type_other` text COLLATE utf8mb4_unicode_ci,
  `cadastre_number` text COLLATE utf8mb4_unicode_ci,
  `address` text COLLATE utf8mb4_unicode_ci,
  `status` text COLLATE utf8mb4_unicode_ci,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `is_signed` text COLLATE utf8mb4_unicode_ci,
  `navigator` text COLLATE utf8mb4_unicode_ci,
  `object_column` text COLLATE utf8mb4_unicode_ci,
  `object_fence` text COLLATE utf8mb4_unicode_ci,
  `build_notify` text COLLATE utf8mb4_unicode_ci,
  `object_creator` int(11) DEFAULT NULL,
  `object_added` datetime DEFAULT NULL,
  `object_edited` datetime DEFAULT NULL,
  `object_geodesy_userid` int(11) DEFAULT NULL,
  `object_cadastre_userid` int(11) DEFAULT NULL,
  `object_admin_userid` int(11) DEFAULT NULL,
  `object_dop_square` text COLLATE utf8mb4_unicode_ci,
  `object_dop_address` text COLLATE utf8mb4_unicode_ci,
  `object_dop_vri` text COLLATE utf8mb4_unicode_ci,
  `object_dop_build` text COLLATE utf8mb4_unicode_ci,
  `object_dop_land` text COLLATE utf8mb4_unicode_ci,
  `object_dop_walls` text COLLATE utf8mb4_unicode_ci,
  `object_dop_dest` text COLLATE utf8mb4_unicode_ci,
  `object_dop_name` text COLLATE utf8mb4_unicode_ci,
  `object_dop_note` text COLLATE utf8mb4_unicode_ci,
  `object_dop_cheat` text COLLATE utf8mb4_unicode_ci,
  `object_dop_floor` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_address` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_finish` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_walls` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_place` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_dest` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_name` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_square` text COLLATE utf8mb4_unicode_ci,
  `object_dop_sv_floor` text COLLATE utf8mb4_unicode_ci,
  `waiting_reason` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1355 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Table structure for table `objects_history`
--

DROP TABLE IF EXISTS `objects_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `objects_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` text NOT NULL,
  `check_comment` text NOT NULL,
  `posted` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3478 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Table structure for table `outlays`
--

DROP TABLE IF EXISTS `outlays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outlays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `sum` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `posted` datetime NOT NULL,
  `is_signed` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `userto_id` int(11) DEFAULT NULL,
  `posted` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `text` text,
  `task` text,
  `status` text,
  `from_object` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci,
  `login` text COLLATE utf8mb4_unicode_ci,
  `password` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci,
  `email` text COLLATE utf8mb4_unicode_ci,
  `role` text COLLATE utf8mb4_unicode_ci,
  `cal_filter` text COLLATE utf8mb4_unicode_ci,
  `is_online` text COLLATE utf8mb4_unicode_ci,
  `was_online` datetime DEFAULT NULL,
  `on_device` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
