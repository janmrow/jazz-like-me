import type { Album, Trait } from "../domain/types.js";
import type Database from "better-sqlite3";

export function createCatalogueSchema(db: Database.Database): void {
  resetSchemaIfOutdated(db);

  db.exec(`
    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      artist TEXT NOT NULL,
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      musicbrainz_release_group_id TEXT,
      energy INTEGER NOT NULL,
      valence INTEGER NOT NULL,
      complexity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS album_traits (
      album_id TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
      trait TEXT NOT NULL,
      PRIMARY KEY (album_id, trait)
    );

    CREATE INDEX IF NOT EXISTS idx_album_traits_trait ON album_traits(trait);
  `);
}

function resetSchemaIfOutdated(db: Database.Database): void {
  const columns = db
    .prepare("PRAGMA table_info(albums)")
    .all() as Array<{ name: string }>;

  const hasEnergyColumn = columns.some((column) => column.name === "energy");
  if (columns.length > 0 && !hasEnergyColumn) {
    db.exec(`
      DROP TABLE IF EXISTS album_tags;
      DROP TABLE IF EXISTS album_traits;
      DROP TABLE IF EXISTS albums;
    `);
  }
}

export function seedCatalogue(db: Database.Database, albums: Album[]): void {
  const insertAlbum = db.prepare(`
    INSERT INTO albums (
      id, artist, title, year, musicbrainz_release_group_id,
      energy, valence, complexity
    )
    VALUES (
      :id, :artist, :title, :year, :musicbrainzReleaseGroupId,
      :energy, :valence, :complexity
    )
    ON CONFLICT(id) DO UPDATE SET
      artist = excluded.artist,
      title = excluded.title,
      year = excluded.year,
      musicbrainz_release_group_id = excluded.musicbrainz_release_group_id,
      energy = excluded.energy,
      valence = excluded.valence,
      complexity = excluded.complexity
  `);

  const insertTrait = db.prepare(`
    INSERT INTO album_traits (album_id, trait)
    VALUES (:albumId, :trait)
    ON CONFLICT(album_id, trait) DO NOTHING
  `);

  const clearTraits = db.prepare(`DELETE FROM album_traits WHERE album_id = :albumId`);

  const seed = db.transaction(() => {
    for (const album of albums) {
      insertAlbum.run({
        id: album.id,
        artist: album.artist,
        title: album.title,
        year: album.year,
        musicbrainzReleaseGroupId: album.musicbrainzReleaseGroupId ?? null,
        energy: album.profile.energy,
        valence: album.profile.valence,
        complexity: album.profile.complexity,
      });
      clearTraits.run({ albumId: album.id });
      for (const trait of album.traits) {
        insertTrait.run({ albumId: album.id, trait });
      }
    }
  });

  seed();
}

export function findAllAlbums(db: Database.Database): Album[] {
  const albums = db
    .prepare(
      `
      SELECT id, artist, title, year, musicbrainz_release_group_id,
             energy, valence, complexity
      FROM albums
      ORDER BY year ASC, title ASC
    `
    )
    .all() as Array<{
    id: string;
    artist: string;
    title: string;
    year: number;
    musicbrainz_release_group_id: string | null;
    energy: number;
    valence: number;
    complexity: number;
  }>;

  const traits = db
    .prepare(
      `
      SELECT album_id, trait
      FROM album_traits
      ORDER BY trait ASC
    `
    )
    .all() as Array<{ album_id: string; trait: Trait }>;

  const traitsByAlbum = new Map<string, Trait[]>();
  for (const { album_id, trait } of traits) {
    const list = traitsByAlbum.get(album_id) ?? [];
    list.push(trait);
    traitsByAlbum.set(album_id, list);
  }

  return albums.map((album) => ({
    id: album.id,
    artist: album.artist,
    title: album.title,
    year: album.year,
    musicbrainzReleaseGroupId: album.musicbrainz_release_group_id ?? undefined,
    profile: {
      energy: album.energy as Album["profile"]["energy"],
      valence: album.valence as Album["profile"]["valence"],
      complexity: album.complexity as Album["profile"]["complexity"],
    },
    traits: traitsByAlbum.get(album.id) ?? [],
  }));
}
