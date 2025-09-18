const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Base de datos en memoria (desde CSV)
let students = [];
let teachers = [];

// Cargar profesores desde CSV
function loadTeachersFromCSV() {
    const csvPath = path.join(__dirname, 'teachers.csv');
    
    if (fs.existsSync(csvPath)) {
        console.log(`👨‍🏫 Cargando profesores desde CSV: ${csvPath}`);
        
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const teacher = {
                    id: parseInt(row.id),
                    username: row.username,
                    password: row.password,
                    name: row.name
                };
                teachers.push(teacher);
            })
            .on('end', () => {
                console.log(`✅ ${teachers.length} profesores cargados desde CSV`);
            })
            .on('error', (error) => {
                console.error('❌ Error al leer CSV de profesores:', error);
            });
    } else {
        console.log('⚠️ Archivo teachers.csv no encontrado, usando datos de ejemplo');
        // Datos de ejemplo si no hay CSV
        teachers = [
            { id: 1, username: 'profesor', password: '123456', name: 'Profesor Principal' },
            { id: 2, username: 'admin', password: 'admin123', name: 'Administrador' }
        ];
    }
}

// Cargar estudiantes desde CSV
function loadStudentsFromCSV() {
    // Buscar archivo CSV (puede tener diferentes nombres)
    const possibleNames = ['example run.csv', 'students.csv', 'estudiantes.csv'];
    let csvPath = null;
    
    for (const name of possibleNames) {
        const testPath = path.join(__dirname, 'data', name);
        if (fs.existsSync(testPath)) {
            csvPath = testPath;
            break;
        }
    }
    
    // También buscar en la raíz del proyecto
    if (!csvPath) {
        for (const name of possibleNames) {
            const testPath = path.join(__dirname, name);
            if (fs.existsSync(testPath)) {
                csvPath = testPath;
                break;
            }
        }
    }
    
    if (csvPath && fs.existsSync(csvPath)) {
        console.log(`📊 Cargando estudiantes desde CSV: ${csvPath}`);
        
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                // Convertir filas del CSV a objetos estudiantes (simplificado)
                const student = {
                    id: row.id || row.documento,
                    name: row.nombre || row.name, // Campo correcto para la página web
                    documento: row.documento || row.id,
                    parentCedula: row.documento || row.id, // Usar documento como cédula del padre
                    grade: '10'
                };
                students.push(student);
            })
            .on('end', () => {
                console.log(`✅ ${students.length} estudiantes cargados desde CSV`);
            })
            .on('error', (error) => {
                console.error('❌ Error al leer CSV:', error);
            });
    } else {
        console.log('⚠️ Archivo CSV no encontrado, usando datos de ejemplo');
        // Datos de ejemplo si no hay CSV (simplificado)
        students = [
            {
                id: '1117265419',
                name: 'BLANDON BELLO JHON DANIER',
                documento: '1117265419',
                parentCedula: '1117265419',
                grade: '10'
            }
        ];
    }
}

// Rutas API

// GET /api/students - Obtener todos los estudiantes
app.get('/api/students', (req, res) => {
    console.log(`📋 Consultando ${students.length} estudiantes`);
    res.json(students);
});

// GET /api/students/search/:cedula - Buscar estudiante por cédula
app.get('/api/students/search/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    console.log(`🔍 Buscando estudiante con cédula: ${cedula}`);
    
    const foundStudents = students.filter(s => 
        s.documento === cedula || 
        s.parentCedula === cedula || 
        s.id === cedula
    );
    
    console.log(`✅ Encontrados ${foundStudents.length} estudiantes`);
    res.json(foundStudents);
});

// POST /api/students - Crear nuevo estudiante
app.post('/api/students', (req, res) => {
    const newStudent = req.body;
    newStudent.id = newStudent.documento || newStudent.id;
    students.push(newStudent);
    
    console.log(`➕ Estudiante agregado: ${newStudent.name || newStudent.nombre}`);
    res.json({ message: 'Estudiante creado exitosamente', student: newStudent });
});

// GET /api/teachers - Obtener todos los profesores
app.get('/api/teachers', (req, res) => {
    console.log(`👨‍🏫 Consultando ${teachers.length} profesores`);
    res.json(teachers);
});

// POST /api/login - Login de profesores
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`🔐 Intentando login: ${username}`);
    
    const teacher = teachers.find(t => t.username === username && t.password === password);
    
    if (teacher) {
        console.log(`✅ Login exitoso: ${teacher.name}`);
        res.json({ success: true, teacher: { id: teacher.id, name: teacher.name, username: teacher.username } });
    } else {
        console.log('❌ Login fallido');
        res.json({ success: false, message: 'Credenciales incorrectas' });
    }
});

// Ruta principal - servir la página web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar servidor
loadTeachersFromCSV();
loadStudentsFromCSV();

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api`);
    console.log(`🌐 Página web en http://localhost:${PORT}`);
});
