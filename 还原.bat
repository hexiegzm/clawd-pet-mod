@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ================================
echo   Clawd 文件喂食 Mod — 还原
echo ================================
echo.
node scripts\disable.js
echo.
echo 按任意键关闭...
pause >nul
