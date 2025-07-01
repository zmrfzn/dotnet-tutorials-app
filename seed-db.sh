#!/bin/bash

# Tutorials Database Seeder Script
# Usage: ./seed-db.sh

echo "🌱 Starting database seeding process..."

# Change to the project directory
cd "$(dirname "$0")/Tutorials"

# Stop any running application
echo "🛑 Stopping any running applications..."
pkill -f "dotnet.*Tutorials" 2>/dev/null || true

# Run the seed command
echo "🌱 Seeding database..."
dotnet run seed

echo "✅ Database seeding completed!"
echo "🚀 You can now start the application with: dotnet run --urls \"http://localhost:5182\""
