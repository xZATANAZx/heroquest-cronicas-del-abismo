@echo off
title HeroQuest DM - Empaquetar Version Limpia para Compartir / Actualizar
color 0B
echo ============================================================
echo   HEROQUEST: CRONICAS DEL ABISMO
echo   Empaquetador Limpio (SIN tus heroes ni progreso personal)
echo ============================================================
echo.

cd /d "%~dp0"

if not exist "releases" mkdir "releases"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ProgressPreference = 'SilentlyContinue'; " ^
  "Add-Type -AssemblyName System.IO.Compression.FileSystem; " ^
  "$root = (Get-Location).Path; " ^
  "$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'; " ^
  "$zipPath = Join-Path $root ('releases\HeroQuest_DM_Limpio_' + $stamp + '.zip'); " ^
  "$tempDir = Join-Path $env:TEMP ('hq_clean_pkg_' + [Guid]::NewGuid().ToString('N')); " ^
  "New-Item -ItemType Directory -Path $tempDir | Out-Null; " ^
  "$exclude = @('.hq_data', 'node_modules', 'dist', '.git', 'releases', 'campaign_heroes.json', 'SUBIR_ACTUALIZACION.bat', 'EMPAQUETAR_PARA_COMPARTIR.bat'); " ^
  "Get-ChildItem -Force -Path $root | Where-Object { $exclude -notcontains $_.Name -and $_.Extension -ne '.zip' } | ForEach-Object { " ^
  "  Copy-Item -Path $_.FullName -Destination (Join-Path $tempDir $_.Name) -Recurse -Force " ^
  "}; " ^
  "if (Test-Path $zipPath) { Remove-Item $zipPath -Force }; " ^
  "[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $zipPath); " ^
  "Remove-Item -Path $tempDir -Recurse -Force; " ^
  "Write-Host ('LISTO! Paquete limpio creado en: ' + $zipPath) -ForegroundColor Green"

echo.
echo [INFO] Este ZIP NO contiene tus personajes ni tu progreso.
echo [INFO] - Si es la primera vez de tu amigo: lo descomprime y abre ABRIR_HEROQUEST_DM.bat
echo [INFO] - Si es una actualizacion: lo descomprime encima de su carpeta y elige "Reemplazar".
echo [INFO]   Sus personajes (.hq_data) y su campana NO se borran jamas.
echo.
pause
