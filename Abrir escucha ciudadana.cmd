@echo off
cd /d "%~dp0app"
echo Abri http://127.0.0.1:5173/ en el navegador.
echo Para cerrar la app, cerra esta ventana.
call npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
pause
