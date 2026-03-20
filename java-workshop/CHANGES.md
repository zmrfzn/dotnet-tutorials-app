# Workshop Improvements — Change Report

Branch: `workshop-improvements`
Date: 2026-03-21

---

## Summary

| Category | Change | Status |
|----------|--------|--------|
| Track config | Overall time limit 9000s → 4800s (80 min) | ✅ Done |
| Track config | Individual challenge time limits updated | ✅ Done |
| Bug fix | Entity name `fullstack-js-o11y` → `fullstack-o11y-java` in Ch.02 | ✅ Done |
| Lab robustness | Check scripts added for Challenges 1, 3, 4, 5 | ✅ Done |
| Lab robustness | Setup script added for Challenge 6 | ✅ Done |
| Java code | NR agent API dependency added to pom.xml | ✅ Done |
| Java code | `/api/tutorials/demo-error` endpoint added | ✅ Done |
| Workshop content | Error tracking section added to Challenge 1 | ✅ Done |
| Workshop content | NRQL intro added to Challenge 1 | ✅ Done |
| Workshop content | NRQL intro added to Challenge 2 | ✅ Done |
| Pending | JVM metrics screenshot — awaiting asset | ⏳ TODO |
| Pending | Flex YAML template — review deferred | ⏳ TODO |

---

## Detailed Changes

### Time Limits

| Challenge | Before | After |
|-----------|--------|-------|
| Track overall | 9000s (150 min) | **4800s (80 min)** |
| Idle timeout | 1800s | 1800s (unchanged) |
| 01-java-server | 600s | **1200s** |
| 02-infra-agent | 600s | **900s** |
| 03-log-forwarding | 600s | **900s** |
| 04-database | 600s | **900s** |
| 05-react-app | 600s | **1200s** |
| 06-synthetics | 600s | **900s** |
| 07-flex | 600s | **900s** |

---

### Bug Fix — Entity Name (Challenge 2)

`02-infra-agent/assignment.md` line 93: `fullstack-js-o11y` → `fullstack-o11y-java`

---

### Check Scripts Added

| File | What it validates |
|------|------------------|
| `01-java-server/check-fullstack-o11y-java` | `NEW_RELIC_LICENSE_KEY` set + Java process running with `-javaagent` |
| `03-log-forwarding/check-fullstack-o11y-java` | `.yml` file exists in `logging.d/` + `newrelic-infra` service active |
| `04-database-with-infra-agent/check-fullstack-o11y-java` | `nri-postgresql` package installed + `newrelic-infra` service active |
| `05-react-app/check-fullstack-o11y-java` | NR browser snippet present in `index.html` |

---

### Challenge 6 Setup Script

`06-synthetic-monitoring/setup-fullstack-o11y-java` — checks if the Java app is running on port 5182; if not, starts it with `nohup mvn spring-boot:run` and waits up to 120s for it to respond. This ensures students have a live target URL when creating their Synthetic monitors.

---

### Error Tracking Endpoint (`/api/tutorials/demo-error`)

**pom.xml**: Added `com.newrelic.agent.java:newrelic-api:8.17.0` with `provided` scope (compile-time only; agent supplies implementation at runtime).

**TutorialsController.java**: New `GET /api/tutorials/demo-error` endpoint:
- Adds custom attributes `error.type` and `error.endpoint` via `NewRelic.addCustomAttribute()`
- Throws `RuntimeException` and calls `NewRelic.noticeError(e)`
- Logs at `ERROR` level (picked up by Logs in Context)
- Returns 500 with JSON body including a hint

---

### Workshop Content Additions

**Challenge 1 — Step 6: NRQL intro**
```sql
SELECT average(duration), count(*) FROM Transaction
WHERE appName = 'java-tutorials-server'
FACET name SINCE 10 minutes ago
```

**Challenge 1 — Step 7: Error tracking + Logs in Context**
- Trigger command for demo-error endpoint (5x loop)
- Explanation of what the endpoint does (noticeError, custom attributes, logs)
- Step-by-step guide to find it in Errors Inbox: stack trace → attributes → linked logs → distributed trace

**Challenge 2 — Step 7: NRQL intro**
```sql
SELECT average(cpuPercent), average(memoryUsedPercent)
FROM SystemSample
WHERE hostname = 'fullstack-o11y-java'
TIMESERIES SINCE 10 minutes ago
```

---

## Pending / TODO

### JVM Metrics Screenshot
Once screenshots are added to `workshop-fullstack-o11y-java/assets/`, update Challenge 1 to include:
- A step pointing students to **APM > java-tutorials-server > JVM** tab
- Screenshot showing heap usage, GC activity, thread counts
- No code change required — the data is already collected by the agent

### Flex YAML Template
`07-postgres-with-flex` — consider adding a starter template with placeholders to reduce friction for self-paced students. Deferred for review.
