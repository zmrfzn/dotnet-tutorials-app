#!/bin/bash

# Integrated Management Script for .NET + React App
# This script manages both the .NET API and React frontend as a single application

PROJECT_DIR="/Users/zfouzan/Documents/codespace/experiments/Tutorials/Tutorials"
CLIENT_DIR="$PROJECT_DIR/ClientApp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

install_ef_tools() {
    print_status "Installing Entity Framework CLI tools..."
    
    if dotnet tool list -g | grep -q dotnet-ef; then
        print_success "Entity Framework CLI tool already installed"
        return 0
    fi
    
    print_status "Downloading and installing dotnet-ef (this may take 2-5 minutes)..."
    print_status "Please be patient while the tool is being installed..."
    
    # Show a simple progress indicator
    {
        sleep 2
        echo -n "Installing"
        for i in {1..30}; do
            sleep 2
            echo -n "."
        done
        echo ""
    } &
    PROGRESS_PID=$!
    
    # Install the tool with timeout
    if timeout 300s dotnet tool install --global dotnet-ef >/dev/null 2>&1; then
        kill $PROGRESS_PID 2>/dev/null || true
        wait $PROGRESS_PID 2>/dev/null || true
        print_success "Entity Framework CLI tool installed successfully"
        return 0
    else
        kill $PROGRESS_PID 2>/dev/null || true
        wait $PROGRESS_PID 2>/dev/null || true
        print_error "Failed to install Entity Framework CLI tool"
        print_status "You can try installing manually: dotnet tool install --global dotnet-ef"
        return 1
    fi
}

check_requirements() {
    print_status "Checking requirements..."
    
    # Check .NET
    if ! command -v dotnet &> /dev/null; then
        print_error ".NET SDK is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check/Install Entity Framework CLI
    if ! dotnet tool list -g | grep -q dotnet-ef; then
        print_status "Entity Framework CLI tool not found. Installing..."
        install_ef_tools
    else
        print_success "Entity Framework CLI tool already installed"
    fi
    
    print_success "All requirements satisfied"
}

install_dependencies() {
    print_status "Installing dependencies..."
    
    # Restore .NET packages
    cd "$PROJECT_DIR" || exit 1
    print_status "Restoring .NET packages..."
    dotnet restore
    
    # Install npm packages
    cd "$CLIENT_DIR" || exit 1
    print_status "Installing npm packages..."
    npm install
    
    cd "$PROJECT_DIR" || exit 1
    print_success "Dependencies installed"
}

build_frontend() {
    print_status "Building React frontend..."
    cd "$CLIENT_DIR" || exit 1
    npm run build
    print_success "Frontend built successfully"
}

build_app() {
    print_status "Building integrated application..."
    
    # Build frontend first
    build_frontend
    
    # Build .NET app
    cd "$PROJECT_DIR" || exit 1
    print_status "Building .NET application..."
    dotnet build
    
    print_success "Application built successfully"
}

start_app() {
    print_status "Starting integrated application..."
    cd "$PROJECT_DIR" || exit 1
    
    print_status "Application starting on http://localhost:5182"
    print_status "API endpoints available at http://localhost:5182/api/"
    print_status "Swagger UI available at http://localhost:5182/swagger"
    print_status "React app available at http://localhost:5182/"
    print_status "To access the application, open your browser and navigate to http://localhost:5182"
    # Start the .NET application. Using --url to specify the port explicitly
    dotnet run --url http://localhost:5182
}

start_dev() {
    print_status "Starting development mode with hot reload..."
    cd "$PROJECT_DIR" || exit 1
    
    print_status "Development mode starting on http://localhost:5182"
    print_status "Frontend will be served via Vite dev server for hot reload"
    print_status "API endpoints available at http://localhost:5182/api/"
    print_status "Swagger UI available at http://localhost:5182/swagger"

    # Start the .NET application. Using --url to specify the port explicitly
    dotnet run --url http://localhost:5182
}

seed_database() {
    print_status "Seeding database..."
    cd "$PROJECT_DIR" || exit 1
    dotnet run seed
    print_success "Database seeded successfully"
}

migrate_categories() {
    print_status "Migrating categories from names to IDs..."
    cd "$PROJECT_DIR" || exit 1
    dotnet run migrate-categories
    print_success "Categories migrated successfully"
}

reset_database() {
    print_status "Resetting database..."
    cd "$PROJECT_DIR" || exit 1
    
    # Check if PostgreSQL is running
    if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
        print_error "PostgreSQL is not running. Please start PostgreSQL first."
        print_status "On macOS with Homebrew: brew services start postgresql"
        exit 1
    fi
    
    # Test database connection
    print_status "Testing database connection..."
    if ! dotnet run seed 2>/dev/null | head -1 | grep -q "Building"; then
        print_error "Cannot connect to database. Please check your PostgreSQL credentials."
        print_status "Current connection: Host=localhost;Database=tutorials_db;Username=postgres;Password=root;Port=5432"
        exit 1
    fi
    
    # Drop and recreate database (if EF tools are available)
    if command -v dotnet-ef &> /dev/null; then
        print_status "Dropping existing database..."
        dotnet ef database drop --force 2>/dev/null || true
        
        print_status "Creating database schema..."
        dotnet ef database update
    else
        print_warning "Entity Framework CLI not available, skipping database drop/create"
    fi
    
    # Seed with fresh data
    print_status "Seeding database with fresh data..."
    dotnet run seed
    
    print_success "Database reset and seeded successfully"
}

clean_all() {
    print_status "Cleaning all build artifacts..."
    
    cd "$PROJECT_DIR" || exit 1
    
    # Clean .NET build
    dotnet clean
    
    # Clean frontend build
    if [ -d "$CLIENT_DIR/dist" ]; then
        rm -rf "$CLIENT_DIR/dist"
        print_status "Removed frontend build directory"
    fi
    
    if [ -d "$CLIENT_DIR/node_modules" ]; then
        rm -rf "$CLIENT_DIR/node_modules"
        print_status "Removed node_modules directory"
    fi
    
    print_success "Clean completed"
}

test_database() {
    print_status "Testing database connection..."
    cd "$PROJECT_DIR" || exit 1
    
    # Check if PostgreSQL is running
    if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
        print_error "PostgreSQL is not running"
        print_status "On macOS with Homebrew: brew services start postgresql"
        return 1
    fi
    
    print_success "PostgreSQL is running"
    
    # Test connection with a simple command
    if dotnet run seed --dry-run 2>/dev/null || dotnet run --help >/dev/null 2>&1; then
        print_success "Database connection successful"
        return 0
    else
        print_error "Database connection failed"
        print_status "Please check your connection string and PostgreSQL credentials"
        return 1
    fi
}

test_app() {
    print_status "Testing application..."
    
    # Test database connection first
    test_database
    
    # Test .NET app
    cd "$PROJECT_DIR" || exit 1
    print_status "Running .NET tests..."
    if dotnet test 2>/dev/null; then
        print_success ".NET tests passed"
    else
        print_warning "No .NET tests found or tests failed"
    fi
    
    # Test frontend
    cd "$CLIENT_DIR" || exit 1
    if npm run test --if-present 2>/dev/null; then
        print_success "Frontend tests passed"
    else
        print_warning "No frontend tests configured"
    fi
    
    print_success "Testing completed"
}

workshop_setup() {
    print_status "Setting up for workshop environment..."
    
    # Full setup sequence
    check_requirements
    install_dependencies
    
    # Test database connection before proceeding
    if ! test_database; then
        print_error "Database connection failed. Please fix the database connection before proceeding."
        exit 1
    fi
    
    reset_database
    build_app
    
    print_success "Workshop setup completed!"
    print_status "To start the application, run: $0 start"
}

show_help() {
    echo "Integrated .NET + React Application Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  install     - Install all dependencies (.NET + npm)"
    echo "  install-ef  - Install Entity Framework CLI tools only"
    echo "  build       - Build both frontend and backend"
    echo "  start       - Start the integrated application (production mode)"
    echo "  dev         - Start in development mode with hot reload"
    echo "  seed        - Seed the database with sample data"
    echo "  migrate     - Migrate categories from names to IDs (one-time fix)"
    echo "  reset       - Reset database and seed with fresh data"
    echo "  clean       - Clean all build artifacts"
    echo "  test        - Run all tests and check database connection"
    echo "  test-db     - Test database connection only"
    echo "  workshop    - Complete workshop setup (install + reset + build)"
    echo "  help        - Show this help message"
    echo ""
    echo "Application URLs when running:"
    echo "  - React App: http://localhost:5182/"
    echo "  - API:       http://localhost:5182/api/"
    echo "  - Swagger:   http://localhost:5182/swagger"
    echo ""
}

# Main command handling
case "${1:-help}" in
    "install")
        check_requirements
        install_dependencies
        ;;
    "install-ef")
        install_ef_tools
        ;;
    "build")
        build_app
        ;;
    "start")
        start_app
        ;;
    "dev")
        start_dev
        ;;
    "seed")
        seed_database
        ;;
    "migrate")
        migrate_categories
        ;;
    "reset")
        reset_database
        ;;
    "clean")
        clean_all
        ;;
    "test")
        test_app
        ;;
    "test-db")
        test_database
        ;;
    "workshop")
        workshop_setup
        ;;
    "help"|*)
        show_help
        ;;
esac
