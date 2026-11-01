import { describe, it, expect } from "vitest";
import {
  buildPreferenceQuery,
  findContradictoryTags,
  isValidDiscoveryTag,
} from "./preferences.js";

describe("buildPreferenceQuery", () => {
  it("maps axis tags to EVC targets", () => {
    const query = buildPreferenceQuery(["calm", "uplifting", "adventurous"]);
    expect(query.target).toEqual({
      energy: 25,
      valence: 75,
      complexity: 75,
    });
  });

  it("maps trait tags to requested traits", () => {
    const query = buildPreferenceQuery(["vocal", "live"]);
    expect(query.requestedTraits).toEqual(["vocal", "live"]);
  });

  it("ignores unknown tags", () => {
    const query = buildPreferenceQuery(["calm", "unknown"]);
    expect(query.target).toEqual({ energy: 25 });
  });

  it("normalises case and whitespace", () => {
    const query = buildPreferenceQuery(["  CALM  ", "PIANO-LED"]);
    expect(query.target).toEqual({ energy: 25 });
    expect(query.requestedTraits).toEqual(["piano-led"]);
  });
});

describe("findContradictoryTags", () => {
  it("returns contradictory pair for opposite axis tags", () => {
    expect(findContradictoryTags(["calm", "energetic"])).toEqual([
      "calm",
      "energetic",
    ]);
  });

  it("returns empty when no contradiction is present", () => {
    expect(findContradictoryTags(["calm", "vocal"])).toEqual([]);
  });

  it("normalises input before checking", () => {
    expect(findContradictoryTags([" Calm ", "ENERGETIC"])).toEqual([
      "calm",
      "energetic",
    ]);
  });
});

describe("isValidDiscoveryTag", () => {
  it("accepts EVC axis tags and traits", () => {
    expect(isValidDiscoveryTag("calm")).toBe(true);
    expect(isValidDiscoveryTag("adventurous")).toBe(true);
    expect(isValidDiscoveryTag("piano-led")).toBe(true);
  });

  it("rejects unknown tags", () => {
    expect(isValidDiscoveryTag("classic")).toBe(false);
  });
});
