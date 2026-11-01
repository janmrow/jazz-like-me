import type { Album, Score, Trait } from "../domain/types.js";
import catalogue from "./catalogue.json" with { type: "json" };

export const seedAlbums: Album[] = catalogue.map((entry) => ({
  id: entry.id,
  artist: entry.artist,
  title: entry.title,
  year: entry.year,
  musicbrainzReleaseGroupId: entry.musicbrainzReleaseGroupId,
  profile: {
    energy: entry.profile.energy as Score,
    valence: entry.profile.valence as Score,
    complexity: entry.profile.complexity as Score,
  },
  traits: entry.traits as Trait[],
}));
