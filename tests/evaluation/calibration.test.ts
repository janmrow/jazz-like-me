import { describe, it, expect } from "vitest";
import { recommend } from "../../src/domain/recommend.js";
import { seedAlbums } from "../../src/db/seed.js";
import type { Score, Trait } from "../../src/domain/types.js";
import scenarios from "./scenarios.json" with { type: "json" };

describe("recommendation calibration scenarios", () => {
  it.each(scenarios)("$id — respects strong candidates and poor fits", (scenario) => {
    const query = {
      target: {
        energy: scenario.targetProfile.energy as Score,
        valence: scenario.targetProfile.valence as Score,
        complexity: scenario.targetProfile.complexity as Score,
      },
      requestedTraits: scenario.requiredTraits as Trait[],
    };

    const topThree = recommend(query, seedAlbums);
    const topIds = new Set(topThree.map((album) => album.id));

    const strongIds = new Set(scenario.strongCandidates);
    const poorIds = new Set(scenario.poorFits);

    const strongMatches = [...topIds].filter((id) => strongIds.has(id));

    expect(
      strongMatches.length,
      `expected at least one strong candidate in [${[...topIds].join(", ")}]`
    ).toBeGreaterThanOrEqual(1);

    const poorMatches = [...topIds].filter((id) => poorIds.has(id));

    expect(
      poorMatches,
      `expected no poor fits in top three`
    ).toEqual([]);

  });
});
