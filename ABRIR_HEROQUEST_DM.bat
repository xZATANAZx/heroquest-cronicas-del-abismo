@echo off
chcp 65001 >nul
title HeroQuest: Cronicas del Abismo - Panel del DM
color 0E
cd /d "%~dp0"

echo ============================================================
echo   HEROQUEST: CRONICAS DEL ABISMO (Sistema HQ-D20 v6)
echo   Panel del DM + Conexion QR para Celulares
echo ============================================================
echo.

:: 1. Verificar Node.js
where node >nul 2>nul
if errorlevel 1 (
  echo [AVISO] Node.js no esta instalado en esta PC.
  echo Intentando instalar Node.js LTS automaticamente...
  winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
  if errorlevel 1 (
    echo Por favor instala Node.js desde https://nodejs.org/ y vuelve a abrir este archivo.
    start "" https://nodejs.org/
    pause
    exit /b 1
  )
  echo Node.js instalado! Cierra esta ventana y vuelve a abrir ABRIR_HEROQUEST_DM.bat
  pause
  exit /b 0
)

:: 2. Auto-actualizacion silenciosa desde GitHub (solo en copias instaladas sin .git)
if exist ".git" goto :skip_update
echo Buscando actualizaciones automaticas...
set "HQ_BAT=%~f0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$raw = [System.IO.File]::ReadAllText($env:HQ_BAT, [System.Text.Encoding]::UTF8); $m = '###UPDATER_START###'; $idx = $raw.LastIndexOf($m); if ($idx -ge 0) { & ([ScriptBlock]::Create($raw.Substring($idx + $m.Length))) }"
:skip_update

if exist ".hq_need_install" (
  echo Actualizando paquetes nuevos...
  call npm install
  del /f /q ".hq_need_install" >nul 2>nul
)

if not exist "node_modules" (
  echo Instalando dependencias por primera vez, espera un momento...
  call npm install
)

echo.
echo Abriendo tu navegador en http://localhost:5173 ...
echo Si Windows Firewall pregunta, pulsa "Permitir acceso" en Red Privada
echo para que los celulares de tus jugadores puedan escanear los QR.
echo.
start "" http://localhost:5173

echo [NO CIERRES ESTA VENTANA MIENTRAS JUEGAN]
echo.
call npm run dev -- --host
pause
exit /b 0
###UPDATER_START###
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$repo = 'xZATANAZx/heroquest-cronicas-del-abismo'
$root = (Get-Location).Path
$verFile = Join-Path $root '.hq_version'
$localSha = if (Test-Path $verFile) { (Get-Content $verFile -Raw).Trim() } else { '' }
try {
  $headers = @{ 'User-Agent' = 'HeroQuest-DM-Updater' }
  $commit = Invoke-RestMethod -Uri ("https://api.github.com/repos/$repo/commits/main") -Headers $headers -TimeoutSec 6 -UseBasicParsing
  $remoteSha = $commit.sha
  if ($remoteSha -and $remoteSha -ne $localSha) {
    Write-Host 'Nueva actualizacion encontrada! Descargando...' -ForegroundColor Cyan
    $tmpZip = Join-Path $env:TEMP ('hq_upd_' + [Guid]::NewGuid().ToString('N') + '.zip')
    $tmpDir = Join-Path $env:TEMP ('hq_upd_' + [Guid]::NewGuid().ToString('N'))
    Invoke-WebRequest -Uri ("https://github.com/$repo/archive/refs/heads/main.zip") -OutFile $tmpZip -Headers $headers -TimeoutSec 45 -UseBasicParsing
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($tmpZip, $tmpDir)
    $inner = Get-ChildItem -Directory $tmpDir | Select-Object -First 1
    $oldPkg = if (Test-Path (Join-Path $root 'package.json')) { (Get-FileHash (Join-Path $root 'package.json')).Hash } else { '' }
    $skip = @('.hq_data', 'node_modules', '.git', '.hq_version', 'campaign_heroes.json')
    Get-ChildItem -Force $inner.FullName | Where-Object { $skip -notcontains $_.Name } | ForEach-Object {
      Copy-Item -Path $_.FullName -Destination (Join-Path $root $_.Name) -Recurse -Force
    }
    Set-Content -Path $verFile -Value $remoteSha -NoNewline
    $newPkg = if (Test-Path (Join-Path $root 'package.json')) { (Get-FileHash (Join-Path $root 'package.json')).Hash } else { '' }
    if ($oldPkg -ne $newPkg) { Set-Content -Path (Join-Path $root '.hq_need_install') -Value '1' }
    Remove-Item $tmpZip -Force -ErrorAction SilentlyContinue
    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host 'Actualizado correctamente! Tus heroes y campana siguen intactos.' -ForegroundColor Green
  } else {
    Write-Host 'Ya tienes la version mas reciente.' -ForegroundColor Green
  }
} catch {
  Write-Host 'Sin conexion para buscar actualizaciones (iniciando en modo normal)...' -ForegroundColor DarkGray
}
