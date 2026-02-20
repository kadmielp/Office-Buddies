@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

where node >nul 2>nul
if errorlevel 1 (
  echo Error: node is not installed or not in PATH.
  exit /b 1
)

if not "%~1"=="" (
  set "ANIM_STUDIO_PORT=%~1"
)

node tools/animation-studio/server.js
endlocal
