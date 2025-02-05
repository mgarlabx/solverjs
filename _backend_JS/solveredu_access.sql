DROP TABLE IF EXISTS `solveredu_access`;

CREATE TABLE `solveredu_access` (
  `app` varchar(50) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `date` date NOT NULL,
  `count` int(11) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`app`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
