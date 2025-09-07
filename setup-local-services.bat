@echo off
echo 🚀 Setting up Local Microservices
echo ==================================

echo 📋 This setup assumes you have PostgreSQL installed locally
echo 📋 If you don't have PostgreSQL, please install it first
echo.

echo 🔧 Setting up databases...
echo Creating registration database on port 5433...
echo Creating participation database on port 5432...
echo.

echo 📝 Manual Database Setup Required:
echo 1. Make sure PostgreSQL is running
echo 2. Create database 'registrationdb' on port 5433 (or default 5432)
echo 3. Create database 'participationdb' on port 5432
echo 4. Username: postgres, Password: root
echo.

echo 🚀 Starting services...
echo.

echo 📋 Starting Registration Frontend (Port 4200)...
start "Registration Frontend" cmd /k "cd 1_Registration\fsd-frontend && ng serve --port 4200"

timeout /t 3 /nobreak >nul

echo 📋 Starting Participation Frontend (Port 4201)...
start "Participation Frontend" cmd /k "cd 2_Participation\frontend && ng serve --port 4201"

timeout /t 3 /nobreak >nul

echo 📋 Starting Registration Backend (Port 8081)...
start "Registration Backend" cmd /k "cd 1_Registration\fsd && ./mvnw spring-boot:run"

timeout /t 5 /nobreak >nul

echo 📋 Starting Participation Backend (Port 8082)...
start "Participation Backend" cmd /k "cd 2_Participation\backend && ./mvnw spring-boot:run"

echo.
echo 🎉 All services are starting!
echo.
echo 📊 Service URLs:
echo   Registration Frontend: http://localhost:4200
echo   Participation Frontend: http://localhost:4201
echo   Registration Backend: http://localhost:8081
echo   Participation Backend: http://localhost:8082
echo.
echo 📝 User Flow:
echo   1. Go to http://localhost:4200
echo   2. Register a new user
echo   3. Login with your credentials
echo   4. Go to http://localhost:4201
echo   5. Fill participation form and submit
echo.
echo ⚠️ Note: Make sure PostgreSQL databases are set up as mentioned above
echo.
pause