# Workshop Improvement Backlog

Assessment date: 2026-03-19

---

## Overall Rating: 7 / 10

Solid foundation, production-ready with targeted improvements.

---

## Code Quality — `java-tutorials-app`

**Rating: 7.5 / 10**

### Strengths
- Clean Spring Boot 3.4 structure — controller/service/repository/dto separation is correct
- DTOs are used properly (not exposing JPA entities directly to the API)
- `manage-java.sh` is an excellent single entry point — build/seed/start/reset, auto-detects NR agent
- `DataSeeder` with 16 tutorials + 11 categories gives students something real to work with
- `mapDifficulty` and `mapCategories` handle nulls + single objects vs arrays

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| `Tutorial.jsx` is 880 lines | Medium | Split into sub-components (form, view, edit mode) |
| `TutorialsController.java` missing error handling on several endpoints | Medium | Unhandled DB errors return 500 with stack trace in response body |
| `react-error-boundary: ^6.0.0` | Medium | Version 6 doesn't exist as stable — pin to `^4.0.3` (React 18 compatible) |
| `axios: ^0.27.2` | Low | Legacy 0.x — upgrade to `1.x` |
| No tests | Low | A single controller integration test would demonstrate NR test instrumentation (bonus teaching opportunity) |

---

## Workshop Content — `workshop-fullstack-o11y-java`

**Rating: 6.5 / 10**

### Strengths
- Coverage breadth: APM → Infra → Logs → DB OHI → Browser SPA → Synthetics → Flex in 7 challenges
- Challenge 1 (Java APM) — 0-to-1 is solid: download, unzip, env vars, `-javaagent`, verify
- Challenge 4 + 7 contrast agent vs. agentless postgres monitoring — good mental model
- Challenge 6 covers both Simple Browser and Scripted Browser synthetics
- App is pre-built before students arrive at Challenge 1 — no cold start

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| No check/verify scripts on most challenges | High | Only Challenge 2 has a `solve` script. Students can advance without completing — removes validation |
| Challenge 3 uses `dummy.log` / `flog` instead of real app logs | High | Spring Boot is already producing structured logs — forward those instead to reinforce the APM → Logs story |
| Challenge 2 references wrong entity name `fullstack-js-o11y` | Medium | VM is `fullstack-o11y-java` — screenshot and text will confuse students |
| Time limits all set to 600s (10 min) | Medium | Challenge 1 alone needs 15-20 min — students will time out before NR UI shows data |
| Challenge 5 setup script doesn't run `npm install` | Medium | Students must run `manage-java.sh build` — needs to be clearly set as first instruction |
| Log forwarding bonus section references "node service" | Low | Copy-paste leftover from Node lab — update to Java context |
| No cleanup/check scripts for Challenges 1, 3, 4, 5, 6, 7 | Low | Resources from prior challenges linger on redeployment |

---

## Java APM Depth — Improvements

Currently only covers 0-to-1 (install + verify). Higher-value topics to add:

| Topic | Effort | Value |
|-------|--------|-------|
| Custom attributes (`NewRelic.addCustomAttribute(...)`) | Low | 1 line of code — immediately queryable in NRQL |
| Custom events (`recordCustomEvent(...)`) | Low | Maps directly to NRQL dashboards |
| Error tracking (`NewRelic.noticeError(...)`) | Low | Add deliberate 500 endpoint, show in Errors Inbox |
| Transaction naming (`NewRelic.setTransactionName()`) | Low | Shows how to control APM grouping |
| JVM metrics tab | None — already collected | Just needs a step pointing students to the JVM tab in APM |
| Distributed tracing (already enabled via env var) | Medium | Add downstream mock HTTP call to show multi-span trace |

**Quickest wins:** custom attributes + custom events (2 lines each, high NRQL payoff) and pointing students to the already-populated JVM metrics tab.

---

## Summary

| Area | Rating | One-line take |
|------|--------|---------------|
| Java backend code | 7.5/10 | Clean structure, minor debt in component size and error handling |
| React frontend code | 6.5/10 | Works but `Tutorial.jsx` needs a split, dependency versions need a tidy |
| Workshop breadth | 8/10 | 7 challenges covering the full stack is comprehensive |
| Workshop depth (Java APM) | 5/10 | Only covers install; custom instrumentation, events, errors are missing |
| Lab robustness | 5/10 | No check scripts, wrong entity names, timeout limits too short |
| Setup/teardown scripts | 6/10 | Challenge 1 setup is solid; others are thin |

---

## Priority Order

1. Increase challenge time limits (quick config change, high impact)
2. Add check scripts to each challenge (prevents students advancing without completing)
3. Forward real Spring Boot logs in Challenge 3 instead of dummy logs
4. Fix entity name in Challenge 2 (`fullstack-js-o11y` → `fullstack-o11y-java`)
5. Add custom attributes + custom events to Challenge 1 APM section
6. Point students to JVM metrics tab (no code change needed)
7. Split `Tutorial.jsx` into sub-components
8. Pin `react-error-boundary` to `^4.0.3`
9. Add deeper APM topics (error tracking, transaction naming, distributed tracing)
