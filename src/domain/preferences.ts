import { traits, type AlbumProfile, type PreferenceQuery, type Trait } from "./types.js";

export type EnergyTag = "calm" | "energetic";
export type ValenceTag = "melancholic" | "uplifting";
export type ComplexityTag = "accessible" | "adventurous";
export type TraitTag = Trait;

export type DiscoveryTag =
  | EnergyTag
  | ValenceTag
  | ComplexityTag
  | TraitTag;

export const energyTags: EnergyTag[] = ["calm", "energetic"];
export const valenceTags: ValenceTag[] = ["melancholic", "uplifting"];
export const complexityTags: ComplexityTag[] = ["accessible", "adventurous"];

export const discoveryTags: DiscoveryTag[] = [
  ...energyTags,
  ...valenceTags,
  ...complexityTags,
  ...traits,
];

const axisTagPairs: Array<[DiscoveryTag, DiscoveryTag]> = [
  ["calm", "energetic"],
  ["melancholic", "uplifting"],
  ["accessible", "adventurous"],
];

const axisTargets: Record<
  EnergyTag | ValenceTag | ComplexityTag,
  Partial<AlbumProfile>
> = {
  calm: { energy: 25 },
  energetic: { energy: 75 },
  melancholic: { valence: 25 },
  uplifting: { valence: 75 },
  accessible: { complexity: 25 },
  adventurous: { complexity: 75 },
};

export function buildPreferenceQuery(tags: string[]): PreferenceQuery {
  const normalized = tags.map((tag) => tag.trim().toLowerCase());
  const target: Partial<AlbumProfile> = {};
  const requestedTraits: Trait[] = [];

  for (const tag of normalized) {
    if (isTraitTag(tag)) {
      requestedTraits.push(tag);
      continue;
    }

    const axisTarget = axisTargets[tag as keyof typeof axisTargets];
    if (axisTarget) {
      Object.assign(target, axisTarget);
    }
  }

  return { target, requestedTraits };
}

export function findContradictoryTags(tags: string[]): string[] {
  const normalized = new Set(tags.map((tag) => tag.trim().toLowerCase()));

  for (const [a, b] of axisTagPairs) {
    if (normalized.has(a) && normalized.has(b)) {
      return [a, b];
    }
  }

  return [];
}

export function isValidDiscoveryTag(tag: string): tag is DiscoveryTag {
  return discoveryTags.includes(tag as DiscoveryTag);
}

function isTraitTag(tag: string): tag is Trait {
  return traits.includes(tag as Trait);
}
