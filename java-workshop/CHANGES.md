# Workshop Improvements — Change Report

Branch: `workshop-improvements`
Date: 2026-03-21

---

## Commit History

| # | Commit | Message |
|---|--------|---------|
| 1 | `bcd6709` | feat: workshop improvements — robustness, NRQL, error tracking |
| 2 | `8e65c23` | chore: update track.yml title, version, tags and timelimit |
| 3 | `863ede6` | feat: raw commands in assignments + file-based load-generator |
| 4 | `7dbb818` | feat: move build and seed to Ch.1 setup script |

---

## Change 1 — `bcd6709`

### Track time limits

| Challenge | Before | After |
|-----------|--------|-------|
| Track overall | 9000s (150 min) | **6000s (100 min)** _(further adjusted in commit 2)_ |
| Idle timeout | 1800s | 1800s (unchanged) |
| 01-java-server | 600s | **1200s** |
| 02-infra-agent | 600s | **900s** |
| 03-log-forwarding | 600s | **900s** |
| 04-database | 600s | **900s** |
| 05-react-app | 600s | **1200s** |
| 06-synthetics | 600s | **900s** |
| 07-flex | 600s | **900s** |

### Bug fix — entity name (Challenge 2)

`02-infra-agent/assignment.md`: `fullstack-js-o11y` → `fullstack-o11y-java`

### Check scripts added

| File | Validates |
|------|-----------|
| `01-java-server/check-fullstack-o11y-java` | `NEW_RELIC_LICENSE_KEY` set + Java running with `-javaagent` |
| `03-log-forwarding/check-fullstack-o11y-java` | `.yml` exists in `logging.d/` + `newrelic-infra` active |
| `04-database-with-infra-agent/check-fullstack-o11y-java` | `nri-postgresql` installed + `newrelic-infra` active |
| `05-react-app/check-fullstack-o11y-java` | NR browser snippet present in `index.html` |

### Challenge 6 setup script added

`06-synthetic-monitoring/setup-fullstack-o11y-java` — checks if app is running on port 5182; if not, starts it with `nohup mvn spring-boot:run` and polls up to 120s. Ensures students have a live target URL for Synthetic monitors.

### Error tracking endpoint

**`pom.xml`**: Added `com.newrelic.agent.java:newrelic-api:8.17.0` with `provided` scope.

**`TutorialsController.java`**: New `GET /api/tutorials/demo-error`:
- Calls `NewRelic.addCustomAttribute("error.type", ...)` and `NewRelic.addCustomAttribute("error.endpoint", ...)`
- Throws `RuntimeException` and calls `NewRelic.noticeError(e)`
- Logs at `ERROR` level (Logs in Context)
- Returns HTTP 500 with JSON hint body

### Workshop content — Challenge 1

**Step 6 — NRQL intro:**
```sql
SELECT average(duration), count(*) FROM Transaction
WHERE appName = 'java-tutorials-server'
FACET name SINCE 10 minutes ago
```

**Step 7 — Error tracking, Logs in Context, custom attributes:**
- Load-generator triggers demo-error traffic
- Guide: Errors Inbox → stack trace → Attributes tab → Logs tab → Distributed trace

### Workshop content — Challenge 2

**Step 7 — NRQL intro:**
```sql
SELECT average(cpuPercent), average(memoryUsedPercent)
FROM SystemSample
WHERE hostname = 'fullstack-o11y-java'
TIMESERIES SINCE 10 minutes ago
```

---

## Change 2 — `8e65c23`

### track.yml updates (user-edited)

- Title: "Java" → "Java stack"
- Version footer: Aug 2025 → Mar 2026
- Tag `javascript` → added `java` tag alongside it
- Overall timelimit: 4800s → **6000s (100 min)**

---

## Change 3 — `863ede6`

### New file — `java-tutorials-app/load-generator.json`

```json
{
  "pause": 500,
  "workers": 4,
  "timeout": 5000,
  "urls": [
    "http://localhost:5182/api/{endpoints}",
    "http://localhost:5182/api/{endpoints}/published",
    "http://localhost:5182/api/{endpoints}/categories",
    "http://localhost:5182/api/{endpoints}/difficulty/{difficulty_levels}",
    "http://localhost:5182/api/{endpoints}/demo-error"
  ],
  "values": {
    "endpoints": ["tutorials"],
    "difficulty_levels": ["beginner", "intermediate", "advanced"]
  }
}
```

Uses `localhost:5182` (load-gen runs on the VM). Includes `/demo-error` so error traffic is generated automatically alongside normal traffic.

### Challenge 1 — load-generator

- LoadGen Terminal `workdir`: `/root/` → `/root/java-tutorials-app`
- Load-gen command: long inline URLs → `npx load-generator` (reads JSON file)
- Step 7 curl loop → `npx load-generator` (same file, demo-error already included)
- Node/npm section description updated: now explains Node is needed for `npx load-generator` and Ch.5 React build — not the primary language

### Challenge 3 — copy-paste leftovers fixed

- Tab title `"Node"` → `"Terminal"`
- Bonus section: `"node service"` → `"Java application"`

### Challenge 5 — raw build commands

Replaced `./manage-java.sh build` with explicit steps:
```bash
cd /root/java-tutorials-app/Tutorials/ClientApp && npm install && npm run build
cp -r /root/java-tutorials-app/Tutorials/ClientApp/dist/* /root/java-tutorials-app/src/main/resources/static/
cd /root/java-tutorials-app && mvn clean install -DskipTests
```

### Challenge 6 — raw start command

`./manage-java.sh start` → `mvn spring-boot:run`

---

## Change 4 — `7dbb818`

### Challenge 1 setup script — build + seed at load time

`01-java-server/setup-fullstack-o11y-java`: Added database seeding after the build step:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="seed"
```

### Challenge 1 assignment — seed step removed

The "Start & Verify" section no longer asks students to seed manually. Students go straight to:
```bash
mvn spring-boot:run
```
Data is already present when the challenge loads.

---

## Pending / TODO

| Item | Notes |
|------|-------|
| **JVM metrics step** | Add a step in Ch.1 pointing to **APM > JVM** tab (heap, GC, threads). Awaiting screenshot asset from user to add to `assets/`. No code change needed — data already collected. |
| **Flex YAML template** | `07-postgres-with-flex` — add starter YAML with placeholders to reduce friction for self-paced students. Deferred for review. |
