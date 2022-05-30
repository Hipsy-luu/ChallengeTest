-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 30-05-2022 a las 23:06:51
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `movementsTracker`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `accounts`
--

CREATE TABLE `accounts` (
  `idAccount` int(11) NOT NULL,
  `accountName` varchar(100) NOT NULL,
  `clientName` varchar(150) NOT NULL,
  `personInCharge` varchar(150) NOT NULL,
  `deleted` tinyint(1) DEFAULT 0,
  `updatedAt` datetime DEFAULT current_timestamp(),
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teamMembers`
--

CREATE TABLE `teamMembers` (
  `idTeamMembers` int(11) NOT NULL,
  `idAccount` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `deleted` tinyint(1) DEFAULT 1,
  `updatedAt` datetime DEFAULT current_timestamp(),
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
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
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`idUser`, `idRole`, `name`, `lastName`, `motherLastName`, `email`, `password`, `englishLevel`, `technicalKnowledge`, `urlCv`, `deleted`, `updatedAt`, `createdAt`) VALUES
(1, 2, 'Luismiguel', 'Ortiz', 'Alvárez', 'luismi.luu@gmail.com', '$2b$10$3NbdIJmahu4LkNVrthWRJ.Le/mQ989wWVId.gGZUazaAlL3VCwQrm', 7, 'Full Stack', 'https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing', 0, '2022-05-29 16:40:19', '2022-05-29 16:40:19');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`idAccount`);

--
-- Indices de la tabla `teamMembers`
--
ALTER TABLE `teamMembers`
  ADD PRIMARY KEY (`idTeamMembers`),
  ADD KEY `teamMembers_FK` (`idUser`),
  ADD KEY `teamMembers_FK_1` (`idAccount`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `usuarios_UN2` (`idUser`),
  ADD UNIQUE KEY `users_UN` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `accounts`
--
ALTER TABLE `accounts`
  MODIFY `idAccount` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `teamMembers`
--
ALTER TABLE `teamMembers`
  MODIFY `idTeamMembers` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
