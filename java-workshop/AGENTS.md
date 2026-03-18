# AGENTS.md — Java Workshop

Context file for AI coding agents working in this directory.

## Project Structure

```
java-workshop/
├── java-tutorials-app/          # Spring Boot app + React SPA
│   ├── src/                     # Java source (Spring Boot 3.4.3)
│   ├── Tutorials/ClientApp/     # React frontend (Vite + PrimeReact)
│   └── manage-java.sh           # build | seed | start | reset
└── workshop-fullstack-o11y-java/ # Instruqt lab track
    ├── 01-java-server/           # Challenge 1: Java APM
    ├── 02-infra-agent/           # Challenge 2: Infrastructure agent
    ├── 03-log-forwarding/        # Challenge 3: Log forwarding
    ├── 04-database-with-infra-agent/ # Challenge 4: Postgres monitoring
    ├── 05-react-app/             # Challenge 5: Browser SPA agent
    ├── 06-synthetic-monitoring/  # Challenge 6: Synthetics
    ├── 07-postgres-with-flex/    # Challenge 7: NRI Flex
    └── track.yml / config.yml
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | OpenJDK 21 |
| Framework | Spring Boot 3.4.3 / Maven 3.6.x |
| Database | PostgreSQL (Spring Data JPA) |
| Frontend | React 18 + Vite 4 + PrimeReact 8 |
| Observability | New Relic Java Agent (APM), newrelic-infra, Browser snippet |
| Lab platform | Instruqt (Ubuntu 22.04 GCP VM) |

## Key Facts

- App runs on port **5182**. All lab URLs use **http** (no SSL).
- API base path: `/api/tutorials`
- Frontend is built by `manage-java.sh build` and served as Spring Boot static resources from `src/main/resources/static/`. There is no standalone dev server in the lab.
- The Instruqt lab VM clones the app to `/root/java-tutorials-app/` at setup time.
- `newrelic.yml` lives at `/root/newrelic/newrelic.yml` on the lab VM (created when the agent zip is unpacked in Challenge 1).
- Instruqt sandbox URLs follow the pattern: `http://$HOSTNAME.$_SANDBOX_ID.instruqt.io:5182`

## Useful Docs

- Java agent install: https://docs.newrelic.com/install/java/
- Java agent intro: https://docs.newrelic.com/docs/apm/agents/java-agent/getting-started/introduction-new-relic-java/
- Instruqt track: https://play.instruqt.com/manage/newrelic/tracks/workshop-fullstack-o11y-java

---

## Claude

**Model**: Claude Sonnet 4.x

### How to work in this repo

- Always read a file before editing it.
- Use `git mv` when moving files so history is preserved.
- Commits on this repo require GPG signing. If GPG times out, use `--no-gpg-sign` (confirmed acceptable by repo owner).
- After editing Instruqt lab content, push the track with `instruqt track push` from inside `workshop-fullstack-o11y-java/`. If remote has diverged, use `--force`.
- Keep lab URLs as `http://` — there is no SSL on the lab VM.

### Known issues / decisions

- `dist/` in `ClientApp` is gitignored and built fresh by `manage-java.sh build` — do not commit it.
- `mapCategories` in `Util.js` guards against non-array input; preserve this.
- `react-error-boundary: ^6.0.0` in `package.json` — version compatibility with React 18 is unconfirmed; flag if touched.

---

## Gemini

**Model**: Gemini Flash 

### How to work in this repo

- Read files before editing. Don't guess at content.
- Prefer `Edit` over full rewrites to minimise diff noise.
- `manage-java.sh` is the single entry point for build/seed/start/reset — don't invoke Maven or npm directly in lab instructions.
- Instruqt challenge scripts (`setup-*`, `cleanup-*`) run as root on the lab VM. Keep commands idempotent.
- All sandbox-facing URLs must use `http://`, not `https://`.

### Known issues / decisions

- Maven 3.6.3 is what `apt install maven` provides on Ubuntu 22.04 — lab content reflects this. Do not change version references to 3.9.x.
- `NODE_ENV` is irrelevant to the Java/Spring Boot challenges — do not add it back.
- `newrelic.yml` is generated on the lab VM, not stored in this repo.
