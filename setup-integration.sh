#!/bin/bash

echo "🚀 Setting up Microservices Integration"
echo "======================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists docker; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p integration-config/logs
mkdir -p 1_Registration/fsd/logs
mkdir -p 2_Participation/backend/logs

# Set permissions for log directories
chmod 755 integration-config/logs
chmod 755 1_Registration/fsd/logs
chmod 755 2_Participation/backend/logs

echo "✅ Directories created"

# Build and start services
echo "🔨 Building and starting services..."
cd integration-config

# Pull required images
echo "📥 Pulling required Docker images..."
docker-compose pull

# Build custom images
echo "🏗️ Building custom images..."
docker-compose build

# Start services
echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🏥 Checking service health..."

# Check Registration Service
if curl -f http://localhost:8081/api/integration/health >/dev/null 2>&1; then
    echo "✅ Registration Service is healthy"
else
    echo "⚠️ Registration Service might not be ready yet"
fi

# Check Participation Service
if curl -f http://localhost:8082/api/users/health >/dev/null 2>&1; then
    echo "✅ Participation Service is healthy"
else
    echo "⚠️ Participation Service might not be ready yet"
fi

echo ""
echo "🎉 Integration setup complete!"
echo ""
echo "📊 Service URLs:"
echo "  Registration Service: http://localhost:8081"
echo "  Participation Service: http://localhost:8082"
echo "  Registration Frontend: http://localhost:4200"
echo "  Participation Frontend: http://localhost:4201"
echo ""
echo "🔧 Management Commands:"
echo "  View logs: docker-compose logs -f [service-name]"
echo "  Stop services: docker-compose down"
echo "  Restart services: docker-compose restart"
echo "  View status: docker-compose ps"
echo ""
echo "📝 Next Steps:"
echo "  1. Open http://localhost:4200 to register a new user"
echo "  2. After registration, go to http://localhost:4201 to participate in events"
echo "  3. The services will automatically communicate with each other"
echo ""
echo "🐛 Troubleshooting:"
echo "  - If services fail to start, check logs with: docker-compose logs"
echo "  - Ensure ports 4200, 4201, 8081, 8082, 5432, 5433 are available"
echo "  - For database issues, try: docker-compose down -v && docker-compose up -d"