const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Base de datos en memoria (desde CSV)
let students = [];
let teachers = [];
let grades = [];

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

// Función para guardar estudiantes en CSV
function saveStudentsToCSV() {
    const csvPath = 'students.csv';
    const writer = csvWriter.createObjectCsvWriter({
        path: csvPath,
        header: [
            {id: 'documento', title: 'documento'},
            {id: 'nombre', title: 'nombre'},
            {id: 'grado', title: 'grado'}
        ]
    });
    
    const data = students.map(student => ({
        documento: student.documento || student.id,
        nombre: student.name,
        grado: student.grade
    }));
    
    writer.writeRecords(data)
        .then(() => {
            console.log(`✅ ${students.length} estudiantes guardados en ${csvPath}`);
        })
        .catch((error) => {
            console.error('❌ Error al guardar CSV:', error);
        });
}

// Función para cargar calificaciones desde CSV
function loadGradesFromCSV() {
    const csvPath = path.join(__dirname, 'grades.csv');
    
    if (fs.existsSync(csvPath)) {
        console.log(`📊 Cargando calificaciones desde CSV: ${csvPath}`);
        
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const grade = {
                    studentId: row.documento || row.studentId,
                    studentName: row.nombre || row.studentName,
                    subject: row.materia || row.subject,
                    saber: row.saber ? parseFloat(row.saber) : null,
                    hacer: row.hacer ? parseFloat(row.hacer) : null,
                    ser: row.ser ? parseFloat(row.ser) : null,
                    period: row.periodo || row.period,
                    description: row.descripcion || row.description,
                    timestamp: row.timestamp || new Date().toISOString()
                };
                grades.push(grade);
            })
            .on('end', () => {
                console.log(`✅ ${grades.length} calificaciones cargadas desde CSV`);
            })
            .on('error', (error) => {
                console.error('❌ Error al leer CSV de calificaciones:', error);
            });
    } else {
        console.log('⚠️ Archivo grades.csv no encontrado, empezando con array vacío');
    }
}

// Función para guardar calificaciones en CSV
function saveGradesToCSV() {
    const csvPath = 'grades.csv';
    const writer = csvWriter.createObjectCsvWriter({
        path: csvPath,
        header: [
            {id: 'documento', title: 'documento'},
            {id: 'nombre', title: 'nombre'},
            {id: 'materia', title: 'materia'},
            {id: 'saber', title: 'saber'},
            {id: 'hacer', title: 'hacer'},
            {id: 'ser', title: 'ser'},
            {id: 'periodo', title: 'periodo'},
            {id: 'descripcion', title: 'descripcion'},
            {id: 'timestamp', title: 'timestamp'}
        ]
    });
    
    const data = grades.map(grade => ({
        documento: grade.studentId,
        nombre: grade.studentName,
        materia: grade.subject,
        saber: grade.saber || '',
        hacer: grade.hacer || '',
        ser: grade.ser || '',
        periodo: grade.period,
        descripcion: grade.description || '',
        timestamp: grade.timestamp
    }));
    
    writer.writeRecords(data)
        .then(() => {
            console.log(`✅ ${grades.length} calificaciones guardadas en ${csvPath}`);
        })
        .catch((error) => {
            console.error('❌ Error al guardar CSV de calificaciones:', error);
        });
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
                // Convertir filas del CSV a objetos estudiantes
                const student = {
                    id: row.documento || row.id,
                    name: row.nombre || row.name,
                    documento: row.documento || row.id,
                    parentCedula: row.documento || row.id,
                    grade: row.grado || row.grade || '10'
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
    
    // Guardar en CSV
    saveStudentsToCSV();
    
    res.json({ message: 'Estudiante creado exitosamente', student: newStudent });
});

// DELETE /api/students/:id - Eliminar estudiante
app.delete('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const initialLength = students.length;
    
    students = students.filter(student => student.id !== studentId && student.documento !== studentId);
    
    if (students.length < initialLength) {
        console.log(`🗑️ Estudiante eliminado: ${studentId}`);
        
        // Guardar en CSV
        saveStudentsToCSV();
        
        res.json({ message: 'Estudiante eliminado exitosamente' });
    } else {
        console.log(`❌ Estudiante no encontrado: ${studentId}`);
        res.status(404).json({ message: 'Estudiante no encontrado' });
    }
});

// Rutas API para Calificaciones

// GET /api/grades - Obtener todas las calificaciones
app.get('/api/grades', (req, res) => {
    console.log(`📊 Consultando ${grades.length} calificaciones`);
    res.json(grades);
});

// GET /api/grades/student/:studentId - Obtener calificaciones de un estudiante
app.get('/api/grades/student/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    const studentGrades = grades.filter(grade => 
        grade.studentId === studentId || grade.studentId === studentId
    );
    console.log(`📊 Consultando calificaciones del estudiante ${studentId}: ${studentGrades.length} encontradas`);
    res.json(studentGrades);
});

// POST /api/grades - Crear nueva calificación
app.post('/api/grades', (req, res) => {
    const newGrade = req.body;
    
    // Convertir las categorías a la nueva estructura
    const gradeData = {
        studentId: newGrade.studentId,
        studentName: newGrade.studentName,
        subject: newGrade.subject,
        saber: newGrade.evaluationCategory === 'saber' ? newGrade.grade : null,
        hacer: newGrade.evaluationCategory === 'hacer' ? newGrade.grade : null,
        ser: newGrade.evaluationCategory === 'ser' ? newGrade.grade : null,
        period: newGrade.period,
        description: newGrade.description,
        timestamp: newGrade.timestamp || new Date().toISOString()
    };
    
    grades.push(gradeData);
    
    console.log(`➕ Calificación agregada: ${newGrade.studentName} - ${newGrade.subject} - ${newGrade.evaluationCategory}: ${newGrade.grade}`);
    
    // Guardar en CSV
    saveGradesToCSV();
    
    res.json({ message: 'Calificación creada exitosamente', grade: gradeData });
});

// PUT /api/grades/:id - Actualizar calificación existente
app.put('/api/grades/:id', (req, res) => {
    const gradeId = req.params.id;
    const updateData = req.body;
    
    const gradeIndex = grades.findIndex(grade => grade.timestamp === gradeId);
    
    if (gradeIndex !== -1) {
        // Actualizar la calificación existente
        grades[gradeIndex] = {
            ...grades[gradeIndex],
            ...updateData
        };
        
        console.log(`📝 Calificación actualizada: ${gradeId}`);
        
        // Guardar en CSV
        saveGradesToCSV();
        
        res.json({ message: 'Calificación actualizada exitosamente', grade: grades[gradeIndex] });
    } else {
        console.log(`❌ Calificación no encontrada: ${gradeId}`);
        res.status(404).json({ message: 'Calificación no encontrada' });
    }
});

// DELETE /api/grades/:id - Eliminar calificación
app.delete('/api/grades/:id', (req, res) => {
    const gradeId = req.params.id;
    const initialLength = grades.length;
    
    grades = grades.filter(grade => grade.timestamp !== gradeId);
    
    if (grades.length < initialLength) {
        console.log(`🗑️ Calificación eliminada: ${gradeId}`);
        saveGradesToCSV();
        res.json({ message: 'Calificación eliminada exitosamente' });
    } else {
        console.log(`❌ Calificación no encontrada: ${gradeId}`);
        res.status(404).json({ message: 'Calificación no encontrada' });
    }
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
loadGradesFromCSV();

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api`);
    console.log(`🌐 Página web en http://localhost:${PORT}`);
});
