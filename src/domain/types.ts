export type Tag = string;

export interface Album {
  id: string;
  artist: string;
  title: string;
  year: number;
  tags: Tag[];
}
