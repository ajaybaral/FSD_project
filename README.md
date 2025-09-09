# FSD Merged - Full Stack Development Project

A comprehensive microservices-based application featuring user registration and event participation systems built with Spring Boot and Angular.

## 🏗️ Project Structure

```
FSD-Merged/
├── 1_Registration/                    # Registration Microservice
│   ├── fsd/                          # Spring Boot Backend
│   │   ├── src/main/java/com/fsd1/group_project/
│   │   │   ├── Config/               # Security & Configuration
│   │   │   ├── Controller/           # REST Controllers
│   │   │   ├── Entity/               # JPA Entities
│   │   │   ├── Repository/           # Data Access Layer
│   │   │   ├── Service/              # Business Logic
│   │   │   └── Utils/                # JWT Utilities
│   │   ├── pom.xml                   # Maven Dependencies
│   │   └── Dockerfile                # Docker Configuration
│   └── fsd-frontend/                 # Angular Frontend
│       ├── src/app/
│       │   ├── auth/                 # Authentication Components
│       │   ├── core/                 # Core Components & Services
│       │   ├── dashboard/            # Dashboard Components
│       │   └── shared/               # Shared Components
│       ├── package.json              # Node Dependencies
│       └── Dockerfile                # Docker Configuration
│
├── 2_Participation/                   # Participation Microservice
│   ├── backend/                      # Spring Boot Backend
│   │   ├── src/main/java/com/example/Participation/
│   │   │   ├── Controller/           # REST Controllers
│   │   │   ├── Entity/               # JPA Entities
│   │   │   ├── Repository/           # Data Access Layer
│   │   │   └── Service/              # Business Logic
│   │   ├── pom.xml                   # Maven Dependencies
│   │   └── Dockerfile                # Docker Configuration
│   └── frontend/                     # Angular Frontend
│       ├── src/app/
│       │   ├── auth/                 # Authentication Components
│       │   ├── core/                 # Core Components & Services
│       │   ├── form/                 # Participation Form
│       │   └── services/             # Angular Services
│       ├── package.json              # Node Dependencies
│       └── Dockerfile                # Docker Configuration
│
├── integration-config/               # Integration Configuration
│   └── docker-compose.yml           # Docker Compose Setup
├── shared-config/                    # Shared Configuration Files
├── setup-integration.bat            # Windows Setup Script
├── start-system.bat                 # Windows Start Script
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- **Java 17+** (for Spring Boot applications)
- **Node.js 18+** (for Angular applications)
- **Angular CLI** (`npm install -g @angular/cli`)
- **Maven 3.6+** (for building Spring Boot apps)
- **Git** (for version control)

### Option 1: Manual Setup (Recommended for Development)

#### 1. Clone the Repository

```bash
git clone https://github.com/Anshul-Khadatkar/FSD-Merged.git
cd FSD-Merged
```

#### 2. Start Registration Service

**Backend (Port 8080):**

```bash
cd 1_Registration/fsd
mvn clean install
mvn spring-boot:run
```

**Frontend (Port 4200):**

```bash
cd 1_Registration/fsd-frontend
npm install
ng serve --port 4200
```

#### 3. Start Participation Service

**Backend (Port 8081):**

```bash
cd 2_Participation/backend
mvn clean install
mvn spring-boot:run
```

**Frontend (Port 4201):**

```bash
cd 2_Participation/frontend
npm install
ng serve --port 4201
```

### Option 2: Using Batch Scripts (Windows)

#### Quick Start Script

```bash
# Start both services automatically
start-system.bat
```

#### Individual Service Scripts

```bash
# Setup integration
setup-integration.bat

# Start registration service only
cd 1_Registration/fsd-frontend
ng serve --port 4200

# Start participation service only
cd 2_Participation/frontend
ng serve --port 4201
```

### Option 3: Docker Setup

#### Build and Run with Docker Compose

```bash
cd integration-config
docker-compose up --build
```

## 🌐 Service URLs

| Service           | Component   | URL                   | Description               |
| ----------------- | ----------- | --------------------- | ------------------------- |
| **Registration**  | Frontend    | http://localhost:4200 | User registration & login |
| **Registration**  | Backend API | http://localhost:8080 | Authentication API        |
| **Participation** | Frontend    | http://localhost:4201 | Event participation       |
| **Participation** | Backend API | http://localhost:8081 | Participation API         |

## 🔧 Configuration

### Database Configuration

**Registration Service (application.properties):**

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

**Participation Service (application.properties):**

```properties
spring.datasource.url=jdbc:h2:mem:participationdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

### Cross-Origin Configuration

Both services are configured to allow cross-origin requests:

- Registration Frontend (4200) ↔ Registration Backend (8080)
- Participation Frontend (4201) ↔ Participation Backend (8081)
- Cross-service communication between Registration and Participation

## 🔐 Authentication Flow

1. **User Registration/Login** → Registration Service (Port 4200)
2. **JWT Token Generation** → Registration Backend (Port 8080)
3. **Redirect to Participation** → Participation Service (Port 4201)
4. **Token Validation** → Cross-service authentication
5. **Access Participation Features** → Authenticated user experience

### Authentication Integration

The services communicate using JWT tokens:

```javascript
// Registration service redirects with token
window.location.href = `http://localhost:4201?token=${token}&username=${username}`;

// Participation service validates token
const token = localStorage.getItem("authToken");
const username = localStorage.getItem("username");
```

## 🎨 UI Features

### Registration Service

- ✅ **Clean green theme** with professional styling
- ✅ **Responsive design** for all screen sizes
- ✅ **Form validation** with error handling
- ✅ **JWT-based authentication**
- ✅ **Dashboard** with user management

### Participation Service

- ✅ **White background** with clean design
- ✅ **Form with borders and shadows**
- ✅ **Cross-service authentication**
- ✅ **Event participation management**
- ✅ **Success confirmation** system

## 🧪 Testing the Integration

### Manual Testing Steps

1. **Start both services** using the commands above
2. **Navigate to Registration** → http://localhost:4200
3. **Create a new account** or login with existing credentials
4. **Automatic redirect** → http://localhost:4201 (with authentication)
5. **Access participation features** → Fill out event participation form
6. **Submit form** → Confirm successful participation

### API Testing

**Registration Endpoints:**

```bash
# Register new user
POST http://localhost:8080/api/auth/register
Content-Type: application/json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

# Login user
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "username": "testuser",
  "password": "password123"
}
```

**Participation Endpoints:**

```bash
# Submit participation
POST http://localhost:8081/api/participation/submit
Authorization: Bearer <jwt-token>
Content-Type: application/json
{
  "username": "testuser",
  "referralSource": "Social Media",
  "type": "Internal",
  "age": 25,
  "gender": "Male"
}
```

## 🔧 Development Commands

### Registration Service Development

```bash
# Backend development
cd 1_Registration/fsd
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend development with hot reload
cd 1_Registration/fsd-frontend
ng serve --port 4200 --open

# Build for production
ng build --prod
```

### Participation Service Development

```bash
# Backend development
cd 2_Participation/backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend development with hot reload
cd 2_Participation/frontend
ng serve --port 4201 --open

# Build for production
ng build --prod
```

## 🐳 Docker Commands

### Individual Service Containers

```bash
# Build Registration Service
cd 1_Registration/fsd
docker build -t registration-backend .

cd 1_Registration/fsd-frontend
docker build -t registration-frontend .

# Build Participation Service
cd 2_Participation/backend
docker build -t participation-backend .

cd 2_Participation/frontend
docker build -t participation-frontend .

# Run containers
docker run -p 8080:8080 registration-backend
docker run -p 4200:80 registration-frontend
docker run -p 8081:8081 participation-backend
docker run -p 4201:80 participation-frontend
```

### Docker Compose

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build
```

## 🔌 Adding New Microservices

### Step 1: Create Service Structure

```bash
mkdir 3_NewService
cd 3_NewService

# Create backend
mkdir backend
cd backend
# Initialize Spring Boot project

# Create frontend
mkdir frontend
cd frontend
# Initialize Angular project
```

### Step 2: Backend Integration

**Add to new service's `application.properties`:**

```properties
# Service configuration
server.port=8082
spring.application.name=new-service

# Database configuration
spring.datasource.url=jdbc:h2:mem:newservicedb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password

# CORS configuration
cors.allowed-origins=http://localhost:4202
```

**Create Service Integration Controller:**

```java
@RestController
@RequestMapping("/api/integration")
@CrossOrigin(origins = "http://localhost:4202")
public class IntegrationController {

    @PostMapping("/validate-user")
    public ResponseEntity<?> validateUser(@RequestHeader("Authorization") String token) {
        // Validate JWT token from registration service
        // Return user information
    }
}
```

### Step 3: Frontend Integration

**Update Angular environment:**

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:8082/api",
  registrationServiceUrl: "http://localhost:4200",
  participationServiceUrl: "http://localhost:4201",
};
```

**Add Authentication Service:**

```typescript
@Injectable()
export class AuthIntegrationService {
  constructor(private http: HttpClient) {}

  validateToken(token: string): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/integration/validate-user`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
```

### Step 4: Update Docker Configuration

**Add to `docker-compose.yml`:**

```yaml
services:
  new-service-backend:
    build: ./3_NewService/backend
    ports:
      - "8082:8082"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    depends_on:
      - registration-backend

  new-service-frontend:
    build: ./3_NewService/frontend
    ports:
      - "4202:80"
    depends_on:
      - new-service-backend
```

### Step 5: Service Discovery Pattern

**Create Shared Configuration:**

```java
// shared-config/ServiceRegistry.java
@Component
public class ServiceRegistry {
    private Map<String, String> services = Map.of(
        "registration", "http://localhost:8080",
        "participation", "http://localhost:8081",
        "new-service", "http://localhost:8082"
    );

    public String getServiceUrl(String serviceName) {
        return services.get(serviceName);
    }
}
```

## 🔒 Security Considerations

### JWT Token Management

- **Token Expiration**: 24 hours (configurable)
- **Refresh Tokens**: Implement for production
- **Secure Storage**: Use httpOnly cookies in production

### CORS Configuration

- **Development**: Allow localhost origins
- **Production**: Restrict to specific domains

### Database Security

- **H2 Console**: Disable in production
- **Connection Pooling**: Configure for production
- **Data Encryption**: Implement for sensitive data

## 📊 Monitoring & Logging

### Application Logs

```bash
# View registration service logs
tail -f 1_Registration/fsd/logs/application.log

# View participation service logs
tail -f 2_Participation/logs/participation-app.log
```

### Health Checks

```bash
# Registration service health
curl http://localhost:8080/actuator/health

# Participation service health
curl http://localhost:8081/actuator/health
```

## 🚀 Production Deployment

### Environment Variables

**Registration Service:**

```bash
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:postgresql://localhost:5432/registration
export JWT_SECRET=your-production-secret
export CORS_ORIGINS=https://yourdomain.com
```

**Participation Service:**

```bash
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:postgresql://localhost:5432/participation
export REGISTRATION_SERVICE_URL=https://registration.yourdomain.com
```

### Build Commands

```bash
# Build all services for production
./build-production.sh

# Or manually:
cd 1_Registration/fsd && mvn clean package -Pprod
cd 1_Registration/fsd-frontend && ng build --prod
cd 2_Participation/backend && mvn clean package -Pprod
cd 2_Participation/frontend && ng build --prod
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: B1-Group 2
- **Project Type**: Full Stack Development (FSD)
- **Architecture**: Microservices with Angular & Spring Boot

## 📞 Support

For support and questions:

- **Create an issue** in the GitHub repository
- **Check existing documentation** in the `/docs` folder
- **Review integration logs** for troubleshooting

---

## 🎯 Next Steps

1. **Add Database Persistence** → Replace H2 with PostgreSQL/MySQL
2. **Implement API Gateway** → Centralize routing and authentication
3. **Add Service Discovery** → Use Eureka or Consul
4. **Implement Monitoring** → Add Prometheus and Grafana
5. **Add Testing** → Unit tests, integration tests, and E2E tests
6. **CI/CD Pipeline** → GitHub Actions or Jenkins
7. **Load Balancing** → Nginx or HAProxy
8. **Caching Layer** → Redis for session management

Happy coding! 🚀
#   F S D _ p r o j e c t  
 