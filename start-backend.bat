@echo off
echo Checking port 8082...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8082 " 2^>nul') do (
    echo Killing process %%a on port 8082...
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo Starting AgroPulse Backend with H2 profile on port 8082...
cd /d "%~dp0backend"
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
