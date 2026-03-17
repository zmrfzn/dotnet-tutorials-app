# Java Migration Assessment Report
**Branch:** `workshop-java`
**Date:** 2026-03-18
**Scope:** Code structure, API parity, Instruqt track instructions & flow

---

## 1. Code Structure — Java Backend

**Verdict: Solid for a workshop application.**

The architecture is clean and appropriate for its scope:

- Layered design: Controller → Repository (JPA) with a `CategoryService` for category lookups
- DTOs correctly separate the API contract from JPA entities (`CreateTutorialDto`, `UpdateTutorialDto`, `TutorialResponseDto`)
- Lombok + SLF4J applied consistently across all components
- `WebConfig.java` implements the correct SPA fallback pattern for serving the React frontend from Spring Boot

**Minor structural observations (non-blocking):**
- `mapToResponseDto()` lives inside the controller (`TutorialsController.java:245`). Not incorrect, but conventionally belongs in a separate mapper. Acceptable at workshop scale.
- Tutorial CRUD goes directly controller → repository with no `TutorialService`, while a `CategoryService` does exist. The pattern is slightly inconsistent but not harmful.
- `@CrossOrigin(origins = "*")` on the controller is redundant since the frontend is served from the same origin by Spring Boot. Low risk, just noisy.

---

## 2. API Parity — .NET vs Java

**Verdict: Full parity confirmed across all 12 endpoints.**

| Endpoint | .NET | Java |
|---|---|---|
| `GET /api/tutorials` (+ `?title=`) | ✅ | ✅ |
| `GET /api/tutorials/published` | ✅ | ✅ |
| `GET /api/tutorials/categories` | ✅ | ✅ |
| `GET /api/tutorials/difficulty/{difficulty}` | ✅ | ✅ |
| `GET /api/tutorials/{id}` | ✅ | ✅ |
| `POST /api/tutorials` | ✅ | ✅ |
| `PUT /api/tutorials/{id}` | ✅ | ✅ |
| `DELETE /api/tutorials/{id}` | ✅ | ✅ |
| `DELETE /api/tutorials` | ✅ | ✅ |
| `POST /api/tutorials/{id}/view` | ✅ | ✅ |
| `POST /api/tutorials/{id}/like` | ✅ | ✅ |

Response shapes match. HTTP status codes match (201 for create, 404 for not found, 500 for errors). The React frontend requires zero changes to work with the Java backend.

**Seed data:** 11 categories and 16 tutorials (10 published, 6 draft) — identical to the .NET seeder.

---

## 3. Workshop Track Flow

**Verdict: The 7-challenge observability story is logical and well-structured.**

```
Challenge 1: APM (Java agent)
Challenge 2: Infrastructure Agent (host/OS)
Challenge 3: Log Forwarding
Challenge 4: PostgreSQL DB Monitoring (OHI)
Challenge 5: Browser Real User Monitoring (React SPA)
Challenge 6: Synthetic Monitoring
Challenge 7: Flex (agentless DB instrumentation) — Bonus
```

Each challenge builds on the previous one, covering the full New Relic observability stack in a coherent sequence. Challenge 5 (Browser/React) is particularly well-written with a clear explanation of why manual snippet injection is preferred over auto-injection for SPAs.

---

## 4. Bugs Found & Fixed

### Bug 1 — Hostname mismatch in all challenge tab configs (Critical)
**Files:** All 7 `*/assignment.md` frontmatter blocks
**Problem:** Every challenge tab still referenced `hostname: fullstack-o11y-dotnet`. The `config.yml` was correctly updated to `fullstack-o11y-java`, but the challenge assignments were not. In Instruqt, tab entries that reference a non-existent hostname fail to load — this would break the entire lab.
**Fix:** Replaced all `hostname: fullstack-o11y-dotnet` → `hostname: fullstack-o11y-java` across all 7 challenge assignment files.

---

### Bug 2 — `./manage-java.sh seed` hangs, blocking `start` (Critical)
**File:** `DataSeeder.java`, `manage-java.sh`
**Problem:** `DataSeeder` implements `CommandLineRunner`. When called with the `seed` argument it seeds the DB, but Spring Boot continues running (no exit). So `./manage-java.sh seed && ./manage-java.sh start` hangs on `seed` indefinitely and `start` never executes.
**Fix:** Added `System.exit(0)` immediately after `seedDatabase(true)` in the seed branch of `DataSeeder.run()`. The JVM exits cleanly after seeding, Maven returns exit code 0, and `&&` chains correctly to `start`.

---

### Bug 3 — Wrong tab index for LoadGen Terminal in Challenge 1, Step 4 (Critical)
**File:** `01-java-server/assignment.md:170`
**Problem:** Tab definitions are:
- `tab-0`: Terminal 1
- `tab-1`: LoadGen Terminal
- `tab-2`: Editor
- `tab-3`: Backend Service

Step 4 referenced `[button label="LoadGen Terminal"](tab-2)`, which links to the code **Editor**, not a terminal. Students clicking it would see the editor instead of a terminal.
**Fix:** Changed `(tab-2)` → `(tab-1)` for the LoadGen Terminal reference in Step 4.

---

### Bug 4 — New Relic agent path mismatch in `manage-java.sh start` (High)
**File:** `manage-java.sh:52`
**Problem:** The auto-detect check used a relative path:
```bash
if [ -f "../newrelic/newrelic.jar" ]; then  # resolves to /root/java-tutorials-app/newrelic/newrelic.jar
```
Challenge 1 unzips the agent to:
```bash
unzip newrelic-java.zip -d /root/  # → /root/newrelic/newrelic.jar
```
The paths don't match, so `manage-java.sh start` silently skips auto-instrumentation even after the agent is installed.
**Fix:** Changed to the absolute path `/root/newrelic/newrelic.jar`.

---

### Bug 5 — Challenge 5 build command called from wrong working directory (High)
**File:** `05-react-app/assignment.md`
**Problem:** Step 3 instructed students to run `./manage-java.sh build` in Terminal 2, but Terminal 2 had no `workdir` set (defaulting to `/root/`). The script lives at `/root/java-tutorials-app/manage-java.sh`, so `./manage-java.sh` from `/root/` returns "No such file".
**Fix:** Added `workdir: /root/java-tutorials-app` to the Terminal 2 tab definition in the challenge 5 frontmatter.

---

### Bug 6 — `verify-integration.sh` targeting .NET port and references (Moderate)
**File:** `verify-integration.sh`
**Problem:** The script checked `localhost:5179` (the old .NET port) and all messaging referenced ".NET". The Java app runs on port `5182`. Running this script against a live Java instance would always fail.
**Fix:** Updated `BASE_URL` to `localhost:5182`, changed all `.NET` references to `Java`, updated the startup command hint from `dotnet run` to `./manage-java.sh start`, and removed references to `manage-integrated.sh`.

---

### Bug 7 — Personal GitHub repo URL in Challenge 1 setup script (Moderate)
**File:** `01-java-server/setup-fullstack-o11y-dotnet:6`
**Status: Not fixed — owner URL unknown.**
**Problem:** The setup script clones from `https://github.com/zmrfzn/java-tutorials-app.git` (a personal account). For a production workshop this should point to the official organization repository. If the personal repo is renamed, made private, or deleted, the entire lab breaks at setup.
**Action required:** Move the `java-tutorials-app` repo to the official organization and update this URL before the track goes live.

---

### Bug 8 — Inconsistent tab button label in Challenge 1 (Minor)
**File:** `01-java-server/assignment.md:100`
**Problem:** The button label read `[button label="Terminal 2"](tab-1)`, but the actual tab title is "LoadGen Terminal". The mismatch is confusing — students see a button labeled "Terminal 2" but it opens a tab labeled "LoadGen Terminal".
**Fix:** Updated the button label to `[button label="LoadGen Terminal"](tab-1)` to match the tab title.

---

## 5. Summary

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | Hostname `fullstack-o11y-dotnet` in all 7 challenge tab configs | Critical | ✅ Fixed |
| 2 | `seed && start` hangs — DataSeeder never calls `System.exit()` | Critical | ✅ Fixed |
| 3 | LoadGen Terminal button points to Editor tab (wrong index) | Critical | ✅ Fixed |
| 4 | NR agent path in `manage-java.sh start` doesn't match install location | High | ✅ Fixed |
| 5 | Challenge 5 build command in Terminal 2 with no workdir set | High | ✅ Fixed |
| 6 | `verify-integration.sh` targets port 5179 and references .NET | Moderate | ✅ Fixed |
| 7 | Challenge 1 setup script clones from personal GitHub repo | Moderate | ⚠️ Not fixed — org URL needed |
| 8 | Challenge 1 button label "Terminal 2" doesn't match tab title "LoadGen Terminal" | Minor | ✅ Fixed |

**7 of 8 bugs fixed.** The one outstanding item (Bug 7) requires an organizational decision about where the `java-tutorials-app` repo should live before it can be addressed.
