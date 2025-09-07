@echo off
echo 🚀 Starting Microservices (Simple Mode)
echo ========================================

echo 📋 Starting Registration Service Frontend...
start "Registration Frontend" cmd /k "cd 1_Registration\fsd-frontend && npm install && ng serve --port 4200"

echo ⏳ Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo 📋 Starting Participation Service Frontend...
start "Participation Frontend" cmd /k "cd 2_Participation\frontend && npm install && ng serve --port 4201"

echo ⏳ Waiting 5 seconds...
timeout /t 5 /nobreak >nul

echo 📋 Starting Registration Service Backend...
start "Registration Backend" cmd /k "cd 1_Registration\fsd && ./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081"

echo ⏳ Waiting 10 seconds...
timeout /t 10 /nobreak >nul

echo 📋 Starting Participation Service Backend...
start "Participation Backend" cmd /k "cd 2_Participation\backend && ./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8082"

echo.
echo 🎉 All services are starting!
echo.
echo 📊 Service URLs:
echo   Main Entry Point: http://localhost:4200
echo   Participation Form: http://localhost:4201 (auto-redirected after login)
echo.
echo 👤 User Flow:
echo   1. Go to http://localhost:4200
echo   2. New users: Click "New User? Register" → Fill form → Login
echo   3. Existing users: Click "Already Registered? Login"
echo   4. After login: Automatically redirected to participation form
echo   5. Fill participation form (username pre-filled) → Submit
echo.
echo ⚠️ Note: Services may take a few minutes to fully start
echo 💡 Check the individual terminal windows for startup progress
echo.
pause