#!/bin/bash

echo "🧪 Testing Microservices Integration"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $response, expected $expected_status)"
        return 1
    fi
}

# Test with JSON data
test_endpoint_json() {
    local url=$1
    local description=$2
    local data=$3
    local expected_status=${4:-200}
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Content-Type: application/json" \
        -d "$data" \
        "$url")
    
    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $response, expected $expected_status)"
        return 1
    fi
}

echo "🏥 Health Checks"
echo "----------------"

# Test service health endpoints
test_endpoint "http://localhost:8081/api/integration/health" "Registration Service Health"
test_endpoint "http://localhost:8082/api/users/health" "Participation Service Health"

echo ""
echo "🌐 Frontend Accessibility"
echo "-------------------------"

# Test frontend accessibility
test_endpoint "http://localhost:4200" "Registration Frontend"
test_endpoint "http://localhost:4201" "Participation Frontend"

echo ""
echo "🔌 API Endpoints"
echo "----------------"

# Test Registration Service APIs
test_endpoint "http://localhost:8081/api/auth/signup" "Registration Signup Endpoint" 405
test_endpoint "http://localhost:8081/api/auth/login" "Registration Login Endpoint" 405

# Test Participation Service APIs
test_endpoint "http://localhost:8082/data" "Participation Data Endpoint"
test_endpoint "http://localhost:8082/api/auth/validate" "Participation Auth Validation" 400

echo ""
echo "🔐 Authentication Integration"
echo "-----------------------------"

# Test token validation (should fail without valid token)
test_endpoint_json "http://localhost:8082/api/auth/validate" \
    "Token Validation (Invalid Token)" \
    '{"token":"invalid-token"}' \
    401

echo ""
echo "🗄️ Database Connectivity"
echo "------------------------"

# Check if databases are accessible
echo -n "Testing Registration Database... "
if docker exec integration-config_registration-db_1 pg_isready -U postgres >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

echo -n "Testing Participation Database... "
if docker exec integration-config_participation-db_1 pg_isready -U postgres >/dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

echo ""
echo "📊 Service Status"
echo "-----------------"

# Check Docker containers
echo "Docker Container Status:"
docker-compose -f integration-config/docker-compose.yml ps

echo ""
echo "🎯 Integration Test Summary"
echo "==========================="

# Test cross-service communication
echo "Testing cross-service communication..."

# Create a test user (this will fail if registration service is not working)
echo -n "Testing user registration flow... "
registration_response=$(curl -s -w "%{http_code}" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123",
        "clg_name": "Test College",
        "phone_no": "1234567890"
    }' \
    "http://localhost:8081/api/auth/signup")

if [[ "$registration_response" == *"201"* ]] || [[ "$registration_response" == *"400"* ]]; then
    echo -e "${GREEN}✅ PASS${NC} (Service responding)"
else
    echo -e "${RED}❌ FAIL${NC} (Service not responding properly)"
fi

echo ""
echo "📋 Manual Testing Steps"
echo "======================="
echo "1. Open http://localhost:4200 in your browser"
echo "2. Register a new user account"
echo "3. Login with your credentials"
echo "4. Open http://localhost:4201 in another tab"
echo "5. Verify you can access participation features without re-login"
echo "6. Fill out a participation form"
echo "7. Verify the data is saved and displayed"

echo ""
echo "🔧 Useful Commands"
echo "=================="
echo "View logs: docker-compose -f integration-config/docker-compose.yml logs -f"
echo "Restart services: docker-compose -f integration-config/docker-compose.yml restart"
echo "Stop services: docker-compose -f integration-config/docker-compose.yml down"
echo "Check status: docker-compose -f integration-config/docker-compose.yml ps"

echo ""
echo -e "${YELLOW}🎉 Integration test completed!${NC}"
echo "If any tests failed, check the logs and troubleshooting guide in INTEGRATION_README.md"