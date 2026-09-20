@echo off
setlocal
cd /d "%~dp0"
start "QACAI" "http://127.0.0.1:8765/index.html"
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8765
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8765
  goto :eof
)
where node >nul 2>nul
if %errorlevel%==0 (
  node serve.cjs
  goto :eof
)
echo Python veya Node.js bulunamadi.
echo Python ya da Node.js kurduktan sonra tekrar calistirin.
pause
