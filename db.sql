-- --------------------------------------------------------
-- Host:                         svpinfotech.co.in
-- Server version:               8.0.26-0ubuntu0.20.04.2 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table smxcs.bills
DROP TABLE IF EXISTS `bills`;
CREATE TABLE IF NOT EXISTS `bills` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `BillDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PartyType` varchar(15) NOT NULL,
  `PartyId` int unsigned NOT NULL,
  `Remarks` text,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.cities
DROP TABLE IF EXISTS `cities`;
CREATE TABLE IF NOT EXISTS `cities` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `CityName` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `CityName` (`CityName`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.consignees
DROP TABLE IF EXISTS `consignees`;
CREATE TABLE IF NOT EXISTS `consignees` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(150) NOT NULL,
  `Address` varchar(200) DEFAULT NULL,
  `Address1` varchar(200) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL,
  `Mobile` varchar(10) DEFAULT NULL,
  `GSTNo` varchar(50) DEFAULT NULL,
  `FreightCharge` decimal(10,2) NOT NULL DEFAULT '0.00',
  `BasedOn` varchar(50) NOT NULL DEFAULT 'article',
  `PaymentTerms` tinyint NOT NULL DEFAULT '2',
  `Remarks` text,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=1776 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.consignments
DROP TABLE IF EXISTS `consignments`;
CREATE TABLE IF NOT EXISTS `consignments` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `ConsignmentDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LRNumber` int unsigned NOT NULL,
  `FinancialYear` int NOT NULL,
  `ConsignorId` int unsigned NOT NULL,
  `ConsigneeId` int unsigned NOT NULL,
  `FromCityId` int unsigned NOT NULL,
  `ToCityId` int unsigned NOT NULL,
  `NoOfItems` int NOT NULL,
  `Description` varchar(150) NOT NULL,
  `ChargedWeightKgs` decimal(10,2) NOT NULL,
  `FreightCharge` decimal(10,2) NOT NULL,
  `DeliveryCharges` decimal(10,2) NOT NULL DEFAULT '0.00',
  `LoadingCharges` decimal(10,2) NOT NULL DEFAULT '0.00',
  `UnloadingCharges` decimal(10,2) NOT NULL DEFAULT '0.00',
  `Demurrage` decimal(10,2) NOT NULL DEFAULT '0.00',
  `GSTPercent` decimal(10,2) NOT NULL DEFAULT '0.00',
  `GSTAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `InvoiceNumber` varchar(50) DEFAULT NULL,
  `PaymentMode` tinyint unsigned NOT NULL DEFAULT '1',
  `OGP_Id` int unsigned DEFAULT NULL,
  `Bill_Id` int unsigned DEFAULT NULL,
  `Status` tinyint unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `unique_lrnumber` (`LRNumber`,`FinancialYear`),
  KEY `FK_consignments_cities` (`FromCityId`),
  KEY `FK_consignments_cities_2` (`ToCityId`),
  KEY `FK_consignments_ogplists` (`OGP_Id`),
  KEY `FK_consignments_consignors` (`ConsignorId`),
  KEY `FK_consignments_consignees` (`ConsigneeId`),
  KEY `FK_consignments_bills` (`Bill_Id`),
  CONSTRAINT `FK_consignments_bills` FOREIGN KEY (`Bill_Id`) REFERENCES `bills` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_consignments_cities` FOREIGN KEY (`FromCityId`) REFERENCES `cities` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_consignments_cities_2` FOREIGN KEY (`ToCityId`) REFERENCES `cities` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_consignments_consignees` FOREIGN KEY (`ConsigneeId`) REFERENCES `consignees` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_consignments_consignors` FOREIGN KEY (`ConsignorId`) REFERENCES `consignors` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_consignments_ogplists` FOREIGN KEY (`OGP_Id`) REFERENCES `ogplists` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36561 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.consignment_logs
DROP TABLE IF EXISTS `consignment_logs`;
CREATE TABLE IF NOT EXISTS `consignment_logs` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `LogDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ConsignmentId` int unsigned NOT NULL,
  `UserId` int unsigned NOT NULL,
  `Message` varchar(250) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_consignment_logs_consignments` (`ConsignmentId`),
  KEY `FK_consignment_logs_users` (`UserId`),
  CONSTRAINT `FK_consignment_logs_consignments` FOREIGN KEY (`ConsignmentId`) REFERENCES `consignments` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_consignment_logs_users` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73716 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.consignors
DROP TABLE IF EXISTS `consignors`;
CREATE TABLE IF NOT EXISTS `consignors` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(150) NOT NULL,
  `Address` varchar(200) DEFAULT NULL,
  `Address1` varchar(200) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `Pincode` varchar(10) DEFAULT NULL,
  `Mobile` varchar(10) DEFAULT NULL,
  `GSTNo` varchar(50) DEFAULT NULL,
  `FreightCharge` decimal(10,2) NOT NULL DEFAULT '0.00',
  `BasedOn` varchar(50) NOT NULL DEFAULT 'article',
  `PaymentTerms` tinyint NOT NULL DEFAULT '2',
  `Remarks` text,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=2044 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.drivers
DROP TABLE IF EXISTS `drivers`;
CREATE TABLE IF NOT EXISTS `drivers` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `DriverName` varchar(150) NOT NULL,
  `DriverPhone` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=634 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.ogplists
DROP TABLE IF EXISTS `ogplists`;
CREATE TABLE IF NOT EXISTS `ogplists` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `OGPListDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `VehicleId` int unsigned NOT NULL,
  `DriverId` int unsigned NOT NULL,
  `FromCityId` int unsigned NOT NULL,
  `ToCityId` int unsigned NOT NULL,
  `Rent` decimal(10,2) NOT NULL DEFAULT '0.00',
  `Advance` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`Id`),
  KEY `FK_ogplists_vehicles` (`VehicleId`),
  KEY `FK_ogplists_cities` (`FromCityId`),
  KEY `FK_ogplists_cities_2` (`ToCityId`),
  KEY `FK_ogplists_drivers` (`DriverId`),
  CONSTRAINT `FK_ogplists_cities` FOREIGN KEY (`FromCityId`) REFERENCES `cities` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_ogplists_cities_2` FOREIGN KEY (`ToCityId`) REFERENCES `cities` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_ogplists_drivers` FOREIGN KEY (`DriverId`) REFERENCES `drivers` (`Id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_ogplists_vehicles` FOREIGN KEY (`VehicleId`) REFERENCES `vehicles` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2445 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.options
DROP TABLE IF EXISTS `options`;
CREATE TABLE IF NOT EXISTS `options` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Option` varchar(50) NOT NULL,
  `Value` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Option` (`Option`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.sms_logs
DROP TABLE IF EXISTS `sms_logs`;
CREATE TABLE IF NOT EXISTS `sms_logs` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(250) NOT NULL,
  `error` varchar(255) DEFAULT NULL,
  `mobilenumbers` varchar(100) DEFAULT NULL,
  `msgcount` tinyint DEFAULT NULL,
  `senttime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=54056 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `Fullname` varchar(100) NOT NULL,
  `Username` varchar(100) NOT NULL,
  `UserPassword` varchar(100) NOT NULL,
  `UserRole` tinyint NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

-- Dumping structure for table smxcs.vehicles
DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE IF NOT EXISTS `vehicles` (
  `Id` int unsigned NOT NULL AUTO_INCREMENT,
  `RegNumber` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RegNumber` (`RegNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=272 DEFAULT CHARSET=utf8mb3;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
