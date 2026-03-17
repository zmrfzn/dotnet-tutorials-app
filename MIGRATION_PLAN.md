# Migration Plan: .NET to Java (Spring Boot)

This document outlines the strategy for migrating the Tutorials Full-Stack application and its associated Instruqt lab from .NET 8 to Java (Spring Boot 3).

## 1. Backend Migration (Java/Spring Boot)

### Technology Stack
- **Framework**: Spring Boot 3.x
- **Build Tool**: Maven 3.9+
- **Database**: PostgreSQL (via Spring Data JPA/Hibernate)
- **JSON Handling**: Jackson (with Enum support for Difficulty levels)
- **Validation**: Jakarta Bean Validation

### API Parity Requirements
The following endpoints from `TutorialsController.cs` must be replicated:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/tutorials` | Create a new tutorial |
| GET    | `/api/tutorials` | Get all tutorials (with optional title filter) |
| GET    | `/api/tutorials/published` | Get all published tutorials |
| GET    | `/api/tutorials/categories` | Get all categories |
| GET    | `/api/tutorials/difficulty/{level}` | Filter tutorials by difficulty |
| GET    | `/api/tutorials/{id}` | Get tutorial by UUID |
| PUT    | `/api/tutorials/{id}` | Update tutorial details |
| POST   | `/api/tutorials/{id}/view` | Increment view count |
| POST   | `/api/tutorials/{id}/like` | Increment/Decrement likes |
| DELETE | `/api/tutorials/{id}` | Delete a tutorial |
| DELETE | `/api/tutorials` | Delete all tutorials |

### Database Seeding
- Implement a `DataSeeder` component using `CommandLineRunner`.
- Replicate the JSON-based seeding logic from `.NET` to ensure identical initial datasets for the workshop.

### SPA Integration
- Build the React frontend (`ClientApp`) into `src/main/resources/static`.
- Configure a `WebMvcConfigurer` or `ResourceHandler` to handle client-side routing (forwarding non-API routes to `index.html`).

---

## 2. New Relic Java Agent Integration

### Agent Installation
- Replace `.deb` package installation with the New Relic Java agent (`newrelic-agent.jar`).
- Download command: `curl -O https://download.newrelic.com/newrelic/java-agent/newrelic-agent/current/newrelic-java.zip`

### Configuration
- Use `JAVA_TOOL_OPTIONS` or the `-javaagent` flag to enable instrumentation.
- Map environment variables:
  - `NEW_RELIC_APP_NAME` -> `java-tutorials-server`
  - `NEW_RELIC_LICENSE_KEY` -> (User provided)
  - `NEW_RELIC_DISTRIBUTED_TRACING_ENABLED` -> `true`

---

## 3. Instruqt Lab Updates

### Track Setup (`track_scripts/setup-fullstack-o11y-dotnet`)
- Update to install `openjdk-21-jdk` and `maven`.
- Remove `.NET SDK 8.0` installation steps.

### Challenge 1 (`01-dotnet-server`)
- Rename to `01-java-server`.
- Update `assignment.md` to reflect Java-specific commands (`mvn spring-boot:run`).
- Update `setup-fullstack-o11y-dotnet` to:
  1. Download and unzip the New Relic Java agent.
  2. Build the React frontend.
  3. Pre-build the Java application.

### Management Scripts
- Update `manage.sh` and `manage-integrated.sh` to use Maven commands:
  - `mvn spring-boot:run` instead of `dotnet run`.
  - `mvn clean install` instead of `dotnet build`.

---

## 4. Local Development Dependencies
- **JDK 21**: For modern Spring Boot features.
- **Maven 3.9+**: For dependency management.
- **PostgreSQL**: Local instance for testing.
- **Node.js 22 & NPM 10**: To build the React frontend.

## 5. Implementation Steps
1. **Phase 1: Project Skeleton** - Initialize Spring Boot project with JPA, Web, and PostgreSQL dependencies.
2. **Phase 2: Domain & Data** - Migrate `Tutorial` and `Category` models, create JPA repositories.
3. **Phase 3: Controller & Services** - Implement API logic and data seeding.
4. **Phase 4: Frontend Build Integration** - Update `pom.xml` to automate React build or provide a script to copy `dist/` to `static/`.
5. **Phase 5: Instruqt Lab Migration** - Update lab scripts, documentation, and metadata.
6. **Phase 6: Validation** - Verify APM, Browser, and Infrastructure data reporting in New Relic.
