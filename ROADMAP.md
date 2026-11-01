# Roadmap

## Now

### M2 — Recommendation model v1

- [x] Energy / Valence / Complexity album profiles
- [x] Calibrated 30-album catalogue
- [x] PreferenceQuery boundary between user tags and ranking
- [x] Deterministic EVC + trait ranking
- [x] Mutually exclusive opposite axis tags
- [x] Updated domain, API, and browser tests
- [x] Calibration scenario evaluation

## Next

### M3 — Recommendation quality and input

- Gather feedback on real recommendation quality.
- Consider track-level profiles or finer-grained tags only if feedback justifies it.
- Keep the door open for natural-language input without building it yet.

## Later

- Production deployment on Mikrus 2.1 VPS.
- Basic observability (logs, error tracking).
- Catalogue/data pipeline for adding albums without manual SQL edits.
- Optional LLM/Jev experiment for tags or explanations.
