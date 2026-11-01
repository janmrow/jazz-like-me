import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import { buildApp } from "./app.js";
import { createCatalogueSchema, seedCatalogue } from "../db/catalogue.js";
import { seedAlbums } from "../db/seed.js";

function createTestDb() {
  const db = new Database(":memory:");
  createCatalogueSchema(db);
  seedCatalogue(db, seedAlbums);
  return db;
}

describe("GET /api/recommendations", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it("returns three recommendations for valid tags", async () => {
    const app = buildApp({ db });
    const response = await app.inject({
      method: "GET",
      url: "/api/recommendations?tags=calm,piano,late-night",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.recommendations).toHaveLength(3);
    expect(body.recommendations[0].title).toBe(
      "At the Pershing: But Not for Me"
    );
  });

  it("rejects requests with no tags", async () => {
    const app = buildApp({ db });
    const response = await app.inject({
      method: "GET",
      url: "/api/recommendations",
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toContain("At least one tag");
  });

  it("rejects requests with invalid tags", async () => {
    const app = buildApp({ db });
    const response = await app.inject({
      method: "GET",
      url: "/api/recommendations?tags=banana",
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toContain("Invalid tags");
  });
});
