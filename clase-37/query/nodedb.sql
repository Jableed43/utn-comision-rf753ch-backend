CREATE database IF NOT EXISTS nodedb;
USE nodedb;

-- Estructura y datos de la tabla `alumnos`

DROP TABLE IF EXISTS `alumnos`;
CREATE TABLE `alumnos` (
  `idalumnos` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idalumnos`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar datos en la tabla `alumnos`
INSERT INTO `alumnos` VALUES 
(7, 'Juan', 'Perez'),
(8, 'Ignacio', 'Gomez'),
(9, 'Camila', 'Buendia');

-- Estructura y datos de la tabla `profesores`

DROP TABLE IF EXISTS `profesores`;
CREATE TABLE `profesores` (
  `idProfesor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idProfesor`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertar datos en la tabla `profesores`
INSERT INTO `profesores` VALUES 
(1, 'Manuel', 'Gomez'),
(2, 'Florencia', 'Heredia'),
(3, 'Juana', 'Perez'),
(4, 'Ignacio', 'Gutierrez'),
(5, 'Camila', 'Heredia');
