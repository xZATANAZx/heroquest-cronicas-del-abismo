@echo off
title HeroQuest DM - Subir Actualizacion a GitHub (Solo DM Creador)
color 0D
echo ============================================================
echo   HEROQUEST: CRONICAS DEL ABISMO - PUBLICAR ACTUALIZACION
echo   (Tus personajes en .hq_data estan protegidos por .gitignore)
echo ============================================================
echo.

cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Git no esta instalado. Instalalo en https://git-scm.com/
  echo o usa EMPAQUETAR_PARA_COMPARTIR.bat para generar un ZIP limpio.
  pause
  exit /b 1
)

if not exist ".git" (
  echo [AVISO] Todavia no has conectado esta carpeta a un repositorio de GitHub.
  echo Pasos rapidos una sola vez:
  echo   1. Crea un repo vacio en https://github.com/new
  echo   2. Abre una terminal aqui y ejecuta:
  echo        git init
  echo        git branch -M main
  echo        git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
  echo   3. Luego vuelve a ejecutar este archivo.
  echo.
  pause
  exit /b 1
)

set /p MSG="Describe brevemente esta actualizacion (Enter para 'Actualizacion HeroQuest DM'): "
if "%MSG%"=="" set MSG=Actualizacion HeroQuest DM

git add .
git commit -m "%MSG%"
git push

echo.
echo ============================================================
echo   LISTO! Tus amigos ya pueden ejecutar ACTUALIZAR_HEROQUEST.bat
echo ============================================================
echo.
pause
