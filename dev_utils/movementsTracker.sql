-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 01-06-2022 a las 03:23:20
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.2.27

/* SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "-06:00"; */


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `movementsTracker`
--
DROP DATABASE IF EXISTS `movementsTracker`;
CREATE DATABASE IF NOT EXISTS `movementsTracker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `movementsTracker`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `idAccount` int(11) NOT NULL AUTO_INCREMENT,
  `accountName` varchar(100) NOT NULL,
  `clientName` varchar(150) NOT NULL,
  `personInCharge` varchar(150) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `updatedAt` datetime DEFAULT current_timestamp(),
  `createdAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teamMembers`
--

CREATE TABLE IF NOT EXISTS `teamMembers` (
  `idTeamMembers` int(11) NOT NULL AUTO_INCREMENT,
  `idAccount` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `deleted` tinyint(1) DEFAULT 1,
  `updatedAt` datetime DEFAULT current_timestamp(),
  `createdAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idTeamMembers`),
  KEY `teamMembers_FK` (`idUser`),
  KEY `teamMembers_FK_1` (`idAccount`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `idRole` int(11) NOT NULL COMMENT '0 = Super User, 1 = Normal Admin, Normal User',
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `motherLastName` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `englishLevel` int(11) DEFAULT 0,
  `technicalKnowledge` varchar(500) NOT NULL,
  `urlCv` varchar(300) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `updatedAt` datetime DEFAULT current_timestamp(),
  `createdAt` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `usuarios_UN2` (`idUser`),
  UNIQUE KEY `users_UN` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`idUser`, `idRole`, `name`, `lastName`, `motherLastName`, `email`, `password`, `englishLevel`, `technicalKnowledge`, `urlCv`, `deleted`, `updatedAt`, `createdAt`) VALUES
(1, 0, 'Luismiguel', 'Ortiz', 'Alvárez', 'benito.testito@gmail.com', '$2b$10$3NbdIJmahu4LkNVrthWRJ.Le/mQ989wWVId.gGZUazaAlL3VCwQrm', 7, 'Full Stack', 'https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing', 0, '2022-05-30 22:36:48', '2022-05-29 16:40:19');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `teamMembers`
--
ALTER TABLE `teamMembers`
  ADD CONSTRAINT `teamMembers_FK` FOREIGN KEY (`idUser`) REFERENCES `users` (`idUser`),
  ADD CONSTRAINT `teamMembers_FK_1` FOREIGN KEY (`idAccount`) REFERENCES `accounts` (`idAccount`);

COMMIT;

CREATE USER 'movementsTrackerUser'@'localhost' IDENTIFIED BY '2hkBtFLGW9Fo4ccW';
GRANT ALL PRIVILEGES ON *.* TO 'movementsTrackerUser'@'localhost' WITH GRANT OPTION;
CREATE USER 'movementsTrackerUser'@'%' IDENTIFIED BY '2hkBtFLGW9Fo4ccW';
GRANT ALL PRIVILEGES ON *.* TO 'movementsTrackerUser'@'%' WITH GRANT OPTION;

ALTER USER 'movementsTrackerUser'@'localhost' IDENTIFIED WITH mysql_native_password BY '2hkBtFLGW9Fo4ccW';
ALTER USER 'movementsTrackerUser'@'%' IDENTIFIED WITH mysql_native_password BY '2hkBtFLGW9Fo4ccW';



FLUSH PRIVILEGES;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
