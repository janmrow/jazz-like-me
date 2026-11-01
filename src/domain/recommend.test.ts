import { describe, it, expect } from "vitest";
import { recommend } from "./recommend.js";
import type { Album, Trait } from "./types.js";

const albums: Album[] = [
  {
    id: "a1",
    artist: "Miles Davis",
    title: "Kind of Blue",
    year: 1959,
    profile: { energy: 25, valence: 50, complexity: 25 },
    traits: [],
  },
  {
    id: "a2",
    artist: "John Coltrane",
    title: "A Love Supreme",
    year: 1965,
    profile: { energy: 75, valence: 75, complexity: 50 },
    traits: [],
  },
  {
    id: "a3",
    artist: "Bill Evans",
    title: "Waltz for Debby",
    year: 1961,
    profile: { energy: 25, valence: 25, complexity: 50 },
    traits: ["piano-led"],
  },
  {
    id: "a4",
    artist: "Art Blakey",
    title: "Moanin'",
    year: 1958,
    profile: { energy: 75, valence: 75, complexity: 25 },
    traits: ["live"],
  },
  {
    id: "a5",
    artist: "Ella Fitzgerald",
    title: "Ella and Louis",
    year: 1956,
    profile: { energy: 50, valence: 75, complexity: 25 },
    traits: ["vocal"],
  },
];

describe("recommend", () => {
  it("returns empty list for an empty preference query", () => {
    const result = recommend({ target: {}, requestedTraits: [] }, albums);
    expect(result).toEqual([]);
  });

  it("ranks albums by EVC distance on requested axes only", () => {
    const result = recommend(
      { target: { energy: 25 }, requestedTraits: [] },
      albums
    );
    expect(result.map((a) => a.id)).toEqual(["a1", "a3", "a5"]);
  });

  it("prefers closer EVC match when trait match count is equal", () => {
    const result = recommend(
      { target: { energy: 75, valence: 75 }, requestedTraits: [] },
      albums
    );
    expect(result.map((a) => a.id)).toEqual(["a4", "a2", "a5"]);
  });

  it("gives priority to albums matching more requested traits", () => {
    const result = recommend(
      { target: { energy: 25 }, requestedTraits: ["piano-led"] },
      albums
    );
    expect(result[0].id).toBe("a3");
  });

  it("falls back to best EVC match when fewer than three albums match all traits", () => {
    const requestedTraits: Trait[] = ["piano-led", "live"];
    const result = recommend(
      { target: {}, requestedTraits },
      albums
    );
    expect(result).toHaveLength(3);
    expect(countMatchingTraits(result[0], requestedTraits)).toBe(1);
    expect(countMatchingTraits(result[1], requestedTraits)).toBe(1);
    expect(countMatchingTraits(result[2], requestedTraits)).toBe(0);
  });

  it("breaks ties deterministically by year then title", () => {
    const result = recommend(
      { target: { valence: 75 }, requestedTraits: [] },
      albums
    );
    expect(result.map((a) => a.id)).toEqual(["a5", "a4", "a2"]);
  });

  it("returns at most three recommendations by default", () => {
    const result = recommend(
      { target: { energy: 75 }, requestedTraits: [] },
      albums
    );
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("does not penalize albums for unspecified EVC axes", () => {
    const result = recommend(
      { target: { complexity: 25 }, requestedTraits: [] },
      albums
    );
    expect(result.map((a) => a.id)).toEqual(["a5", "a4", "a1"]);
  });
});

function countMatchingTraits(album: Album, requestedTraits: Trait[]): number {
  const albumTraits = new Set(album.traits);
  return requestedTraits.filter((trait) => albumTraits.has(trait)).length;
}

