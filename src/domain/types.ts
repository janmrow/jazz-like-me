export type Score = 0 | 25 | 50 | 75 | 100;

export interface AlbumProfile {
  energy: Score;
  valence: Score;
  complexity: Score;
}

export type Trait = "vocal" | "piano-led" | "live";

export const traits: Trait[] = ["vocal", "piano-led", "live"];

export interface Album {
  id: string;
  artist: string;
  title: string;
  year: number;
  musicbrainzReleaseGroupId?: string;
  profile: AlbumProfile;
  traits: Trait[];
}

export interface PreferenceQuery {
  target: Partial<AlbumProfile>;
  requestedTraits: Trait[];
}

export interface RecommendationOptions {
  limit?: number;
}
