import { describe, it, expect } from "vitest";
import { recommend } from "./recommend.js";
import type { Album } from "./types.js";

const albums: Album[] = [
  {
    id: "a1",
    artist: "Miles Davis",
    title: "Kind of Blue",
    year: 1959,
    tags: ["calm", "classic", "modal"],
  },
  {
    id: "a2",
    artist: "John Coltrane",
    title: "A Love Supreme",
    year: 1965,
    tags: ["energetic", "classic", "spiritual"],
  },
  {
    id: "a3",
    artist: "Bill Evans",
    title: "Waltz for Debby",
    year: 1961,
    tags: ["calm", "piano", "late-night"],
  },
  {
    id: "a4",
    artist: "Art Blakey",
    title: "Moanin'",
    year: 1958,
    tags: ["energetic", "hard-bop"],
  },
];

describe("recommend", () => {
  it("returns empty list when no albums match", () => {
    const result = recommend(["vocal"], albums);
    expect(result).toEqual([]);
  });

  it("ranks albums by number of matching tags", () => {
    const result = recommend(["calm", "classic"], albums);
    expect(result.map((a) => a.id)).toEqual(["a1", "a3", "a2"]);
  });

  it("returns at most three recommendations", () => {
    const result = recommend(["classic"], albums, { limit: 3 });
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("breaks ties deterministically by year then title", () => {
    const result = recommend(["energetic"], albums);
    expect(result.map((a) => a.id)).toEqual(["a4", "a2"]);
  });

  it("ignores case and whitespace in tags", () => {
    const result = recommend(["CALM", " Piano "], albums);
    expect(result.map((a) => a.id)).toEqual(["a3", "a1"]);
  });

  it("returns fewer than three matches without filler", () => {
    const result = recommend(["vocal"], albums);
    expect(result.length).toBeLessThan(3);
    expect(result.every((album) => album.tags.includes("vocal"))).toBe(true);
  });
});
