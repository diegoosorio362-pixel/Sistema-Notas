#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor backend para el Sistema de Notas
Maneja la actualización automática del archivo CSV
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import csv
import json
import os
import shutil
from datetime import datetime
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Permitir CORS para comunicación con frontend

# Configuración
CSV_FILE = 'students.csv'
BACKUP_DIR = 'backups'
PORT = 5000

def ensure_backup_dir():
    """Crear directorio de backups si no existe"""
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        logger.info(f"Directorio de backup creado: {BACKUP_DIR}")

def create_backup():
    """Crear backup del CSV antes de modificarlo"""
    ensure_backup_dir()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"students_backup_{timestamp}.csv"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)
    
    try:
        shutil.copy2(CSV_FILE, backup_path)
        logger.info(f"Backup creado: {backup_path}")
        return backup_path
    except Exception as e:
        logger.error(f"Error creando backup: {e}")
        raise

def read_csv_data():
    """Leer datos del CSV actual"""
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            return list(reader)
    except Exception as e:
        logger.error(f"Error leyendo CSV: {e}")
        raise

def write_csv_data(data):
    """Escribir datos al CSV"""
    try:
        # Obtener las columnas del primer registro
        if not data:
            raise ValueError("No hay datos para escribir")
        
        fieldnames = data[0].keys()
        
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        
        logger.info(f"CSV actualizado exitosamente con {len(data)} registros")
        return True
    except Exception as e:
        logger.error(f"Error escribiendo CSV: {e}")
        raise

def clear_notes_for_period(data, period):
    """Limpiar notas de un período específico"""
    cleared_count = 0
    
    for student in data:
        # Limpiar arrays de notas
        student['saber_notes'] = '[]'
        student['hacer_notes'] = '[]'
        student['ser_notes'] = '[]'
        
        # Limpiar historial del período específico
        if student.get('notes_history'):
            history_parts = student['notes_history'].split('|')
            updated_parts = [part for part in history_parts if not part.startswith(f'p{period}:')]
            student['notes_history'] = '|'.join(updated_parts)
        
        # Limpiar campos de compatibilidad
        student['saber_n1'] = '0'
        student['saber_n2'] = '0'
        student['saber_pg'] = '0'
        student['hacer_n3'] = '0'
        student['hacer_n4'] = '0'
        student['hacer_pg'] = '0'
        student['ser_n5'] = '0'
        student['ser_pg'] = '0'
        
        cleared_count += 1
    
    return cleared_count

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de verificación de salud del servidor"""
    return jsonify({
        'status': 'ok',
        'message': 'Servidor funcionando correctamente',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/teachers', methods=['GET'])
def get_teachers():
    """Obtener todos los usuarios/maestros del CSV"""
    try:
        # Leer el archivo teachers.csv
        teachers_file = 'teachers.csv'
        if not os.path.exists(teachers_file):
            return jsonify({
                'success': False,
                'error': 'Archivo teachers.csv no encontrado'
            }), 404
        
        with open(teachers_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            teachers = list(reader)
        
        # Convertir campos numéricos
        for teacher in teachers:
            teacher['id'] = int(teacher['id'])
            teacher['active'] = teacher['active'] == '1'
        
        return jsonify({
            'success': True,
            'data': teachers,
            'count': len(teachers)
        })
    except Exception as e:
        logger.error(f"Error obteniendo usuarios: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    """Obtener todos los estudiantes del CSV"""
    try:
        data = read_csv_data()
        
        # Procesar las notas de cada estudiante
        for student in data:
            # Convertir strings de notas a arrays de números
            if 'saber_notes' in student and student['saber_notes']:
                try:
                    saber_notes_str = student['saber_notes'].strip('"')  # Remover comillas
                    student['saber_notes'] = [float(note) for note in saber_notes_str.split(',') if note.strip()]
                except (ValueError, AttributeError):
                    student['saber_notes'] = []
            
            if 'hacer_notes' in student and student['hacer_notes']:
                try:
                    hacer_notes_str = student['hacer_notes'].strip('"')  # Remover comillas
                    student['hacer_notes'] = [float(note) for note in hacer_notes_str.split(',') if note.strip()]
                except (ValueError, AttributeError):
                    student['hacer_notes'] = []
            
            if 'ser_notes' in student and student['ser_notes']:
                try:
                    ser_notes_str = student['ser_notes'].strip('"')  # Remover comillas
                    student['ser_notes'] = [float(note) for note in ser_notes_str.split(',') if note.strip()]
                except (ValueError, AttributeError):
                    student['ser_notes'] = []
            
            # Convertir promedios a float si existen
            if 'saber_pg' in student and student['saber_pg']:
                try:
                    student['saber_pg'] = float(student['saber_pg'])
                except (ValueError, TypeError):
                    student['saber_pg'] = 0.0
            
            if 'hacer_pg' in student and student['hacer_pg']:
                try:
                    student['hacer_pg'] = float(student['hacer_pg'])
                except (ValueError, TypeError):
                    student['hacer_pg'] = 0.0
            
            if 'ser_pg' in student and student['ser_pg']:
                try:
                    student['ser_pg'] = float(student['ser_pg'])
                except (ValueError, TypeError):
                    student['ser_pg'] = 0.0
        
        return jsonify({
            'success': True,
            'data': data,
            'count': len(data)
        })
    except Exception as e:
        logger.error(f"Error obteniendo estudiantes: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/clear-notes', methods=['POST'])
def clear_notes():
    """Limpiar notas de un período específico"""
    try:
        # Obtener datos del request
        request_data = request.get_json()
        period = request_data.get('period')
        
        if not period:
            return jsonify({
                'success': False,
                'error': 'Período no especificado'
            }), 400
        
        # Crear backup antes de modificar
        backup_path = create_backup()
        
        # Leer datos actuales
        data = read_csv_data()
        
        # Limpiar notas del período
        cleared_count = clear_notes_for_period(data, period)
        
        # Escribir datos actualizados
        write_csv_data(data)
        
        logger.info(f"Notas del período {period} borradas para {cleared_count} estudiantes")
        
        return jsonify({
            'success': True,
            'message': f'Notas del Período {period} borradas exitosamente',
            'cleared_count': cleared_count,
            'backup_path': backup_path,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error borrando notas: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/update-students', methods=['POST'])
def update_students():
    """Actualizar datos completos de estudiantes"""
    try:
        # Obtener datos del request
        request_data = request.get_json()
        students_data = request_data.get('students')
        
        if not students_data:
            return jsonify({
                'success': False,
                'error': 'Datos de estudiantes no proporcionados'
            }), 400
        
        # Crear backup antes de modificar
        backup_path = create_backup()
        
        # Escribir datos actualizados
        write_csv_data(students_data)
        
        logger.info(f"CSV actualizado con {len(students_data)} estudiantes")
        
        return jsonify({
            'success': True,
            'message': 'Datos de estudiantes actualizados exitosamente',
            'updated_count': len(students_data),
            'backup_path': backup_path,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error actualizando estudiantes: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/download-csv', methods=['GET'])
def download_csv():
    """Descargar el CSV actual"""
    try:
        return send_file(CSV_FILE, as_attachment=True, download_name='students.csv')
    except Exception as e:
        logger.error(f"Error descargando CSV: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/backups', methods=['GET'])
def list_backups():
    """Listar backups disponibles"""
    try:
        ensure_backup_dir()
        backups = []
        
        for filename in os.listdir(BACKUP_DIR):
            if filename.endswith('.csv'):
                file_path = os.path.join(BACKUP_DIR, filename)
                stat = os.stat(file_path)
                backups.append({
                    'filename': filename,
                    'size': stat.st_size,
                    'created': datetime.fromtimestamp(stat.st_ctime).isoformat()
                })
        
        backups.sort(key=lambda x: x['created'], reverse=True)
        
        return jsonify({
            'success': True,
            'backups': backups
        })
        
    except Exception as e:
        logger.error(f"Error listando backups: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print(f"🚀 Iniciando servidor backend en puerto {PORT}")
    print(f"📁 Archivo CSV: {CSV_FILE}")
    print(f"💾 Directorio de backups: {BACKUP_DIR}")
    print(f"🌐 URL: http://localhost:{PORT}")
    
    # Verificar que el archivo CSV existe
    if not os.path.exists(CSV_FILE):
        print(f"⚠️  Advertencia: El archivo {CSV_FILE} no existe")
    
    # Crear directorio de backups
    ensure_backup_dir()
    
    # Iniciar servidor
    app.run(host='0.0.0.0', port=PORT, debug=True)



