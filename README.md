# Jazz Like Me

> Find three jazz albums that fit your mood.

A tiny, focused web app. Pick one or more tags and get three jazz album
recommendations from a small, deterministic catalogue.

## Quick start

```bash
npm ci
npm run dev
```

Open <http://localhost:5173>.

The dev command starts both the Fastify API (port 3000) and the Vite frontend
(port 5173).

## Verify everything

```bash
npm run verify
```

This runs type checking, linting, unit/API tests, a production build, and a
Playwright end-to-end test.

## Repository layout

```text
src/
  domain/   Recommendation logic (no React, no Fastify, no SQLite)
  db/       SQLite schema, seed data, and queries
  server/   Fastify API
  web/      React + Vite frontend

tests/e2e/  Playwright browser tests
```

## Documentation

- [PRODUCT.md](PRODUCT.md) — product promise, flow, scope, and non-goals
- [ARCHITECTURE.md](ARCHITECTURE.md) — stack, boundaries, and dependency rules
- [ROADMAP.md](ROADMAP.md) — current and future milestones
- [AGENTS.md](AGENTS.md) — working guide for coding agents
