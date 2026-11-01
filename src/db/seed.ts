import type { Album } from "../domain/types.js";

export const seedAlbums: Album[] = [
  {
    id: "kind-of-blue",
    artist: "Miles Davis",
    title: "Kind of Blue",
    year: 1959,
    tags: ["calm", "classic"],
  },
  {
    id: "a-love-supreme",
    artist: "John Coltrane",
    title: "A Love Supreme",
    year: 1965,
    tags: ["energetic", "classic", "spiritual"],
  },
  {
    id: "waltz-for-debby",
    artist: "Bill Evans",
    title: "Waltz for Debby",
    year: 1961,
    tags: ["calm", "piano", "late-night"],
  },
  {
    id: "moanin",
    artist: "Art Blakey & The Jazz Messengers",
    title: "Moanin'",
    year: 1958,
    tags: ["energetic", "classic"],
  },
  {
    id: "ella-and-louis",
    artist: "Ella Fitzgerald & Louis Armstrong",
    title: "Ella and Louis",
    year: 1956,
    tags: ["vocal", "classic"],
  },
  {
    id: "brilliant-corners",
    artist: "Thelonious Monk",
    title: "Brilliant Corners",
    year: 1957,
    tags: ["piano", "classic"],
  },
  {
    id: "chet",
    artist: "Chet Baker",
    title: "Chet",
    year: 1959,
    tags: ["calm", "melancholic", "late-night"],
  },
  {
    id: "mingus-ah-um",
    artist: "Charles Mingus",
    title: "Mingus Ah Um",
    year: 1959,
    tags: ["energetic", "classic"],
  },
  {
    id: "at-the-pershing",
    artist: "Ahmad Jamal",
    title: "At the Pershing: But Not for Me",
    year: 1958,
    tags: ["calm", "piano", "late-night"],
  },
  {
    id: "sarah-vaughan",
    artist: "Sarah Vaughan",
    title: "Sarah Vaughan",
    year: 1954,
    tags: ["vocal", "melancholic"],
  },
];

export const availableTags = [
  "calm",
  "late-night",
  "energetic",
  "melancholic",
  "piano",
  "vocal",
  "classic",
  "spiritual",
];
