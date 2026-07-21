# LearnTheStack

**An AI-powered study tracker for mastering the modern full-stack — and the curriculum it teaches you to build it with.**

LearnTheStack is two things at once: a **9-month, docs-first curriculum** for full-stack TypeScript + AI engineering (Jun 2026 → Feb 2027), and the **real application that curriculum produces**. You learn each layer of the stack by extending the app itself.

---

## The Problem

Learning a modern full-stack — Next.js, TypeScript, Prisma, an agent layer on top of an LLM, deploy pipelines — is not a reading problem. Tutorials give you intuition and then evaporate; the knowledge you passed a quiz on in June is gone by September because nothing brings it back. Two of the highest-yield learning techniques (retrieval practice and spaced repetition) are exactly the two most study tools ignore. And doing this as a working developer with a life means a plan that assumes uninterrupted daily study is a plan you abandon in week three.

## The Purpose

LearnTheStack is the study tracker that fixes those gaps **and teaches you by making you build it**:

- **Spaced repetition, built in.** Pass a topic's quiz and it resurfaces on an expanding interval (3 → 7 → 21 → 60 → 120 days). A daily "due for review" surface turns otherwise-empty days into short, high-yield recall sessions. Knowledge freshness is modeled on an Ebbinghaus forgetting curve.
- **A schedule that absorbs real life.** Month → Week → Topic calendar with daily/weekly/monthly views, a built-in December buffer month, and a "catch up" reschedule that shifts overdue work forward instead of guilt-tripping you.
- **An AI tutor per topic.** Lesson chat, quizzes, and code review powered by Claude (Haiku 4.5), grounded in your *actual* progress data via tool calls — ask it "what's due for review?" or "how far along am I?" and it answers from the database.
- **A pomodoro timer** in the header that logs focused sessions against topics.

The app is the artifact **and** the teacher: every layer you want to understand, you deepen by extending it.

---

## Tech Stack

Four layers, each with one responsibility and a clean boundary to the one below:

| Layer | Tech |
|---|---|
| **UI** | Next.js 16 App Router (React Server Components, Server Actions) |
| **Agent** | Vercel AI SDK v6 + `@ai-sdk/anthropic` (Claude Haiku 4.5) + Zod tool schemas |
| **API** | Server Actions + route handlers, Zod-validated |
| **Data** | Prisma 7 → PostgreSQL |

**Key patterns:** Zod schemas do double duty (runtime validation *and* LLM tool definitions); Prisma types flow upstream so database shapes are never hand-typed; the curriculum domain is modeled as tested pure functions (`src/lib/curriculum`).

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **Docker** (for local Postgres) — or any Postgres you point `DATABASE_URL` at
- An **Anthropic API key** (for the AI tutor) — https://console.anthropic.com/settings/keys

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    then edit .env and set ANTHROPIC_API_KEY

# 3. Start local Postgres
docker compose up -d db

# 4. Apply migrations, generate the client, and seed the 9-month curriculum
npm run db:setup

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the dashboard populated with 9 months / 32 weeks / 75 topics. Open a lesson and try asking the tutor *"what's due for review today?"*.

### Everyday commands

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type-check
npm run test         # Vitest (unit tests for the curriculum kernels)

npm run db:setup     # migrate deploy + generate + seed (first-time / fresh DB)
npm run db:deploy    # apply existing migrations (non-interactive)
npm run db:migrate   # create a new migration (interactive — for schema changes)
npm run db:seed      # (re)load the curriculum
npm run db:reset     # wipe + re-migrate
npm run db:studio    # Prisma Studio
```

> **Note:** `db:migrate` (`prisma migrate dev`) is *interactive* and is for authoring new migrations. To apply existing migrations to a fresh database non-interactively, use `db:deploy` (or the all-in-one `db:setup`).

### Switching the tutor model

The AI tutor runs on **Claude Haiku 4.5** by default, but you can point it at a local **Ollama** instance for free/private/offline iteration — set `TUTOR_PROVIDER` in `.env`:

```bash
TUTOR_PROVIDER=anthropic   # Claude Haiku 4.5 (default; needs ANTHROPIC_API_KEY)
TUTOR_PROVIDER=ollama      # local Ollama (OLLAMA_BASE_URL, OLLAMA_MODEL)
```

Restart the dev server after changing it. On the Ollama path, pick a tool-capable model (e.g. `qwen2.5`, `llama3.1`) if you want the tutor's tool calls to work — smaller models often answer without calling tools. The cost guardrails and the Haiku pin only apply to the Anthropic path.

---

## Project Philosophy

- **Docs-first.** New features start as a spec (`.md` in `docs/specs/`) before any code — see [`docs/specs/spaced-repetition.md`](docs/specs/spaced-repetition.md) for an example. Zod schemas, Prisma models, and procedure signatures are derived from the spec.
- **Every month ships something.** The app stays runnable at every step; each month produces a shippable artifact.
- **Official docs are the primary reference.** The curriculum plan and its bookmarks live in [`docs/studyplan-extended.md`](docs/studyplan-extended.md).

> This is currently a **single-user prototype** — an app you learn on, not a multi-tenant product (yet).
