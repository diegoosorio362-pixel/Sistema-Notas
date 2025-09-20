-- Sistema de Notas Escolares - Tabla Completa con 24 Estudiantes
-- Código corregido para RunSQL

-- Crear tabla de estudiantes con columnas de evaluación
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    documento VARCHAR(20) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    saber_n1 DECIMAL(3,1),
    saber_n2 DECIMAL(3,1),
    saber_pg DECIMAL(3,2),
    hacer_n3 DECIMAL(3,1),
    hacer_n4 DECIMAL(3,1),
    hacer_pg DECIMAL(3,2),
    ser_n5 DECIMAL(3,1),
    ser_pg DECIMAL(3,2),
    nota_falla INTEGER,
    falla_j INTEGER
);

-- Insertar todos los 24 estudiantes
INSERT INTO students VALUES (1, '1117265419', 'BLANDON BELLO JHON DANIER', 2.9, 0.5, 1.70, 3.2, 2.8, 3.00, 4.1, 4.10, 0, 0);
INSERT INTO students VALUES (2, '1234567890', 'GARCIA LOPEZ MARIA FERNANDA', 4.5, 4.2, 4.35, 3.8, 4.0, 3.90, 4.5, 4.50, 0, 0);
INSERT INTO students VALUES (3, '0987654321', 'RODRIGUEZ MARTINEZ CARLOS ALBERTO', 3.7, 3.5, 3.60, 3.2, 3.4, 3.30, 3.8, 3.80, 0, 0);
INSERT INTO students VALUES (4, '1122334455', 'LOPEZ GONZALEZ ANA SOFIA', 4.2, 4.0, 4.10, 3.9, 4.1, 4.00, 4.3, 4.30, 0, 0);
INSERT INTO students VALUES (5, '5566778899', 'MARTINEZ SILVA DIEGO ALEJANDRO', 3.5, 3.3, 3.40, 3.6, 3.4, 3.50, 3.7, 3.70, 0, 0);
INSERT INTO students VALUES (6, '9988776655', 'GONZALEZ HERRERA VALENTINA', 4.8, 4.6, 4.70, 4.5, 4.7, 4.60, 4.8, 4.80, 0, 0);
INSERT INTO students VALUES (7, '4433221100', 'SILVA MORALES SEBASTIAN', 3.2, 3.0, 3.10, 2.8, 3.0, 2.90, 3.3, 3.30, 0, 0);
INSERT INTO students VALUES (8, '7766554433', 'HERRERA CASTRO ISABELLA', 4.0, 3.8, 3.90, 3.7, 3.9, 3.80, 4.1, 4.10, 0, 0);
INSERT INTO students VALUES (9, '3344556677', 'MORALES RAMIREZ MATEO', 3.8, 3.6, 3.70, 3.4, 3.6, 3.50, 3.9, 3.90, 0, 0);
INSERT INTO students VALUES (10, '8899001122', 'CASTRO VARGAS SOFIA', 4.3, 4.1, 4.20, 4.0, 4.2, 4.10, 4.4, 4.40, 0, 0);
INSERT INTO students VALUES (11, '2233445566', 'RAMIREZ JIMENEZ LUCAS', 3.6, 3.4, 3.50, 3.3, 3.5, 3.40, 3.7, 3.70, 0, 0);
INSERT INTO students VALUES (12, '6677889900', 'VARGAS MENDOZA CAMILA', 4.1, 3.9, 4.00, 3.8, 4.0, 3.90, 4.2, 4.20, 0, 0);
INSERT INTO students VALUES (13, '4455667788', 'JIMENEZ RUIZ EMILIANO', 3.9, 3.7, 3.80, 3.5, 3.7, 3.60, 4.0, 4.00, 0, 0);
INSERT INTO students VALUES (14, '1122334455', 'MENDOZA TORRES EMILIA', 4.4, 4.2, 4.30, 4.1, 4.3, 4.20, 4.5, 4.50, 0, 0);
INSERT INTO students VALUES (15, '8899112233', 'RUIZ SANTOS BENJAMIN', 3.4, 3.2, 3.30, 3.1, 3.3, 3.20, 3.5, 3.50, 0, 0);
INSERT INTO students VALUES (16, '5566778899', 'TORRES MORENO MARTINA', 4.6, 4.4, 4.50, 4.3, 4.5, 4.40, 4.7, 4.70, 0, 0);
INSERT INTO students VALUES (17, '9988776655', 'SANTOS FLORES MAXIMILIANO', 3.1, 2.9, 3.00, 2.7, 2.9, 2.80, 3.2, 3.20, 0, 0);
INSERT INTO students VALUES (18, '4433221100', 'MORENO AGUILAR ANASTASIA', 4.7, 4.5, 4.60, 4.4, 4.6, 4.50, 4.8, 4.80, 0, 0);
INSERT INTO students VALUES (19, '7766554433', 'FLORES VEGA ALEJANDRO', 3.3, 3.1, 3.20, 2.9, 3.1, 3.00, 3.4, 3.40, 0, 0);
INSERT INTO students VALUES (20, '3344556677', 'AGUILAR SANDOVAL FERNANDA', 4.2, 4.0, 4.10, 3.9, 4.1, 4.00, 4.3, 4.30, 0, 0);
INSERT INTO students VALUES (21, '8899001122', 'VEGA MENDEZ GABRIEL', 3.7, 3.5, 3.60, 3.4, 3.6, 3.50, 3.8, 3.80, 0, 0);
INSERT INTO students VALUES (22, '2233445566', 'SANDOVAL ROJAS VALENTINA', 4.5, 4.3, 4.40, 4.2, 4.4, 4.30, 4.6, 4.60, 0, 0);
INSERT INTO students VALUES (23, '6677889900', 'MENDEZ CASTRO SANTIAGO', 3.8, 3.6, 3.70, 3.5, 3.7, 3.60, 3.9, 3.90, 0, 0);
INSERT INTO students VALUES (24, '4455667788', 'ROJAS VELASQUEZ LUCIANA', 4.9, 4.7, 4.80, 4.6, 4.8, 4.70, 4.9, 4.90, 0, 0);

-- Consultas de verificación
SELECT COUNT(*) as total_estudiantes FROM students;

-- Ver todos los estudiantes
SELECT * FROM students;

-- Consultar estudiante específico
SELECT documento, nombre, saber_n1, saber_n2, saber_pg, hacer_n3, hacer_n4, hacer_pg, ser_n5, ser_pg, nota_falla, falla_j FROM students WHERE documento = '1117265419';

-- Calcular nota final para un estudiante
SELECT documento, nombre, (saber_pg * 0.4) + (hacer_pg * 0.4) + (ser_pg * 0.2) as nota_final FROM students WHERE documento = '1117265419';

-- Ver las mejores notas
SELECT documento, nombre, saber_pg, hacer_pg, ser_pg, (saber_pg * 0.4) + (hacer_pg * 0.4) + (ser_pg * 0.2) as nota_final FROM students ORDER BY nota_final DESC;

-- Ver estudiantes con fallas
SELECT documento, nombre, nota_falla, falla_j FROM students WHERE nota_falla > 0 OR falla_j > 0;
