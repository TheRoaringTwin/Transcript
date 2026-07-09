@echo off
echo ========================================
echo Transcript to PDF - Backend Server
echo ========================================
echo.
echo Installing dependencies (if needed)...
cd server
call npm install
echo.
echo Starting backend server on port 3001...
call npm start
pause
