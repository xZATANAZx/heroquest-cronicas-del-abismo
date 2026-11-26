@echo off
title HeroQuest DM - Actualizar Programa (Conserva tus Heroes)
color 0A
echo ============================================================
echo   HEROQUEST: CRONICAS DEL ABISMO - ACTUALIZADOR
echo   Tus personajes (.hq_data) y campana NO se tocaran.
echo ============================================================
echo.

cd /d "%~dp0"

if not exist ".git" (
  echo [AVISO] Esta carpeta no esta conectada a GitHub.
  echo.
  echo Para actualizar mediante ZIP:
  echo   1. Pide el archivo HeroQuest_DM_Limpio.zip mas reciente.
  echo   2. Descomprimelo encima de esta carpeta y elige "Reemplazar archivos".
  echo   3. Abre ABRIR_HEROQUEST_DM.bat. Tus heroes y progreso quedaran intactos.
  echo.
  pause
  exit /b 0
)

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Git instalado en esta PC.
  echo Descargalo en https://git-scm.com/ o actualiza usando el archivo ZIP.
  echo.
  pause
  exit /b 1
)

echo Descargando las ultimas mejoras desde GitHub...
git pull --ff-only
if errorlevel 1 (
  echo.
  echo [AVISO] Hubo un conflicto al actualizar. Verifica tu conexion a internet.
  pause
  exit /b 1
)

echo.
echo Verificando paquetes nuevos...
call npm install

echo.
echo ============================================================
echo   LISTO! HeroQuest DM actualizado correctamente.
echo   Tus aventureros y progreso siguen intactos.
echo ============================================================
echo.
pause
