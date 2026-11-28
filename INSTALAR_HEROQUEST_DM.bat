@echo off
chcp 65001 >nul
title Instalador 1-Clic - HeroQuest: Cronicas del Abismo
color 0B
set "HQ_BAT=%~f0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$raw = [System.IO.File]::ReadAllText($env:HQ_BAT, [System.Text.Encoding]::UTF8); $m = '###POWERSHELL_START###'; $idx = $raw.LastIndexOf($m); if ($idx -lt 0) { Write-Host 'Error interno del instalador.' -ForegroundColor Red; exit 1 }; $code = $raw.Substring($idx + $m.Length); & ([ScriptBlock]::Create($code))"
if errorlevel 1 (
  echo.
  echo Ocurrio un error durante la instalacion. Revisa el mensaje de arriba.
  pause
  exit /b 1
)
exit /b 0
###POWERSHELL_START###
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host '============================================================' -ForegroundColor Cyan
Write-Host '  INSTALADOR AUTOMATICO - HEROQUEST: CRONICAS DEL ABISMO' -ForegroundColor Yellow
Write-Host '  (Descarga, instala dependencias y crea acceso directo)' -ForegroundColor Gray
Write-Host '============================================================' -ForegroundColor Cyan
Write-Host ''

function Refresh-Path {
  $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
}

try {
  # 1. Verificar o instalar Node.js
  Refresh-Path
  $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
  if (-not $nodeCmd) {
    Write-Host '[1/4] Node.js no detectado. Instalando Node.js LTS automaticamente...' -ForegroundColor Yellow
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if ($winget) {
      & winget install -e --id OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
      Refresh-Path
      $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    }
    if (-not $nodeCmd) {
      Write-Host ''
      Write-Host '[AVISO] No se pudo instalar Node.js automaticamente.' -ForegroundColor Red
      Write-Host 'Se abrira la pagina oficial https://nodejs.org/' -ForegroundColor Yellow
      Write-Host 'Descarga e instala la version LTS y luego vuelve a abrir INSTALAR_HEROQUEST_DM.bat' -ForegroundColor Yellow
      Start-Process 'https://nodejs.org/'
      Read-Host 'Presiona ENTER para salir'
      exit 1
    }
  }
  Write-Host ("[1/4] Node.js listo (" + (& node -v) + ")") -ForegroundColor Green

  # 2. Descargar la ultima version limpia desde GitHub al Escritorio\HeroQuest_DM
  $repo = 'xZATANAZx/heroquest-cronicas-del-abismo'
  $desktop = [Environment]::GetFolderPath('Desktop')
  $dest = Join-Path $desktop 'HeroQuest_DM'
  if (-not (Test-Path $dest)) { New-Item -ItemType Directory -Path $dest -Force | Out-Null }

  Write-Host "[2/4] Descargando HeroQuest: Cronicas del Abismo en: $dest ..." -ForegroundColor Cyan
  $headers = @{ 'User-Agent' = 'HeroQuest-DM-Installer' }
  $tmpZip = Join-Path $env:TEMP ('hq_inst_' + [Guid]::NewGuid().ToString('N') + '.zip')
  $tmpDir = Join-Path $env:TEMP ('hq_inst_' + [Guid]::NewGuid().ToString('N'))

  Invoke-WebRequest -Uri ("https://github.com/$repo/archive/refs/heads/main.zip") -OutFile $tmpZip -Headers $headers -TimeoutSec 90 -UseBasicParsing
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::ExtractToDirectory($tmpZip, $tmpDir)

  $inner = Get-ChildItem -Directory $tmpDir | Select-Object -First 1
  if (-not $inner) { throw 'El paquete descargado no contiene archivos validos.' }

  $skip = @('.hq_data', 'node_modules', '.git', '.hq_version', 'campaign_heroes.json')
  Get-ChildItem -Force $inner.FullName | Where-Object { $skip -notcontains $_.Name } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $dest $_.Name) -Recurse -Force
  }

  try {
    $c = Invoke-RestMethod -Uri ("https://api.github.com/repos/$repo/commits/main") -Headers $headers -TimeoutSec 10 -UseBasicParsing
    if ($c.sha) { Set-Content -Path (Join-Path $dest '.hq_version') -Value $c.sha -NoNewline }
  } catch {}

  Remove-Item $tmpZip -Force -ErrorAction SilentlyContinue
  Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host '[2/4] Archivos descargados correctamente.' -ForegroundColor Green

  # 3. Instalar dependencias (npm install)
  Write-Host ''
  Write-Host '[3/4] Instalando dependencias (solo tarda ~1 minuto la primera vez)...' -ForegroundColor Cyan
  Push-Location $dest
  try {
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) { throw "npm install fallo con codigo $LASTEXITCODE" }
  } finally {
    Pop-Location
  }

  # 4. Crear acceso directo en el Escritorio y abrir
  Write-Host ''
  Write-Host '[4/4] Creando acceso directo "HeroQuest DM" en tu Escritorio...' -ForegroundColor Cyan
  $ws = New-Object -ComObject WScript.Shell
  $sc = $ws.CreateShortcut((Join-Path $desktop 'HeroQuest DM.lnk'))
  $sc.TargetPath = Join-Path $dest 'ABRIR_HEROQUEST_DM.bat'
  $sc.WorkingDirectory = $dest
  $sc.Save()

  Write-Host ''
  Write-Host '============================================================' -ForegroundColor Green
  Write-Host '  INSTALACION COMPLETADA CON EXITO!' -ForegroundColor Green
  Write-Host "  Carpeta: $dest" -ForegroundColor Gray
  Write-Host '  Acceso directo creado: Escritorio\HeroQuest DM' -ForegroundColor Yellow
  Write-Host '============================================================' -ForegroundColor Green
  Write-Host ''
  Write-Host 'Abriendo HeroQuest DM ahora...' -ForegroundColor Cyan
  Start-Process -FilePath (Join-Path $dest 'ABRIR_HEROQUEST_DM.bat') -WorkingDirectory $dest
  Start-Sleep -Seconds 2
  exit 0
} catch {
  Write-Host ''
  Write-Host ('[ERROR] ' + $_.Exception.Message) -ForegroundColor Red
  Read-Host 'Presiona ENTER para cerrar'
  exit 1
}
