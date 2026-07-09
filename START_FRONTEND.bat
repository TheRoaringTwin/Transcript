@echo off
echo ========================================
echo Transcript to PDF - React Frontend
echo ========================================
echo.
echo Make sure the backend server is already running!
echo If not, run START_BACKEND.bat first
echo.
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting React app on port 3000...
echo Browser will open automatically...
call npm start
pause
