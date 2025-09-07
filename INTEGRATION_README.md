# Microservices Integration Guide

This document explains how to integrate and run the Registration and Participation microservices together.

## 🏗️ Architecture Overview

The integrated system consists of:

### Registration Service (Port 8081)

- **Purpose**: User authentication and management
- **Technology**: Spring Boot + Angular
- **Database**: PostgreSQL (Cloud/Local)
- **Features**:
  - User registration and login
  - JWT authentication
  - Password reset with email
  - Role-based access control

### Participation Service (Port 8082)

- **Purpose**: Event participation management
- **Technology**: Spring Boot + Angular
- **Database**: PostgreSQL (Local)
- **Features**:
  - Event registration forms
  - Participation tracking
  - User participation history

## 🔄 Integration Features

### Cross-Service Communication

- **Token Validation**: Participation service validates tokens with Registration service
- **User Synchronization**: User data is synchronized between services
- **Seamless Authentication**: Users login once and access both services

### Authentication Flow

1. User registers/logs in through Registration service (http://localhost:4200)
2. Registration service issues JWT token
3. User accesses Participation service (http://localhost:4201)
4. Participation service validates token with Registration service
5. User can participate in events without re-authentication

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Ports 4200, 4201, 8081, 8082, 5432, 5433 available

### Option 1: Using Setup Scripts (Recommended)

**Windows:**

```bash
setup-integration.bat
```

**Linux/Mac:**

```bash
chmod +x setup-integration.sh
./setup-integration.sh
```

### Option 2: Manual Setup

1. **Start the integrated services:**

```bash
cd integration-config
docker-compose up -d
```

2. **Wait for services to start (30-60 seconds)**

3. **Access the applications:**
   - Registration Frontend: http://localhost:4200
   - Participation Frontend: http://localhost:4201

## 📊 Service Endpoints

### Registration Service (http://localhost:8081)

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/integration/validate-token` - Token validation
- `GET /api/integration/user/{email}` - Get user by email
- `GET /api/integration/health` - Health check

### Participation Service (http://localhost:8082)

- `POST /api/auth/validate` - Validate token with Registration service
- `GET /data` - Get all participation data
- `POST /add` - Add new participation
- `PUT /update/{id}` - Update participation
- `DELETE /delete/{id}` - Delete participation
- `GET /api/users/health` - Health check

## 🔧 Configuration

### Environment Variables

**Registration Service:**

- `DB_HOST` - Database host (default: registration-db)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: registrationdb)
- `PARTICIPATION_SERVICE_URL` - Participation service URL

**Participation Service:**

- `DB_HOST` - Database host (default: participation-db)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (default: participationdb)
- `REGISTRATION_SERVICE_URL` - Registration service URL

### Database Configuration

The system uses two separate PostgreSQL databases:

- **Registration DB**: Port 5433 (to avoid conflicts)
- **Participation DB**: Port 5432

## 🔐 Security Features

### JWT Token Integration

- Tokens issued by Registration service
- Validated by Participation service
- Automatic token refresh handling
- Secure cross-service communication

### CORS Configuration

- Configured for cross-origin requests
- Supports both frontend applications
- Secure header handling

## 🧪 Testing the Integration

### 1. User Registration Flow

1. Go to http://localhost:4200
2. Register a new user
3. Verify email functionality (if configured)
4. Login with credentials

### 2. Cross-Service Authentication

1. After login, go to http://localhost:4201
2. You should be automatically authenticated
3. Fill out participation form
4. Verify data is saved

### 3. Token Validation

1. Open browser developer tools
2. Check localStorage for 'authToken'
3. Make API calls to participation service
4. Verify token is included in headers

## 🐛 Troubleshooting

### Common Issues

**Services won't start:**

```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean restart
docker-compose down -v
docker-compose up -d
```

**Database connection issues:**

```bash
# Check database containers
docker-compose ps

# Reset databases
docker-compose down -v
docker volume prune
docker-compose up -d
```

**Port conflicts:**

```bash
# Check what's using ports
netstat -tulpn | grep :8081
netstat -tulpn | grep :8082

# Kill processes or change ports in docker-compose.yml
```

**Authentication not working:**

- Check if Registration service is running
- Verify token in browser localStorage
- Check CORS configuration
- Ensure services can communicate

### Logs and Monitoring

**View all logs:**

```bash
docker-compose logs -f
```

**View specific service logs:**

```bash
docker-compose logs -f registration-service
docker-compose logs -f participation-service
```

**Check service health:**

```bash
curl http://localhost:8081/api/integration/health
curl http://localhost:8082/api/users/health
```

## 🔄 Development Workflow

### Making Changes

1. **Backend changes:**

   - Modify Java files
   - Rebuild: `docker-compose build [service-name]`
   - Restart: `docker-compose restart [service-name]`

2. **Frontend changes:**
   - Modify Angular files
   - Rebuild: `docker-compose build [frontend-service]`
   - Restart: `docker-compose restart [frontend-service]`

### Local Development

For faster development, you can run services locally:

1. **Start only databases:**

```bash
docker-compose up -d registration-db participation-db
```

2. **Run backend services locally:**

```bash
# Registration service
cd 1_Registration/fsd
./mvnw spring-boot:run

# Participation service
cd 2_Participation/backend
./mvnw spring-boot:run
```

3. **Run frontend services locally:**

```bash
# Registration frontend
cd 1_Registration/fsd-frontend
npm install
ng serve --port 4200

# Participation frontend
cd 2_Participation/frontend
npm install
ng serve --port 4201
```

## 📈 Scaling and Production

### Production Considerations

1. **Security:**

   - Use environment variables for secrets
   - Enable HTTPS
   - Configure proper CORS origins
   - Use production database credentials

2. **Performance:**

   - Add connection pooling
   - Configure caching
   - Use load balancers
   - Monitor service health

3. **Monitoring:**
   - Add logging aggregation
   - Set up health checks
   - Monitor database performance
   - Track API response times

### Deployment Options

1. **Docker Swarm:**

```bash
docker stack deploy -c docker-compose.yml microservices
```

2. **Kubernetes:**

   - Convert docker-compose to k8s manifests
   - Use Helm charts for deployment
   - Configure ingress controllers

3. **Cloud Platforms:**
   - AWS ECS/EKS
   - Google Cloud Run/GKE
   - Azure Container Instances/AKS

## 🤝 Contributing

When making changes to the integration:

1. Test both services independently
2. Test cross-service communication
3. Verify authentication flow
4. Update documentation
5. Test with Docker setup

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review service logs
3. Verify configuration
4. Test individual services
5. Check network connectivity between services

---

**Happy coding! 🚀**
