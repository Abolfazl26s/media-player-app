
import type { Track } from "./types";

export const getPlaylist = (): Track[] => {
  return [
    {
      id: 1,
      title: "For The Rest Of My Life",
      artist: "Meydän",
      url: "https://cdn.pixabay.com/audio/2024/05/13/audio_14287538f5.mp3",
      thumbnail:
        "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_1280.jpg",
      type: "audio",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Big Buck Bunny",
      artist: "Blender Foundation",
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail:
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
      type: "video",
      isFavorite: false,
      subtitleUrl:
        "https://gist.githubusercontent.com/samdutton/ca37f3adaf4e23679957b8083e061177/raw/e19399fbcc3ce1b1de0462bb6959604356e53771/sample.vtt",
    },
    {
      id: 3,
      title: "Inspiring Cinematic",
      artist: "Lesfm",
      url: "https://cdn.pixabay.com/audio/2023/02/20/audio_51b752a121.mp3",
      thumbnail:
        "https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg",
      type: "audio",
      isFavorite: true,
    },
  ];
};
