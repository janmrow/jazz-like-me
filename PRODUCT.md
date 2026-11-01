# Product

## Promise

> Find up to three jazz albums that fit your mood.

## Core user flow

1. Open the app.
2. Select one or more mood tags.
3. Receive up to three jazz album recommendations.

## Current scope

- A small, deterministic catalogue of real jazz albums.
- Tags that describe mood and instrumentation.
- Simple scoring: more matching tags rank higher.
- A minimal, responsive web UI.
- Fastify API backed by SQLite.

## Non-goals

- No user accounts or authentication.
- No social features, playlists, or sharing.
- No payments or admin panel.
- No external music APIs (Spotify, Discogs, MusicBrainz).
- No LLM dependency for recommendations.
- No cover images or long editorial descriptions in the first slice.

## Catalogue

Ten real jazz albums with a deliberately small data model:

```text
id, artist, title, year, tags
```

The first tag set focuses on discoverability, not completeness.
