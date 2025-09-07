@echo off
echo 🚀 Setting up Microservices Integration
echo ======================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "integration-config\logs" mkdir "integration-config\logs"
if not exist "1_Registration\fsd\logs" mkdir "1_Registration\fsd\logs"
if not exist "2_Participation\backend\logs" mkdir "2_Participation\backend\logs"

echo ✅ Directories created

REM Build and start services
echo 🔨 Building and starting services...
cd integration-config

REM Pull required images
echo 📥 Pulling required Docker images...
docker-compose pull

REM Build custom images
echo 🏗️ Building custom images...
docker-compose build

REM Start services
echo 🚀 Starting services...
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...

REM Check Registration Service
curl -f http://localhost:8081/api/integration/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Registration Service is healthy
) else (
    echo ⚠️ Registration Service might not be ready yet
)

REM Check Participation Service
curl -f http://localhost:8082/api/users/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Participation Service is healthy
) else (
    echo ⚠️ Participation Service might not be ready yet
)

echo.
echo 🎉 Integration setup complete!
echo.
echo 📊 Service URLs:
echo   Registration Service: http://localhost:8081
echo   Participation Service: http://localhost:8082
echo   Registration Frontend: http://localhost:4200
echo   Participation Frontend: http://localhost:4201
echo.
echo 🔧 Management Commands:
echo   View logs: docker-compose logs -f [service-name]
echo   Stop services: docker-compose down
echo   Restart services: docker-compose restart
echo   View status: docker-compose ps
echo.
echo 📝 User Flow:
echo   1. Open http://localhost:4200 (Registration Service)
echo   2. New users: Click "New User? Register" to create account
echo   3. Existing users: Click "Already Registered? Login"
echo   4. After registration, you'll be redirected to login page
echo   5. After login, you'll be automatically redirected to participation form
echo   6. Fill out participation form (username auto-filled) and submit
echo.
echo 🐛 Troubleshooting:
echo   - If services fail to start, check logs with: docker-compose logs
echo   - Ensure ports 4200, 4201, 8081, 8082, 5432, 5433 are available
echo   - For database issues, try: docker-compose down -v ^&^& docker-compose up -d

pause