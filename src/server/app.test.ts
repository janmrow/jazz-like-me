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

describe("GET /api/tags", () => {
  it("returns the discovery tags", async () => {
    const app = buildApp({ db: createTestDb() });
    const response = await app.inject({
      method: "GET",
      url: "/api/tags",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.tags).toContain("calm");
    expect(body.tags).toContain("energetic");
    expect(body.tags).toContain("vocal");
    expect(body.tags).toContain("piano-led");
    expect(body.tags).toContain("live");
  });
});

describe("GET /api/recommendations", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it("returns three recommendations for valid tags", async () => {
    const app = buildApp({ db });
    const response = await app.inject({
      method: "GET",
      url: "/api/recommendations?tags=calm,piano-led",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.recommendations).toHaveLength(3);
    expect(body.recommendations[0].traits).toContain("piano-led");
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

  it("rejects contradictory tags", async () => {
    const app = buildApp({ db });
    const response = await app.inject({
      method: "GET",
      url: "/api/recommendations?tags=calm,energetic",
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toContain("Contradictory tags");
  });

  it("exposes traits but not internal EVC values", async () => {
    const app = buildApp({ db });
    const response = await app.inject({
      method: "GET",
      url: "/api/recommendations?tags=calm",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const album = body.recommendations[0];
    expect(album).toHaveProperty("traits");
    expect(album).not.toHaveProperty("profile");
    expect(album).not.toHaveProperty("energy");
    expect(album).not.toHaveProperty("valence");
    expect(album).not.toHaveProperty("complexity");
  });
});
