@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ================================
echo   Clawd File Feed Mod - Enable
echo ================================
echo.
node scripts\enable.js
echo.
pause
