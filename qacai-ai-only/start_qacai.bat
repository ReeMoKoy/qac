@echo off
setlocal
if "%QAC_ADMIN_PASSWORD%"=="" set /p QAC_ADMIN_PASSWORD=ReeMoKoy yonetici sifresini gir: 
node server.cjs
