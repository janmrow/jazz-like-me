import type { Album, Tag } from "./types.js";

export interface RecommendationOptions {
  limit?: number;
}

export function recommend(
  selectedTags: Tag[],
  albums: Album[],
  options: RecommendationOptions = {}
): Album[] {
  const limit = Math.max(1, Math.min(options.limit ?? 3, albums.length));
  const normalizedSelected = selectedTags.map(normalizeTag);

  const scored = albums.map((album) => ({
    album,
    score: scoreAlbum(album, normalizedSelected),
  }));

  scored.sort(compareScores);

  return scored
    .filter((entry) => entry.score > 0)
    .slice(0, limit)
    .map((entry) => entry.album);
}

function scoreAlbum(album: Album, selectedTags: Tag[]): number {
  const albumTags = new Set(album.tags.map(normalizeTag));
  let score = 0;
  for (const tag of selectedTags) {
    if (albumTags.has(tag)) {
      score += 1;
    }
  }
  return score;
}

function compareScores(
  a: { album: Album; score: number },
  b: { album: Album; score: number }
): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  if (a.album.year !== b.album.year) {
    return a.album.year - b.album.year;
  }
  return a.album.title.localeCompare(b.album.title);
}

function normalizeTag(tag: Tag): Tag {
  return tag.trim().toLowerCase();
}
