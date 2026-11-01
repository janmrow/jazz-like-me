import type {
  Album,
  AlbumProfile,
  PreferenceQuery,
  RecommendationOptions,
  Trait,
} from "./types.js";

export function recommend(
  query: PreferenceQuery,
  albums: Album[],
  options: RecommendationOptions = {}
): Album[] {
  const requestedAxes = Object.keys(query.target) as Array<keyof AlbumProfile>;

  if (requestedAxes.length === 0 && query.requestedTraits.length === 0) {
    return [];
  }

  const limit = Math.max(1, Math.min(options.limit ?? 3, albums.length));

  const scored = albums.map((album) => ({
    album,
    traitMatches: countTraitMatches(album, query.requestedTraits),
    evcDistance: evcDistance(album.profile, query.target, requestedAxes),
  }));

  scored.sort(compareScores);

  return scored.slice(0, limit).map((entry) => entry.album);
}

function countTraitMatches(album: Album, requestedTraits: Trait[]): number {
  const albumTraits = new Set(album.traits);
  let matches = 0;
  for (const trait of requestedTraits) {
    if (albumTraits.has(trait)) {
      matches += 1;
    }
  }
  return matches;
}

function evcDistance(
  profile: AlbumProfile,
  target: Partial<AlbumProfile>,
  axes: Array<keyof AlbumProfile>
): number {
  if (axes.length === 0) {
    return 0;
  }

  let total = 0;
  for (const axis of axes) {
    const targetValue = target[axis] ?? 50;
    total += Math.abs(profile[axis] - targetValue) / 100;
  }

  return total / axes.length;
}

interface ScoredAlbum {
  album: Album;
  traitMatches: number;
  evcDistance: number;
}

function compareScores(a: ScoredAlbum, b: ScoredAlbum): number {
  if (b.traitMatches !== a.traitMatches) {
    return b.traitMatches - a.traitMatches;
  }

  if (a.evcDistance !== b.evcDistance) {
    return a.evcDistance - b.evcDistance;
  }

  if (a.album.year !== b.album.year) {
    return a.album.year - b.album.year;
  }

  return a.album.title.localeCompare(b.album.title);
}
