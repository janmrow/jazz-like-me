# Architecture

## Stack

- Node 26
- TypeScript
- React + Vite
- Fastify
- SQLite via `better-sqlite3`
- Vitest
- Playwright
- npm

## Boundaries

```text
web (React + Vite)
  ↓ HTTP
server (Fastify)
  ↓ function call
domain (pure recommendation logic)
  ↓ function call
db (SQLite)
```

## Dependency direction

- `domain/` has no dependencies on React, Fastify, or SQLite.
- `server/` depends on `domain/` and `db/`.
- `web/` depends only on the public HTTP API.
- `db/` owns the schema, seed data, and queries using direct SQL.

## Key decisions

- **Pure domain logic**: `recommend(selectedTags, albums)` is a simple,
  deterministic, testable function.
- **No ORM**: Direct SQL keeps data access explicit and the dependency surface
  small.
- **No monorepo**: A single `package.json` is enough for this product.
- **Seed-based catalogue**: The SQLite database is created and seeded on startup
  from a small, versioned dataset.

## Target production environment

Mikrus 2.1 VPS. Deployment, reverse proxy, and HTTPS configuration are
intentionally out of scope for the first slice.
