# Tutorials App — Java / Spring Boot

A full-stack CRUD application for managing tutorials. Backend is Spring Boot 3.4 serving a REST API and a React SPA from the same port.

## Stack

- **Backend**: Java 21, Spring Boot 3.4.3, Maven
- **Frontend**: React 18, Vite 4, PrimeReact 8
- **Database**: PostgreSQL

## Prerequisites

| Tool | Version |
|------|---------|
| Java (JDK) | 21+ |
| Maven | 3.6+ |
| Node.js | 18+ |
| npm | 9+ |
| PostgreSQL | 14+ |

## Database setup

Create the database before first run:

```sql
CREATE DATABASE tutorials_db;
```

Default connection (configured in `src/main/resources/application.properties`):

| Setting | Value |
|---------|-------|
| Host | `localhost:5432` |
| Database | `tutorials_db` |
| Username | `postgres` |
| Password | `root` |

To use different credentials, edit `application.properties` before running.

## Quick start (using manage-java.sh)

The `manage-java.sh` script handles everything in order:

```bash
# 1. Build the React frontend and compile the Java app
./manage-java.sh build

# 2. Seed the database with sample data
./manage-java.sh seed

# 3. Start the application
./manage-java.sh start
```

App is available at **http://localhost:5182**

## Manual setup

If you prefer to run steps individually:

### 1. Build the frontend

```bash
cd Tutorials/ClientApp
cp .env.example .env.local
npm install
npm run build
```

Copy the build output to Spring Boot's static resources:

```bash
mkdir -p ../../src/main/resources/static
cp -r dist/* ../../src/main/resources/static/
cd ../..
```

### 2. Build the Java app

```bash
mvn clean install -DskipTests
```

### 3. Seed the database

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="seed"
```

### 4. Run the app

```bash
mvn spring-boot:run
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tutorials` | List all tutorials |
| GET | `/api/tutorials/{id}` | Get a tutorial |
| POST | `/api/tutorials` | Create a tutorial |
| PUT | `/api/tutorials/{id}` | Update a tutorial |
| DELETE | `/api/tutorials/{id}` | Delete a tutorial |
| GET | `/api/tutorials/published` | List published tutorials |
| GET | `/api/tutorials/categories` | List categories |
| GET | `/api/tutorials/difficulty/{level}` | Filter by difficulty |
| POST | `/api/tutorials/{id}/view` | Increment view count |
| POST | `/api/tutorials/{id}/like` | Increment/decrement likes |

## Other commands

```bash
# Reset the database and re-seed
./manage-java.sh reset
```

## Project structure

```
java-tutorials-app/
├── src/
│   └── main/
│       ├── java/com/newrelic/tutorials/
│       │   ├── controller/     # REST controllers
│       │   ├── model/          # JPA entities
│       │   ├── repository/     # Spring Data repositories
│       │   ├── service/        # Business logic
│       │   ├── dto/            # Request/response DTOs
│       │   └── seeder/         # Database seeder
│       └── resources/
│           ├── application.properties
│           └── static/         # Built React assets (generated)
├── Tutorials/ClientApp/        # React frontend source
├── manage-java.sh
└── pom.xml
```
