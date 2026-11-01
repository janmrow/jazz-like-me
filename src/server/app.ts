import Fastify from "fastify";
import { recommend } from "../domain/recommend.js";
import {
  buildPreferenceQuery,
  discoveryTags,
  findContradictoryTags,
  isValidDiscoveryTag,
} from "../domain/preferences.js";
import { findAllAlbums } from "../db/catalogue.js";
import type Database from "better-sqlite3";
import type { Album } from "../domain/types.js";

export interface AppOptions {
  db: Database.Database;
}

export function buildApp({ db }: AppOptions) {
  const app = Fastify({ logger: false });

  app.get("/api/health", async () => ({ status: "ok" }));

  app.get("/api/tags", async () => ({ tags: discoveryTags }));

  app.get("/api/recommendations", async (request, reply) => {
    const query = request.query as { tags?: string };
    const rawTags = query.tags ?? "";

    const selectedTags = rawTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (selectedTags.length === 0) {
      return reply.status(400).send({
        error: "At least one tag is required.",
      });
    }

    const invalidTags = selectedTags.filter((tag) => !isValidDiscoveryTag(tag));
    if (invalidTags.length > 0) {
      return reply.status(400).send({
        error: `Invalid tags: ${invalidTags.join(", ")}`,
      });
    }

    const contradictoryTags = findContradictoryTags(selectedTags);
    if (contradictoryTags.length > 0) {
      return reply.status(400).send({
        error: `Contradictory tags: ${contradictoryTags.join(", ")}`,
      });
    }

    const preferenceQuery = buildPreferenceQuery(selectedTags);
    const albums = findAllAlbums(db);
    const recommendations = recommend(preferenceQuery, albums);

    return { recommendations: recommendations.map(toApiAlbum) };
  });

  return app;
}

function toApiAlbum(album: Album): {
  id: string;
  artist: string;
  title: string;
  year: number;
  traits: string[];
} {
  return {
    id: album.id,
    artist: album.artist,
    title: album.title,
    year: album.year,
    traits: album.traits,
  };
}
