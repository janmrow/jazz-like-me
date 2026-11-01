# Agent working guide

## Where things live

- Product scope and non-goals: `PRODUCT.md`
- Architecture and dependency rules: `ARCHITECTURE.md`
- Current direction: `ROADMAP.md`
- Friendly entry point: `README.md`

## How to verify work

```bash
npm run verify
```

This is the single source of truth for local quality gates.

## Working principles

- Build the smallest complete change.
- Prefer vertical slices over horizontal layers.
- Keep domain logic pure and independent of React, Fastify, and SQLite.
- Prefer simple functions and explicit data structures over abstractions.
- Favour deterministic behaviour and cheap, meaningful tests.
- Do not add dependencies or infrastructure for hypothetical future work.

## Boundaries

```text
src/web/     React + Vite frontend
src/server/  Fastify HTTP API
src/domain/  Pure recommendation logic
src/db/      SQLite schema, seed, and queries
```

When in doubt, leave it out.
