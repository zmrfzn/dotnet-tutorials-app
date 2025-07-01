# Tutorials App - Database Seeding Guide

## 🎯 **Quick Start**

### Option 1: Simple Re-seed (Recommended)
```bash
cd /Users/zfouzan/Documents/codespace/experiments/pern/Tutorials
./manage.sh seed
./manage.sh start
```

### Option 2: Complete Reset
```bash
cd /Users/zfouzan/Documents/codespace/experiments/pern/Tutorials
./manage.sh reset
./manage.sh start
```

## 📋 **Available Commands**

### Using the Management Script
```bash
./manage.sh seed     # Seed database with tutorial data
./manage.sh start    # Start the application  
./manage.sh restart  # Restart the application
./manage.sh reset    # Complete database reset + re-seed
./manage.sh test     # Test API endpoints
```

### Manual Commands
```bash
# 1. Seed database only
cd Tutorials
dotnet run seed

# 2. Clear via API + restart
curl -X DELETE "http://localhost:5182/api/tutorials"
pkill -f "dotnet.*Tutorials"
dotnet run --urls "http://localhost:5182"

# 3. Complete database reset
cd Tutorials
dotnet ef database drop --force
dotnet ef database update
dotnet run --urls "http://localhost:5182"
```

## 🔄 **Repeatability Scenarios**

### Daily Development
```bash
# Quick re-seed when you need fresh data
./manage.sh seed && ./manage.sh start
```

### Testing Different Data States
```bash
# Start fresh
./manage.sh reset

# Add some custom data via API
curl -X POST "http://localhost:5182/api/tutorials" -H "Content-Type: application/json" -d '{"title":"My Custom Tutorial","description":"Test data"}'

# Reset back to seed data
./manage.sh seed
```

### CI/CD Pipeline
```bash
# In your deployment script
cd Tutorials
dotnet ef database update  # Apply migrations
dotnet run seed            # Seed with test data
dotnet run --urls "http://localhost:5182" &  # Start app
```

## 📊 **Verification Commands**

```bash
# Check data counts
curl -s "http://localhost:5182/api/tutorials" | jq 'length'              # Total: 16
curl -s "http://localhost:5182/api/tutorials/published" | jq 'length'    # Published: 11
curl -s "http://localhost:5182/api/tutorials/categories" | jq 'length'   # Categories: 11

# Check specific data
curl -s "http://localhost:5182/api/tutorials/difficulty/Beginner" | jq 'length'  # Beginner: 5
```

## 🛠 **Troubleshooting**

### Port Already in Use
```bash
# Kill any running instances
pkill -f "dotnet.*Tutorials"
lsof -ti:5182 | xargs kill -9

# Or use a different port
dotnet run --urls "http://localhost:5183"
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Reset database completely
./manage.sh reset
```

### Missing Data
```bash
# Force re-seed
./manage.sh seed

# Or manual force seed
cd Tutorials
dotnet run seed
```

## 📁 **Files Structure**

```
Tutorials/
├── manage.sh                          # Main management script
├── seed-db.sh                        # Simple seed script  
├── Tutorials/
│   ├── Commands/SeedCommand.cs       # Seed command implementation
│   ├── Data/DatabaseSeeder.cs        # Seeder logic
│   ├── Data/TutorialsDbContext.cs    # EF Context
│   ├── Models/Tutorial.cs            # Tutorial entity
│   ├── Controllers/                  # API controllers
│   └── Program.cs                    # App entry point
└── README-SEEDING.md                 # This file
```

## 🎉 **Expected Results**

After seeding, you should have:
- **16 tutorials** with realistic content
- **11 published**, 5 draft tutorials
- **11 categories** (Frontend, Backend, Mobile, etc.)
- **5 Beginner**, 9 Intermediate, 2 Advanced difficulty levels
- **Random view counts** and likes
- **Distributed creation dates** over the last 120 days

## 🔗 **Access Points**

- **API Base**: http://localhost:5182/api
- **Swagger UI**: http://localhost:5182/swagger
- **Health Check**: http://localhost:5182/
- **All Tutorials**: http://localhost:5182/api/tutorials
- **Categories**: http://localhost:5182/api/tutorials/categories
