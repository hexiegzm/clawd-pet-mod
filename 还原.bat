@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ================================
echo   Clawd File Feed Mod - Disable
echo ================================
echo.
node scripts\disable.js
echo.
pause
