@echo off
title Instalador 1-Clic - HeroQuest: Cronicas del Abismo
color 0B
echo ============================================================
echo   INSTALADOR AUTOMATICO - HEROQUEST: CRONICAS DEL ABISMO
echo   (Descarga la version limpia, instala y crea acceso directo)
echo ============================================================
echo.

:: 1. Verificar o instalar Node.js automaticamente
where node >nul 2>nul
if errorlevel 1 (
  echo [1/3] Instalando Node.js automaticamente (solo la primera vez)...
  winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  if errorlevel 1 (
    echo.
    echo [AVISO] No se pudo instalar Node.js automaticamente.
    echo Se abrira la pagina oficial. Descarga la version LTS, instalala y vuelve a abrir este archivo.
    start "" https://nodejs.org/
    pause
    exit /b 1
  )
  echo.
  echo Node.js instalado! Por favor cierra esta ventana y vuelve a dar doble clic en INSTALAR_HEROQUEST_DM.bat
  pause
  exit /b 0
)

:: 2. Descargar la version limpia desde GitHub al Escritorio\HeroQuest_DM
echo [1/3] Descargando HeroQuest: Cronicas del Abismo (version limpia)...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue'; " ^
  "$repo = 'xZATANAZx/heroquest-cronicas-del-abismo'; " ^
  "$dest = Join-Path ([Environment]::GetFolderPath('Desktop')) 'HeroQuest_DM'; " ^
  "if (!(Test-Path $dest)) { New-Item -ItemType Directory -Path $dest | Out-Null }; " ^
  "$headers = @{ 'User-Agent' = 'HeroQuest-DM-Installer' }; " ^
  "$tmpZip = Join-Path $env:TEMP ('hq_inst_' + [Guid]::NewGuid().ToString('N') + '.zip'); " ^
  "$tmpDir = Join-Path $env:TEMP ('hq_inst_' + [Guid]::NewGuid().ToString('N')); " ^
  "Invoke-WebRequest -Uri ('https://github.com/' + $repo + '/archive/refs/heads/main.zip') -OutFile $tmpZip -Headers $headers -TimeoutSec 60; " ^
  "Add-Type -AssemblyName System.IO.Compression.FileSystem; " ^
  "[System.IO.Compression.ZipFile]::ExtractToDirectory($tmpZip, $tmpDir); " ^
  "$inner = Get-ChildItem -Directory $tmpDir | Select-Object -First 1; " ^
  "$skip = @('.hq_data', 'node_modules', '.git', '.hq_version', 'campaign_heroes.json'); " ^
  "Get-ChildItem -Force $inner.FullName | Where-Object { $skip -notcontains $_.Name } | ForEach-Object { " ^
  "  Copy-Item -Path $_.FullName -Destination (Join-Path $dest $_.Name) -Recurse -Force " ^
  "}; " ^
  "try { $c = Invoke-RestMethod -Uri ('https://api.github.com/repos/' + $repo + '/commits/main') -Headers $headers -TimeoutSec 8; Set-Content -Path (Join-Path $dest '.hq_version') -Value $c.sha -NoNewline } catch {}; " ^
  "Remove-Item $tmpZip -Force -ErrorAction SilentlyContinue; " ^
  "Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue; " ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "$sc = $ws.CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) 'HeroQuest DM.lnk')); " ^
  "$sc.TargetPath = Join-Path $dest 'ABRIR_HEROQUEST_DM.bat'; " ^
  "$sc.WorkingDirectory = $dest; " ^
  "$sc.Save(); " ^
  "Write-Host ('Instalado en: ' + $dest) -ForegroundColor Green"

if errorlevel 1 (
  echo.
  echo [ERROR] No se pudo descargar. Revisa tu conexion a internet e intenta de nuevo.
  pause
  exit /b 1
)

:: 3. Instalar dependencias y abrir el programa
echo.
echo [2/3] Preparando el programa (solo tarda ~1 minuto la primera vez)...
cd /d "%USERPROFILE%\Desktop\HeroQuest_DM"
call npm install

echo.
echo [3/3] LISTO! Se creo el acceso directo "HeroQuest DM" en tu Escritorio.
echo Cada vez que lo abras se actualizara solo sin borrar tus personajes.
echo.
echo Abriendo HeroQuest DM ahora...
start "" "%USERPROFILE%\Desktop\HeroQuest_DM\ABRIR_HEROQUEST_DM.bat"
exit /b 0
