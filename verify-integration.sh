#!/bin/bash

# Verification script for the integrated Java + React application
# This script verifies that both the API and frontend are working correctly

set -e

echo "🔍 Verifying Integrated Java + React Application"
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:5182"
API_URL="$BASE_URL/api"

# Function to check if server is running
check_server() {
    echo -e "${BLUE}Checking if server is running...${NC}"
    if curl -s "$BASE_URL" > /dev/null; then
        echo -e "${GREEN}✓ Server is running on $BASE_URL${NC}"
        return 0
    else
        echo -e "${RED}✗ Server is not running on $BASE_URL${NC}"
        echo "Please start the server first:"
        echo "  ./manage-java.sh start"
        return 1
    fi
}

# Function to test API endpoints
test_api() {
    echo -e "${BLUE}Testing API endpoints...${NC}"
    
    # Test GET /api/tutorials
    if curl -s "$API_URL/tutorials" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓ GET /api/tutorials - Working${NC}"
    else
        echo -e "${RED}✗ GET /api/tutorials - Failed${NC}"
        return 1
    fi
    
    # Test GET /api/tutorials/published
    if curl -s "$API_URL/tutorials/published" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓ GET /api/tutorials/published - Working${NC}"
    else
        echo -e "${RED}✗ GET /api/tutorials/published - Failed${NC}"
        return 1
    fi
    
    # Test GET /api/tutorials/categories
    if curl -s "$API_URL/tutorials/categories" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓ GET /api/tutorials/categories - Working${NC}"
    else
        echo -e "${RED}✗ GET /api/tutorials/categories - Failed${NC}"
        return 1
    fi
    
    # Test GET /api/tutorials/difficulty/beginner (test parameterized endpoint)
    if curl -s "$API_URL/tutorials/difficulty/beginner" | jq empty 2>/dev/null; then
        echo -e "${GREEN}✓ GET /api/tutorials/difficulty/beginner - Working${NC}"
    else
        echo -e "${RED}✗ GET /api/tutorials/difficulty/beginner - Failed${NC}"
        return 1
    fi
}

# Function to test frontend assets
test_frontend() {
    echo -e "${BLUE}Testing frontend assets...${NC}"
    
    # Test main HTML
    if curl -s "$BASE_URL/" | grep -q "React tutorials"; then
        echo -e "${GREEN}✓ Frontend HTML - Working${NC}"
    else
        echo -e "${RED}✗ Frontend HTML - Failed${NC}"
        return 1
    fi
    
    # Test static assets directory exists
    if [ -d "Tutorials/ClientApp/dist/assets" ]; then
        echo -e "${GREEN}✓ Frontend assets directory exists${NC}"
    else
        echo -e "${RED}✗ Frontend assets directory missing${NC}"
        return 1
    fi
    
    # Test that assets are served with correct content types
    local js_files=($(ls Tutorials/ClientApp/dist/assets/*.js 2>/dev/null | head -1))
    if [ ${#js_files[@]} -gt 0 ]; then
        local js_file=$(basename "${js_files[0]}")
        if curl -I "$BASE_URL/assets/$js_file" 2>/dev/null | grep -q "Content-Type: text/javascript"; then
            echo -e "${GREEN}✓ JavaScript assets served with correct content type${NC}"
        else
            echo -e "${RED}✗ JavaScript assets content type issue${NC}"
            return 1
        fi
    fi
    
    local css_files=($(ls Tutorials/ClientApp/dist/assets/*.css 2>/dev/null | head -1))
    if [ ${#css_files[@]} -gt 0 ]; then
        local css_file=$(basename "${css_files[0]}")
        if curl -I "$BASE_URL/assets/$css_file" 2>/dev/null | grep -q "Content-Type: text/css"; then
            echo -e "${GREEN}✓ CSS assets served with correct content type${NC}"
        else
            echo -e "${RED}✗ CSS assets content type issue${NC}"
            return 1
        fi
    fi
}

# Function to test SPA routing (frontend routes should fallback to index.html)
test_spa_routing() {
    echo -e "${BLUE}Testing SPA routing...${NC}"
    
    # Test that frontend routes return the main HTML (not 404)
    if curl -s "$BASE_URL/tutorials" | grep -q "React tutorials"; then
        echo -e "${GREEN}✓ SPA routing - /tutorials${NC}"
    else
        echo -e "${RED}✗ SPA routing - /tutorials failed${NC}"
        return 1
    fi
    
    if curl -s "$BASE_URL/published" | grep -q "React tutorials"; then
        echo -e "${GREEN}✓ SPA routing - /published${NC}"
    else
        echo -e "${RED}✗ SPA routing - /published failed${NC}"
        return 1
    fi
}

# Function to display summary
display_summary() {
    echo ""
    echo "================================================="
    echo -e "${GREEN}🎉 Integration Verification Complete!${NC}"
    echo ""
    echo "Your integrated Java + React application is working correctly:"
    echo ""
    echo "• API Server: $BASE_URL"
    echo "• Frontend: $BASE_URL"
    echo "• API Endpoints: $API_URL/*"
    echo ""
    echo "Next steps:"
    echo "1. Open $BASE_URL in your browser"
    echo "2. Navigate through the React frontend"
    echo "3. Test creating, editing, and viewing tutorials"
    echo "4. Verify all frontend features work with the .NET API"
    echo ""
    echo "For development workflow, use:"
    echo "  ./manage-java.sh start    # Start the integrated app"
    echo "  ./manage-java.sh build    # Build both frontend and backend"
}

# Main execution
main() {
    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}jq is required for JSON parsing. Please install it:${NC}"
        echo "  brew install jq  # On macOS"
        echo "  sudo apt install jq  # On Ubuntu/Debian"
        exit 1
    fi
    
    # Run all tests
    check_server || exit 1
    test_api || exit 1
    test_frontend || exit 1
    test_spa_routing || exit 1
    
    display_summary
}

# Run the main function
main
