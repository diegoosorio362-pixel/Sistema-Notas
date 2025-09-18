# 📚 Sistema de Notas Escolares

Sistema web para gestión de notas escolares que permite a profesores registrar calificaciones y a padres consultar las notas de sus hijos.

## 🚀 Características

- ✅ **Login de profesores** - Autenticación segura
- ✅ **Gestión de estudiantes** - Registro y consulta
- ✅ **Consulta de padres** - Búsqueda por cédula
- ✅ **Interfaz moderna** - Diseño responsivo
- ✅ **Base de datos CSV** - Fácil mantenimiento

## 🛠️ Tecnologías

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Base de datos:** CSV files
- **Dependencias:** cors, body-parser, csv-parser

## 📦 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/sistema-notas.git
cd sistema-notas
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar datos:**
- Agregar `students.csv` con datos de estudiantes
- Agregar `teachers.csv` con datos de profesores

4. **Ejecutar servidor:**
```bash
npm start
```

5. **Abrir en navegador:**
```
http://localhost:3000
```

## 📁 Estructura del proyecto

```
sistema-notas/
├── index.html          # Página principal
├── script.js           # Lógica del frontend
├── styles.css          # Estilos CSS
├── server.js           # Servidor Node.js
├── package.json        # Configuración del proyecto
├── students.csv        # Datos de estudiantes
├── teachers.csv        # Datos de profesores
└── node_modules/       # Dependencias
```

## 🔐 Credenciales por defecto

- **Email:** profesor@escuela.edu
- **Contraseña:** admin123

## 👥 Uso

### Para Profesores:
1. Iniciar sesión con credenciales
2. Registrar estudiantes
3. Asignar calificaciones
4. Gestionar información académica

### Para Padres:
1. Ir a la sección "Consulta de Padres"
2. Ingresar cédula del estudiante
3. Ver notas y información académica

## 📝 Licencia

Este proyecto es de uso educativo.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---
Desarrollado con ❤️ para la educación
