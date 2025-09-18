const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Arrays para almacenar datos en memoria
let students = [];
let teachers = [];

// Función para cargar estudiantes desde CSV
function loadStudentsFromCSV() {
    students = [];
    const csvFile = 'students.csv';
    
    if (fs.existsSync(csvFile)) {
        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (row) => {
                const student = {
                    id: row.documento,
                    name: row.nombre,
                    documento: row.documento,
                    parentCedula: row.documento,
                    grade: row.grado || 'No especificado'
                };
                students.push(student);
            })
            .on('end', () => {
                console.log(`Cargados ${students.length} estudiantes desde CSV`);
            });
    } else {
        console.log('Archivo students.csv no encontrado');
    }
}

// Función para cargar profesores desde CSV
function loadTeachersFromCSV() {
    teachers = [];
    const csvFile = 'teachers.csv';
    
    if (fs.existsSync(csvFile)) {
        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (row) => {
                const teacher = {
                    id: row.id,
                    username: row.username,
                    password: row.password,
                    name: row.name
                };
                teachers.push(teacher);
            })
            .on('end', () => {
                console.log(`Cargados ${teachers.length} profesores desde CSV`);
            });
    } else {
        console.log('Archivo teachers.csv no encontrado');
    }
}

// Cargar datos al iniciar el servidor
loadStudentsFromCSV();
loadTeachersFromCSV();

// Ruta principal - servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes

// Obtener todos los estudiantes
app.get('/api/students', (req, res) => {
    res.json(students);
});

// Buscar estudiante por cédula del padre/madre
app.get('/api/students/search/:cedula', (req, res) => {
    const cedula = req.params.cedula;
    const foundStudents = students.filter(student => 
        student.parentCedula === cedula
    );
    
    if (foundStudents.length > 0) {
        res.json(foundStudents);
    } else {
        res.status(404).json({ error: 'Estudiante no encontrado' });
    }
});

// Agregar nuevo estudiante
app.post('/api/students', (req, res) => {
    const { name, documento, parentCedula, grade } = req.body;
    
    const newStudent = {
        id: documento,
        name: name,
        documento: documento,
        parentCedula: parentCedula,
        grade: grade
    };
    
    students.push(newStudent);
    res.json({ message: 'Estudiante agregado exitosamente', student: newStudent });
});

// Obtener todos los profesores
app.get('/api/teachers', (req, res) => {
    res.json(teachers);
});

// Login de profesores
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const teacher = teachers.find(t => 
        t.username === username && t.password === password
    );
    
    if (teacher) {
        res.json({ 
            success: true, 
            message: 'Login exitoso',
            teacher: { id: teacher.id, name: teacher.name, username: teacher.username }
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Credenciales incorrectas' 
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`Accede a: http://localhost:${PORT}`);
});
