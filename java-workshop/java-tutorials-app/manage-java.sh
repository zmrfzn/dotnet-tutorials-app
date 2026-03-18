#!/bin/bash

# Java Tutorials App Management Script
# Usage: 
#   ./manage-java.sh seed     - Seed the database
#   ./manage-java.sh build    - Build frontend and backend
#   ./manage-java.sh start    - Start the application
#   ./manage-java.sh reset    - Reset database and re-seed

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JAVA_PROJECT_DIR="$SCRIPT_DIR"
CLIENT_DIR="$SCRIPT_DIR/Tutorials/ClientApp"
APP_PORT=5182

case "$1" in
    "seed")
        echo "🌱 Seeding database..."
        cd "$JAVA_PROJECT_DIR"
        mvn spring-boot:run -Dspring-boot.run.arguments="seed"
        echo "✅ Database seeded successfully!"
        ;;
    
    "build")
        echo "🏗️ Building React frontend..."
        cd "$CLIENT_DIR"
        npm install && npm run build
        
        echo "📂 Copying frontend build to Spring Boot static resources..."
        mkdir -p "$JAVA_PROJECT_DIR/src/main/resources/static"
        cp -r dist/* "$JAVA_PROJECT_DIR/src/main/resources/static/"
        
        echo "🔨 Building Java application..."
        cd "$JAVA_PROJECT_DIR"
        mvn clean install -DskipTests
        echo "✅ Build completed!"
        ;;

    "start")
        echo "🚀 Starting Java Tutorials application..."
        cd "$JAVA_PROJECT_DIR"
        
        # Kill any existing java process on the same port
        PID=$(lsof -t -i:$APP_PORT)
        if [ -n "$PID" ]; then
            echo "Stopping existing process on port $APP_PORT (PID: $PID)..."
            kill -9 $PID
        fi
        
        echo "📍 Application will be available at: http://localhost:$APP_PORT"
        
        # Check if New Relic agent exists
        if [ -f "/root/newrelic/newrelic.jar" ]; then
            echo "🔍 New Relic agent found, starting with instrumentation..."
            export JAVA_TOOL_OPTIONS="-javaagent:/root/newrelic/newrelic.jar"
        fi
        
        mvn spring-boot:run
        ;;
    
    "reset")
        echo "🗑️ Resetting database and re-seeding..."
        # In Spring Boot with ddl-auto=update, we don't drop the schema usually, 
        # but we can force it by dropping the database if needed.
        PGPASSWORD=root psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS tutorials_db;"
        PGPASSWORD=root psql -h localhost -U postgres -c "CREATE DATABASE tutorials_db;"
        
        echo "🌱 Seeding database..."
        cd "$JAVA_PROJECT_DIR"
        mvn spring-boot:run -Dspring-boot.run.arguments="seed"
        echo "✅ Database reset and seeded successfully!"
        ;;
    
    *)
        echo "Java Tutorials App Management Script"
        echo ""
        echo "Usage: $0 {build|seed|start|reset}"
        echo ""
        exit 1
        ;;
esac
