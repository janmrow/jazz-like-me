import type { Album, Tag } from "../domain/types.js";
import type Database from "better-sqlite3";

export function createCatalogueSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      artist TEXT NOT NULL,
      title TEXT NOT NULL,
      year INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS album_tags (
      album_id TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
      tag TEXT NOT NULL,
      PRIMARY KEY (album_id, tag)
    );

    CREATE INDEX IF NOT EXISTS idx_album_tags_tag ON album_tags(tag);
  `);
}

export function seedCatalogue(db: Database.Database, albums: Album[]): void {
  const insertAlbum = db.prepare(`
    INSERT INTO albums (id, artist, title, year)
    VALUES (:id, :artist, :title, :year)
    ON CONFLICT(id) DO UPDATE SET
      artist = excluded.artist,
      title = excluded.title,
      year = excluded.year
  `);

  const insertTag = db.prepare(`
    INSERT INTO album_tags (album_id, tag)
    VALUES (:albumId, :tag)
    ON CONFLICT(album_id, tag) DO NOTHING
  `);

  const clearTags = db.prepare(`DELETE FROM album_tags WHERE album_id = :albumId`);

  const seed = db.transaction(() => {
    for (const album of albums) {
      insertAlbum.run(album);
      clearTags.run({ albumId: album.id });
      for (const tag of album.tags) {
        insertTag.run({ albumId: album.id, tag: normalizeTag(tag) });
      }
    }
  });

  seed();
}

export function findAllAlbums(db: Database.Database): Album[] {
  const albums = db
    .prepare(
      `
      SELECT id, artist, title, year
      FROM albums
      ORDER BY year ASC, title ASC
    `
    )
    .all() as Array<Omit<Album, "tags">>;

  const tags = db
    .prepare(
      `
      SELECT album_id, tag
      FROM album_tags
      ORDER BY tag ASC
    `
    )
    .all() as Array<{ album_id: string; tag: Tag }>;

  const tagsByAlbum = new Map<string, Tag[]>();
  for (const { album_id, tag } of tags) {
    const list = tagsByAlbum.get(album_id) ?? [];
    list.push(tag);
    tagsByAlbum.set(album_id, list);
  }

  return albums.map((album) => ({
    ...album,
    tags: tagsByAlbum.get(album.id) ?? [],
  }));
}

function normalizeTag(tag: Tag): Tag {
  return tag.trim().toLowerCase();
}
