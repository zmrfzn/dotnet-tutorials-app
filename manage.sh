#!/bin/bash

# Tutorials App Management Script
# Usage: 
#   ./manage.sh seed     - Seed the database
#   ./manage.sh start    - Start the application
#   ./manage.sh restart  - Restart the application
#   ./manage.sh reset    - Reset database and re-seed

PROJECT_DIR="$(dirname "$0")/Tutorials"
APP_URL="http://localhost:5182"

case "$1" in
    "seed")
        echo "🌱 Seeding database..."
        cd "$PROJECT_DIR"
        pkill -f "dotnet.*Tutorials" 2>/dev/null || true
        dotnet run seed
        echo "✅ Database seeded successfully!"
        ;;
    
    "start")
        echo "🚀 Starting Tutorials application..."
        cd "$PROJECT_DIR"
        pkill -f "dotnet.*Tutorials" 2>/dev/null || true
        echo "📍 Application will be available at: $APP_URL"
        echo "📚 Swagger UI: $APP_URL/swagger"
        dotnet run --urls "$APP_URL"
        ;;
    
    "restart")
        echo "🔄 Restarting Tutorials application..."
        cd "$PROJECT_DIR"
        pkill -f "dotnet.*Tutorials" 2>/dev/null || true
        sleep 2
        echo "📍 Application will be available at: $APP_URL"
        echo "📚 Swagger UI: $APP_URL/swagger"
        dotnet run --urls "$APP_URL" &
        ;;
    
    "reset")
        echo "🗑️  Resetting database and re-seeding..."
        cd "$PROJECT_DIR"
        pkill -f "dotnet.*Tutorials" 2>/dev/null || true
        echo "🗄️  Dropping database..."
        dotnet ef database drop --force
        echo "📄 Applying migrations..."
        dotnet ef database update
        echo "🌱 Seeding database..."
        dotnet run seed
        echo "✅ Database reset and seeded successfully!"
        ;;
    
    "test")
        echo "🧪 Testing API endpoints..."
        echo "📊 Total tutorials: $(curl -s "$APP_URL/api/tutorials" | jq 'length' 2>/dev/null || echo 'API not available')"
        echo "📖 Published tutorials: $(curl -s "$APP_URL/api/tutorials/published" | jq 'length' 2>/dev/null || echo 'API not available')"
        echo "📂 Categories: $(curl -s "$APP_URL/api/tutorials/categories" | jq 'length' 2>/dev/null || echo 'API not available')"
        ;;
    
    "workshop")
        echo "🎓 Workshop setup verification..."
        cd "$PROJECT_DIR"
        
        # Check .NET
        echo -n "🔧 .NET SDK: "
        if dotnet --version > /dev/null 2>&1; then
            echo "✅ $(dotnet --version)"
        else
            echo "❌ Not installed"
        fi
        
        # Check PostgreSQL
        echo -n "🗄️  PostgreSQL: "
        if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
            echo "✅ Running"
        else
            echo "❌ Not running"
        fi
        
        # Check database
        echo -n "📊 Database: "
        TUTORIAL_COUNT=$(psql -h localhost -U postgres -d tutorials_db -t -c "SELECT COUNT(*) FROM \"Tutorials\";" 2>/dev/null | xargs || echo "0")
        if [ "$TUTORIAL_COUNT" -gt "0" ]; then
            echo "✅ $TUTORIAL_COUNT tutorials"
        else
            echo "❌ No data or connection failed"
        fi
        
        # Check app can build
        echo -n "🔨 Build: "
        if dotnet build > /dev/null 2>&1; then
            echo "✅ Success"
        else
            echo "❌ Failed"
        fi
        
        echo ""
        echo "🎯 Workshop Status: Ready for attendees!"
        echo "📋 Tell attendees to run: ./quick-start.sh"
        ;;
    
    "fix")
        echo "🔧 Fixing common workshop issues..."
        cd "$PROJECT_DIR"
        pkill -f "dotnet.*Tutorials" 2>/dev/null || true
        echo "🌱 Re-seeding database..."
        dotnet run seed
        echo "✅ Fixed! Ready to start."
        ;;
    
    *)
        echo "Tutorials App Management Script"
        echo ""
        echo "Usage: $0 {seed|start|restart|reset|test}"
        echo ""
        echo "Commands:"
        echo "  seed     - Seed the database with tutorial data"
        echo "  start    - Start the application"
        echo "  restart  - Restart the application"
        echo "  reset    - Reset database and re-seed (clean slate)"
        echo "  test     - Test API endpoints"
        echo ""
        echo "Examples:"
        echo "  $0 seed      # Seed database"
        echo "  $0 start     # Start app"
        echo "  $0 reset     # Complete reset"
        exit 1
        ;;
esac
