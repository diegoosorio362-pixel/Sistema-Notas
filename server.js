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
                    documento: row.documento,
                    nombre: row.nombre,
                    materia: row.materia,
                    categoria: row.categoria,
                    subcategoria: row.subcategoria,
                    nota: parseFloat(row.nota),
                    periodo: row.periodo,
                    descripcion: row.descripcion,
                    fecha: row.fecha,
                    saberGrade: row.saberGrade || null,
                    hacerGrade: row.hacerGrade || null,
                    serGrade: row.serGrade || null
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
            {id: 'categoria', title: 'categoria'},
            {id: 'subcategoria', title: 'subcategoria'},
            {id: 'nota', title: 'nota'},
            {id: 'periodo', title: 'periodo'},
            {id: 'descripcion', title: 'descripcion'},
            {id: 'fecha', title: 'fecha'},
            {id: 'saberGrade', title: 'saberGrade'},
            {id: 'hacerGrade', title: 'hacerGrade'},
            {id: 'serGrade', title: 'serGrade'}
        ]
    });
    
    const data = grades.map(grade => ({
        documento: grade.documento,
        nombre: grade.nombre,
        materia: grade.materia,
        categoria: grade.categoria,
        subcategoria: grade.subcategoria,
        nota: grade.nota,
        periodo: grade.periodo,
        descripcion: grade.descripcion,
        fecha: grade.fecha,
        saberGrade: grade.saberGrade || '',
        hacerGrade: grade.hacerGrade || '',
        serGrade: grade.serGrade || ''
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
    const csvPath = path.join(__dirname, 'students.csv');
    
    if (fs.existsSync(csvPath)) {
        console.log(`📊 Cargando estudiantes desde CSV: ${csvPath}`);
        
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                // Convertir filas del CSV a objetos estudiantes con nueva estructura completa
                const saber_pg = parseFloat(row.saber_pg) || 0;
                const hacer_pg = parseFloat(row.hacer_pg) || 0;
                const ser_pg = parseFloat(row.ser_pg) || 0;
                
                // Calcular nota final: (SABER × 40%) + (HACER × 40%) + (SER × 20%)
                const nota_final = (saber_pg * 0.4) + (hacer_pg * 0.4) + (ser_pg * 0.2);
                
                const student = {
                    id: row.id,
                    name: row.nombre,
                    documento: row.documento,
                    parentCedula: row.documento,
                    grade: '10',
                    // Notas individuales
                    saber_n1: parseFloat(row.saber_n1) || 0,
                    saber_n2: parseFloat(row.saber_n2) || 0,
                    saber_pg: saber_pg,
                    hacer_n3: parseFloat(row.hacer_n3) || 0,
                    hacer_n4: parseFloat(row.hacer_n4) || 0,
                    hacer_pg: hacer_pg,
                    ser_n5: parseFloat(row.ser_n5) || 0,
                    ser_pg: ser_pg,
                    nota_falla: parseInt(row.nota_falla) || 0,
                    falla_j: parseInt(row.falla_j) || 0,
                    // Nota final calculada
                    nota_final: nota_final
                };
                students.push(student);
            })
            .on('end', () => {
                console.log(`✅ ${students.length} estudiantes cargados desde CSV`);
            })
            .on('error', (error) => {
                console.error('❌ Error al leer CSV de estudiantes:', error);
            });
    } else {
        console.log('⚠️ Archivo students.csv no encontrado, usando datos de ejemplo');
        // Datos de ejemplo si no hay CSV
        students = [
            {
                id: '1',
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

// DELETE /api/students/delete-all - Eliminar todos los estudiantes (DEBE IR ANTES de /:id)
app.delete('/api/students/delete-all', (req, res) => {
    const initialLength = students.length;
    
    if (initialLength === 0) {
        res.json({ message: 'No hay estudiantes para eliminar' });
        return;
    }
    
    students = [];
    
    console.log(`🗑️ Todos los estudiantes eliminados (${initialLength} estudiantes)`);
    
    // Guardar CSV vacío
    saveStudentsToCSV();
    
    res.json({ message: `${initialLength} estudiantes eliminados exitosamente` });
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
        grade.studentId === studentId || grade.documento === studentId
    );
    console.log(`📊 Consultando calificaciones del estudiante ${studentId}: ${studentGrades.length} encontradas`);
    res.json(studentGrades);
});


// POST /api/grades - Crear nueva calificación
app.post('/api/grades', (req, res) => {
    const newGrade = req.body;
    
    // Estructura simplificada y directa
    const gradeData = {
        documento: newGrade.studentId,
        nombre: newGrade.studentName,
        materia: newGrade.subject,
        categoria: newGrade.evaluationCategory,
        subcategoria: newGrade.subcategory || 'General',
        nota: newGrade.grade,
        periodo: newGrade.period,
        descripcion: newGrade.description || '',
        fecha: new Date().toISOString().split('T')[0], // Solo la fecha
        // Campos adicionales para calificaciones completas
        saberGrade: newGrade.saberGrade || null,
        hacerGrade: newGrade.hacerGrade || null,
        serGrade: newGrade.serGrade || null
    };
    
    grades.push(gradeData);
    
    if (newGrade.evaluationCategory === 'completa') {
        console.log(`➕ Calificación COMPLETA agregada: ${newGrade.studentName} - ${newGrade.subject} - Nota Final: ${newGrade.grade}`);
        console.log(`   📊 SABER: ${newGrade.saberGrade}, HACER: ${newGrade.hacerGrade}, SER: ${newGrade.serGrade}`);
    } else {
        console.log(`➕ Calificación agregada: ${newGrade.studentName} - ${newGrade.subject} - ${newGrade.evaluationCategory}: ${newGrade.grade}`);
    }
    
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

// DELETE /api/grades/delete-all - Eliminar todas las calificaciones (DEBE IR ANTES de /:id)
app.delete('/api/grades/delete-all', (req, res) => {
    const initialLength = grades.length;
    
    if (initialLength === 0) {
        res.json({ message: 'No hay calificaciones para eliminar' });
        return;
    }
    
    grades = [];
    
    console.log(`🗑️ Todas las calificaciones eliminadas (${initialLength} calificaciones)`);
    
    // Guardar CSV vacío
    saveGradesToCSV();
    
    res.json({ message: `${initialLength} calificaciones eliminadas exitosamente` });
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

// POST /api/save-temp-notes - Guardar notas temporales
app.post('/api/save-temp-notes', (req, res) => {
    const tempData = req.body;
    
    // Guardar en archivo CSV temporal
    const csvPath = 'temp_notes.csv';
    const fs = require('fs');
    
    try {
        // Leer archivo existente
        let csvContent = '';
        if (fs.existsSync(csvPath)) {
            csvContent = fs.readFileSync(csvPath, 'utf8');
        } else {
            csvContent = 'studentId,studentName,subject,evaluationCategory,subcategory,grade,period,description,timestamp\n';
        }
        
        // Agregar nuevas notas
        tempData.notes.forEach(note => {
            const timestamp = new Date().toISOString();
            const line = `${tempData.studentDocument},${tempData.studentName},${tempData.subject},${tempData.evaluationCategory},${note.subcategory},${note.grade},${note.period},${note.description},${timestamp}\n`;
            csvContent += line;
        });
        
        // Escribir archivo
        fs.writeFileSync(csvPath, csvContent);
        
        console.log(`💾 ${tempData.notes.length} notas temporales guardadas para ${tempData.studentName}`);
        res.json({ message: 'Notas temporales guardadas correctamente', count: tempData.notes.length });
    } catch (error) {
        console.error('Error al guardar notas temporales:', error);
        res.status(500).json({ error: 'Error al guardar notas temporales' });
    }
});

// Función para cargar profesores desde CSV
function loadTeachersFromCSV() {
    const csvPath = path.join(__dirname, 'teachers.csv');
    
    if (fs.existsSync(csvPath)) {
        console.log(`📊 Cargando profesores desde CSV: ${csvPath}`);
        
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (row) => {
                const teacher = {
                    id: row.id,
                    email: row.username, // Usar username como email para compatibilidad
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
            {
                id: '1',
                email: 'profesor@escuela.edu',
                username: 'profesor@escuela.edu',
                password: '123456',
                name: 'Profesor Principal'
            },
            {
                id: '2',
                email: 'admin@escuela.edu',
                username: 'admin@escuela.edu',
                password: 'admin123',
                name: 'Administrador'
            }
        ];
    }
}


// Inicializar servidor
loadTeachersFromCSV();
loadStudentsFromCSV();
loadGradesFromCSV();

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 API disponible en http://localhost:${PORT}/api`);
    console.log(`🌐 Página web en http://localhost:${PORT}`);
});
