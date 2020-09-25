CREATE DATABASE  IF NOT EXISTS `prueba_hpp` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `prueba_hpp`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: prueba_hpp
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.34-MariaDB

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
-- Table structure for table `catalogos`
--

DROP TABLE IF EXISTS `catalogos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalogos` (
  `id_catalogo` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo_servicio` varchar(50) NOT NULL,
  PRIMARY KEY (`id_catalogo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda los tipos de servicios que puede ofrecer un comercio';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogos`
--

LOCK TABLES `catalogos` WRITE;
/*!40000 ALTER TABLE `catalogos` DISABLE KEYS */;
/*!40000 ALTER TABLE `catalogos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comercios`
--

DROP TABLE IF EXISTS `comercios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comercios` (
  `id_comercio` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nombre_comercio` varchar(75) NOT NULL,
  `activo` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id_comercio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda comercios';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comercios`
--

LOCK TABLES `comercios` WRITE;
/*!40000 ALTER TABLE `comercios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comercios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comercios_catalogos`
--

DROP TABLE IF EXISTS `comercios_catalogos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comercios_catalogos` (
  `id_comercio` int(10) unsigned NOT NULL,
  `id_catalogo` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_comercio`,`id_catalogo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda los tipos de servicio que ofrece un comercio determinado';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comercios_catalogos`
--

LOCK TABLES `comercios_catalogos` WRITE;
/*!40000 ALTER TABLE `comercios_catalogos` DISABLE KEYS */;
/*!40000 ALTER TABLE `comercios_catalogos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `duenios_comercios`
--

DROP TABLE IF EXISTS `duenios_comercios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `duenios_comercios` (
  `id_usuario` int(10) unsigned NOT NULL,
  `id_comercio` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id_usuario`,`id_comercio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda el registro de los comercios que posee uno o varios usuarios';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `duenios_comercios`
--

LOCK TABLES `duenios_comercios` WRITE;
/*!40000 ALTER TABLE `duenios_comercios` DISABLE KEYS */;
/*!40000 ALTER TABLE `duenios_comercios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes_compras`
--

DROP TABLE IF EXISTS `ordenes_compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ordenes_compras` (
  `id_orden_compra` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) unsigned NOT NULL,
  `id_comercio` int(10) unsigned NOT NULL,
  `fecha_creacion` datetime NOT NULL,
  `total` double(9,2) NOT NULL DEFAULT '0.00',
  `anulada` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id_orden_compra`),
  KEY `fk_comercios_ordenes_compras_idx` (`id_comercio`),
  KEY `fk_usuarios_ordenes_compras_idx` (`id_usuario`),
  CONSTRAINT `fk_comercios_ordenes_compras` FOREIGN KEY (`id_comercio`) REFERENCES `comercios` (`id_comercio`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_ordenes_compras` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda las ordenes de compra de un usuario a un comercio';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes_compras`
--

LOCK TABLES `ordenes_compras` WRITE;
/*!40000 ALTER TABLE `ordenes_compras` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes_compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes_compras_productos`
--

DROP TABLE IF EXISTS `ordenes_compras_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ordenes_compras_productos` (
  `id_orden_compra` int(10) unsigned NOT NULL,
  `id_producto` int(10) unsigned NOT NULL,
  `cantidad` int(10) unsigned NOT NULL,
  `precio_unitario` double(8,2) unsigned NOT NULL DEFAULT '0.00',
  `total_venta_producto` double(9,2) unsigned NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_orden_compra`,`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda registro de productos en una orden de compra';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes_compras_productos`
--

LOCK TABLES `ordenes_compras_productos` WRITE;
/*!40000 ALTER TABLE `ordenes_compras_productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes_compras_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productos` (
  `id_producto` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_comercio` int(10) unsigned NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `url_imagen` varchar(150) DEFAULT NULL,
  `precio` double(8,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_producto`),
  KEY `fk_comercio_productos_idx` (`id_comercio`),
  CONSTRAINT `fk_comercio_productos` FOREIGN KEY (`id_comercio`) REFERENCES `comercios` (`id_comercio`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda productos del comercio';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nombre_completo` varchar(50) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `activo` tinyint(4) DEFAULT '1',
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Guarda usuarios del sistem, ya sea compradores o comerciantes';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'prueba_hpp'
--

--
-- Dumping routines for database 'prueba_hpp'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-24 22:40:14
