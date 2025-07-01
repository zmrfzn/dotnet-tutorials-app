# 🎓 Workshop VM Provisioning Guide

## 📋 **Command Order for VM Provisioning**

### **Phase 1: System Setup (as root)**
```bash
# 1. Update system
apt-get update && apt-get upgrade -y

# 2. Install dependencies
apt-get install -y wget curl jq git postgresql postgresql-contrib

# 3. Install .NET 8 SDK
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb && rm packages-microsoft-prod.deb
apt-get update && apt-get install -y dotnet-sdk-8.0
```

### **Phase 2: Database Setup (as root)**
```bash
# 4. Configure PostgreSQL
systemctl start postgresql && systemctl enable postgresql

# 5. Create database and user
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "ALTER USER postgres CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE tutorials_db OWNER postgres;"

# 6. Configure authentication
echo "host all all 127.0.0.1/32 md5" >> /etc/postgresql/*/main/pg_hba.conf
systemctl restart postgresql
```

### **Phase 3: Application Setup (as workshop user)**
```bash
# 7. Setup application directory
mkdir -p ~/tutorials-app
cd ~/tutorials-app

# 8. Copy/clone application code
# (Copy your Tutorials app files here)

# 9. Build application
cd Tutorials
dotnet restore && dotnet build

# 10. Setup database schema
dotnet ef database update

# 11. Pre-seed with data
dotnet run seed
```

### **Phase 4: Workshop Preparation**
```bash
# 12. Create convenience scripts
cd ~/tutorials-app
./manage.sh test  # Verify everything works

# 13. Create quick-start script for attendees
echo '#!/bin/bash
cd ~/tutorials-app && ./manage.sh start' > quick-start.sh
chmod +x quick-start.sh
```

## 🏗️ **Automated Provisioning Script**

Run the complete provisioning script:
```bash
sudo ./provision-workshop-vm.sh
```

## 🎯 **End State for Attendees**

After provisioning, attendees will have:

### **Ready to Start**
```bash
# Single command to start the app
cd ~/tutorials-app
./quick-start.sh
```

### **Pre-loaded Data**
- ✅ 16 tutorials already seeded
- ✅ Database schema applied
- ✅ All dependencies installed
- ✅ App built and ready

### **Available Commands**
```bash
./manage.sh start    # Start the app
./manage.sh seed     # Reset to fresh data  
./manage.sh test     # Test endpoints
./reset-data.sh      # Quick data reset
```

## 📊 **Verification Checklist**

Before workshop starts, verify:
```bash
# 1. .NET is installed
dotnet --version  # Should show 8.x

# 2. PostgreSQL is running
pg_isready -h localhost -p 5432

# 3. Database exists
psql -h localhost -U postgres -d tutorials_db -c "\dt"

# 4. App can start
cd ~/tutorials-app && timeout 10s ./manage.sh start

# 5. API responds
curl -s "http://localhost:5182/api/tutorials" | jq 'length'  # Should return 16
```

## 🎓 **Workshop Flow**

### **For Attendees (Day of Workshop)**
1. **Start the app**: `./quick-start.sh`
2. **Verify it works**: Visit http://localhost:5182/swagger
3. **Begin workshop activities**

### **If Data Gets Corrupted**
```bash
./reset-data.sh  # Quick reset
# or
./manage.sh seed # Full reset
```

## 🐳 **Docker Alternative (Optional)**

For containerized workshops:
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0
RUN apt-get update && apt-get install -y postgresql-client
COPY . /app
WORKDIR /app/Tutorials
RUN dotnet restore && dotnet build
EXPOSE 5182
CMD ["dotnet", "run", "--urls", "http://0.0.0.0:5182"]
```

## 🔧 **Troubleshooting for Instructors**

### **Common Issues**
```bash
# Port conflicts
pkill -f "dotnet.*Tutorials"
lsof -ti:5182 | xargs kill -9

# Database issues  
./manage.sh reset

# Permission issues
chown -R workshop:workshop ~/tutorials-app
```
