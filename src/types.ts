export interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  thumbnail: string;
  type: "audio" | "video";
  isFavorite: boolean;
  subtitleUrl?: string; // Optional: URL for the default subtitle file (.vtt)
}

export type RepeatMode = "off" | "one" | "all";
