export type User = {
  name: string;
  id: string;
  externalURL: string;
  imageURL: string;
};
export type PlaylistInfo = {
  name: string;
  numTracks: number;
  href: string;
  playlistCover: string;
  id: string;
};
export type TrackInfo = {
  album: {
    name: string;
    year: string;
    id: string;
    imageURL: string;
    externalURL: string;
  };
  artist: {
    name: string;
    id: string;
    externalURL: string;
  };
  name: string;
  id: string;
  externalURL: string;
};
export type ShortTrackInfo = {
  name: string;
  id: string;
  artistName: string;
  albumName: string;
};
export type TrackAudioFeatures = {
  trackID: string;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  key: number; // C=0, C#=1, D=2, ...
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
};
