@echo off
echo ========================================
echo   INSTALACION DEL SERVIDOR BACKEND
echo ========================================
echo.

echo Verificando Python...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python no esta instalado o no esta en el PATH
    echo Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

echo.
echo Instalando dependencias...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo.
echo ========================================
echo   INSTALACION COMPLETADA
echo ========================================
echo.
echo Para iniciar el servidor, ejecuta:
echo   python server.py
echo.
echo El servidor estara disponible en:
echo   http://localhost:5000
echo.
pause
