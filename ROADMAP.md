# Roadmap

## Now

### M1 — First recommendation slice

- [x] Deterministic recommendation domain
- [x] SQLite-backed catalogue of ten real jazz albums
- [x] Fastify API with input validation
- [x] Minimal, accessible React UI
- [x] Domain, API, and browser tests
- [x] CI verification workflow

## Next

### M2 — Recommendation quality and catalogue

- Improve scoring when multiple albums tie.
- Expand catalogue beyond ten albums while keeping the data model small.
- Consider tag synonyms or a broader, still human-friendly tag set.

## Later

- Production deployment on Mikrus 2.1 VPS.
- Basic observability (logs, error tracking).
- Catalogue/data pipeline for adding albums without manual SQL edits.
- Lightweight recommendation evaluation.
- Optional LLM/Jev experiment for tags or explanations.
