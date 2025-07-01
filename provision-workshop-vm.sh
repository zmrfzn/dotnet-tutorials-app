#!/bin/bash

# Workshop VM Provisioning Script
# This script sets up the Tutorials app for workshop attendees
# Run this during VM provisioning to have everything ready

set -e  # Exit on any error

echo "🏗️  Starting Workshop VM Provisioning for Tutorials App..."

# Configuration
WORKSHOP_USER="workshop"
APP_DIR="/home/$WORKSHOP_USER/tutorials-app"
PROJECT_DIR="$APP_DIR/Tutorials"

# 1. System Dependencies
echo "📦 Installing system dependencies..."
apt-get update
apt-get install -y \
    wget \
    curl \
    jq \
    git \
    postgresql \
    postgresql-contrib \
    software-properties-common

# 2. Install .NET 8 SDK
echo "🔧 Installing .NET 8 SDK..."
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
apt-get update
apt-get install -y dotnet-sdk-8.0

# 3. Setup PostgreSQL
echo "🗄️  Setting up PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "ALTER USER postgres CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE tutorials_db OWNER postgres;"

# Configure PostgreSQL for local connections
echo "host    all             all             127.0.0.1/32            md5" >> /etc/postgresql/*/main/pg_hba.conf
echo "local   all             all                                     md5" >> /etc/postgresql/*/main/pg_hba.conf
systemctl restart postgresql

# 4. Create workshop user and setup directory
echo "👤 Setting up workshop user..."
useradd -m -s /bin/bash $WORKSHOP_USER || true
mkdir -p $APP_DIR
chown -R $WORKSHOP_USER:$WORKSHOP_USER $APP_DIR

# 5. Clone/Copy the application code (assuming you have it in a repo or will copy it)
echo "📂 Setting up application code..."
# Option A: If you have a git repo
# sudo -u $WORKSHOP_USER git clone https://github.com/your-org/tutorials-app.git $APP_DIR

# Option B: Copy from local directory (during VM image creation)
cp -r /tmp/tutorials-app/* $APP_DIR/
chown -R $WORKSHOP_USER:$WORKSHOP_USER $APP_DIR

# 6. Build the application
echo "🔨 Building the application..."
cd $PROJECT_DIR
sudo -u $WORKSHOP_USER dotnet restore
sudo -u $WORKSHOP_USER dotnet build

# 7. Setup database schema
echo "🗄️  Setting up database schema..."
cd $PROJECT_DIR
sudo -u $WORKSHOP_USER dotnet ef database update

# 8. Pre-seed the database
echo "🌱 Pre-seeding database..."
cd $PROJECT_DIR
sudo -u $WORKSHOP_USER dotnet run seed

# 9. Create convenient scripts for attendees
echo "📜 Creating convenience scripts..."
cat > $APP_DIR/quick-start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Tutorials App..."
cd ~/tutorials-app
./manage.sh start
EOF

cat > $APP_DIR/reset-data.sh << 'EOF'
#!/bin/bash
echo "🔄 Resetting to fresh data..."
cd ~/tutorials-app
./manage.sh seed
echo "✅ Fresh data loaded!"
EOF

chmod +x $APP_DIR/quick-start.sh
chmod +x $APP_DIR/reset-data.sh
chown $WORKSHOP_USER:$WORKSHOP_USER $APP_DIR/*.sh

# 10. Create desktop shortcuts (if GUI environment)
if [ -d "/home/$WORKSHOP_USER/Desktop" ]; then
    cat > /home/$WORKSHOP_USER/Desktop/Start-Tutorials-App.desktop << EOF
[Desktop Entry]
Type=Application
Name=Start Tutorials App
Exec=/home/$WORKSHOP_USER/tutorials-app/quick-start.sh
Icon=applications-development
Terminal=true
EOF
    chmod +x /home/$WORKSHOP_USER/Desktop/Start-Tutorials-App.desktop
    chown $WORKSHOP_USER:$WORKSHOP_USER /home/$WORKSHOP_USER/Desktop/Start-Tutorials-App.desktop
fi

# 11. Create a welcome README for attendees
cat > $APP_DIR/WORKSHOP-README.md << 'EOF'
# 🎓 Workshop: Tutorials App

Welcome to the workshop! Your development environment is ready to go.

## 🚀 Quick Start

### Option 1: Using Scripts
```bash
cd ~/tutorials-app
./quick-start.sh
```

### Option 2: Using Management Commands
```bash
cd ~/tutorials-app
./manage.sh start
```

## 📍 Access Points
- **Application**: http://localhost:5182
- **API Documentation**: http://localhost:5182/swagger
- **Health Check**: http://localhost:5182/

## 🔄 Reset Data (if needed)
```bash
./reset-data.sh
```

## 📊 Test API
```bash
./manage.sh test
```

## 🛠️ Available Commands
- `./manage.sh start` - Start the app
- `./manage.sh seed` - Reset to fresh data
- `./manage.sh test` - Test endpoints
- `./manage.sh reset` - Complete reset

## 📚 What's Included
- ✅ 16 sample tutorials
- ✅ 11 categories
- ✅ Multiple difficulty levels
- ✅ REST API with full CRUD
- ✅ PostgreSQL database
- ✅ Swagger documentation

Happy coding! 🎉
EOF

chown $WORKSHOP_USER:$WORKSHOP_USER $APP_DIR/WORKSHOP-README.md

# 12. Final verification
echo "🧪 Running final verification..."
cd $PROJECT_DIR
sudo -u $WORKSHOP_USER timeout 30s dotnet run --urls "http://localhost:5183" &
sleep 10

# Test if API is responding
if curl -s "http://localhost:5183/api/tutorials" > /dev/null; then
    echo "✅ API test passed!"
    TUTORIAL_COUNT=$(curl -s "http://localhost:5183/api/tutorials" | jq 'length' 2>/dev/null || echo "0")
    echo "📊 Found $TUTORIAL_COUNT tutorials in database"
else
    echo "❌ API test failed - check configuration"
fi

# Clean up test process
pkill -f "dotnet.*Tutorials" || true

echo "🎉 Workshop VM provisioning completed successfully!"
echo ""
echo "📋 Summary:"
echo "   👤 User: $WORKSHOP_USER"
echo "   📂 App Location: $APP_DIR"
echo "   🗄️  Database: tutorials_db (PostgreSQL)"
echo "   🌱 Pre-seeded: $TUTORIAL_COUNT tutorials"
echo ""
echo "🎓 Attendees can now run: ./quick-start.sh"
EOF
