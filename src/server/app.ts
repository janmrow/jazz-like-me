import Fastify from "fastify";
import { recommend } from "../domain/recommend.js";
import { findAllAlbums } from "../db/catalogue.js";
import { availableTags } from "../db/seed.js";
import type Database from "better-sqlite3";

export interface AppOptions {
  db: Database.Database;
}

export function buildApp({ db }: AppOptions) {
  const app = Fastify({ logger: false });

  app.get("/api/health", async () => ({ status: "ok" }));

  app.get("/api/tags", async () => ({ tags: availableTags }));

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

    const invalidTags = selectedTags.filter(
      (tag) => !availableTags.includes(tag.toLowerCase())
    );
    if (invalidTags.length > 0) {
      return reply.status(400).send({
        error: `Invalid tags: ${invalidTags.join(", ")}`,
      });
    }

    const albums = findAllAlbums(db);
    const recommendations = recommend(selectedTags, albums);

    return { recommendations };
  });

  return app;
}
