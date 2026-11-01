import { describe, it, expect } from "vitest";
import Database from "better-sqlite3";
import { createCatalogueSchema, findAllAlbums, seedCatalogue } from "./catalogue.js";
import { seedAlbums } from "./seed.js";

function createOldMainSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE albums (
      id TEXT PRIMARY KEY,
      artist TEXT NOT NULL,
      title TEXT NOT NULL,
      year INTEGER NOT NULL
    );

    CREATE TABLE album_tags (
      album_id TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
      tag TEXT NOT NULL,
      PRIMARY KEY (album_id, tag)
    );
  `);

  db.prepare(
    `INSERT INTO albums (id, artist, title, year) VALUES (?, ?, ?, ?)`
  ).run("kind-of-blue", "Miles Davis", "Kind of Blue", 1959);
  db.prepare(
    `INSERT INTO album_tags (album_id, tag) VALUES (?, ?)`
  ).run("kind-of-blue", "calm");
}

describe("createCatalogueSchema", () => {
  it("upgrades an existing main database by recreating the schema", () => {
    const db = new Database(":memory:");
    createOldMainSchema(db);

    createCatalogueSchema(db);
    seedCatalogue(db, seedAlbums);

    const albums = findAllAlbums(db);
    expect(albums.length).toBe(seedAlbums.length);
    expect(albums[0]).toHaveProperty("profile");
    expect(albums[0]).toHaveProperty("traits");
  });
});
