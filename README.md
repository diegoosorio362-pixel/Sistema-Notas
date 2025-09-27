# Sistema de Notas - Backend Integration

## 🚀 Instalación y Configuración

### Requisitos Previos
- Python 3.7 o superior
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

### Instalación Automática (Windows)

1. **Ejecutar instalación automática:**
   ```bash
   install.bat
   ```

2. **Iniciar el servidor backend:**
   ```bash
   start-backend.bat
   ```

3. **Abrir el sistema:**
   - Abrir `index.html` en tu navegador
   - El sistema detectará automáticamente el backend

### Instalación Manual

1. **Instalar dependencias de Python:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Iniciar servidor backend:**
   ```bash
   python server.py
   ```

3. **Abrir el sistema:**
   - Abrir `index.html` en tu navegador
   - URL del backend: http://localhost:5000

## 🔧 Funcionalidades del Backend

### ✅ Características Implementadas

- **Sincronización Automática**: Las notas se guardan automáticamente en el CSV
- **Sistema de Backups**: Backup automático antes de cada modificación
- **Borrado de Notas**: Eliminación segura de notas por período
- **Modo Híbrido**: Funciona con y sin backend (fallback local)
- **API REST**: Endpoints para todas las operaciones

### 📡 Endpoints Disponibles

- `GET /api/health` - Verificar estado del servidor
- `GET /api/students` - Obtener todos los estudiantes
- `POST /api/update-students` - Actualizar datos de estudiantes
- `POST /api/clear-notes` - Borrar notas de un período
- `GET /api/download-csv` - Descargar CSV actual
- `GET /api/backups` - Listar backups disponibles

## 🔄 Flujo de Trabajo

### Con Backend Activo
1. **Guardar Notas**: Se guardan automáticamente en el CSV
2. **Backup Automático**: Se crea backup antes de cada cambio
3. **Sincronización**: Datos siempre actualizados
4. **Persistencia**: Cambios permanentes en el archivo

### Sin Backend (Modo Local)
1. **Funcionamiento Normal**: Todas las funciones disponibles
2. **Datos en Memoria**: Cambios solo en la sesión actual
3. **Fallback**: Sistema funciona independientemente

## 📁 Estructura de Archivos

```
Sistema-Notas/
├── index.html              # Frontend principal
├── students.csv            # Base de datos de estudiantes
├── server.py              # Servidor backend Flask
├── requirements.txt       # Dependencias Python
├── install.bat           # Script de instalación
├── start-backend.bat     # Script de inicio
└── backups/              # Directorio de backups automáticos
    ├── students_backup_20241201_143022.csv
    └── ...
```

## 🛡️ Seguridad y Backups

### Sistema de Backups Automáticos
- **Creación**: Antes de cada modificación del CSV
- **Ubicación**: Directorio `backups/`
- **Formato**: `students_backup_YYYYMMDD_HHMMSS.csv`
- **Retención**: Manual (recomendado limpiar periódicamente)

### Validaciones
- **Rango de Notas**: 0.0 - 5.0
- **Validación de Datos**: Antes de guardar
- **Confirmaciones**: Para operaciones destructivas

## 🔧 Configuración Avanzada

### Cambiar Puerto del Backend
Editar `server.py` línea 15:
```python
PORT = 5000  # Cambiar por el puerto deseado
```

### Cambiar URL del Backend
Editar `index.html` línea 2743:
```javascript
const BACKEND_URL = 'http://localhost:5000';  // Cambiar URL
```

## 🐛 Solución de Problemas

### Backend No Inicia
1. Verificar que Python esté instalado
2. Verificar que el puerto 5000 esté libre
3. Ejecutar: `pip install -r requirements.txt`

### Frontend No Conecta
1. Verificar que el backend esté ejecutándose
2. Verificar URL en `index.html`
3. Revisar consola del navegador para errores

### Datos No Se Guardan
1. Verificar permisos de escritura en el directorio
2. Verificar que `students.csv` existe
3. Revisar logs del servidor backend

## 📊 Monitoreo

### Logs del Backend
El servidor muestra logs detallados:
- ✅ Conexiones exitosas
- ⚠️ Advertencias
- ❌ Errores

### Consola del Navegador
- ✅ Conexión con backend
- ⚠️ Modo local activado
- ❌ Errores de comunicación

## 🚀 Próximas Mejoras

- [ ] Interfaz web para gestión de backups
- [ ] Sistema de usuarios y permisos
- [ ] Exportación a múltiples formatos
- [ ] Dashboard de estadísticas avanzadas
- [ ] API para integración con otros sistemas

---

**Nota**: Este sistema está diseñado para funcionar tanto con backend como sin él, garantizando máxima flexibilidad y disponibilidad.