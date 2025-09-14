import React, { useState, useRef, useEffect, useCallback } from "react";

import type { DragEvent } from "react";
import { getPlaylist } from "../api";
import type { Track, RepeatMode } from "../types";
import Playlist from "./Playlist";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";
import FavoriteToggle from "./FavoriteToggle";
import PlaybackSpeedControl from "./PlaybackSpeedControl";
import SubtitleControl from "./SubtitleControl";
import FullscreenButton from "./FullscreenButton";
import Footer from "./Footer";
import { UploadCloud, ListMusic } from "lucide-react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

const Player = () => {
  const [playlist, setPlaylist] = useState<Track[]>(getPlaylist());
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDraggingOverPlayer, setIsDraggingOverPlayer] = useState(false);
  const [isDraggingOverPlaylist, setIsDraggingOverPlaylist] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [showFavorites, setShowFavorites] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [subtitleUrl, setSubtitleUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(true);
  const [areControlsVisible, setAreControlsVisible] = useState(true);

  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const subtitleObjectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<number | null>(null);

  const displayedPlaylist = showFavorites
    ? playlist.filter((t) => t.isFavorite)
    : playlist;

  const handlePlayPause = useCallback(() => {
    if (currentTrack) setIsPlaying((p) => !p);
  }, [currentTrack]);
  const handleSeekBackward = useCallback(() => {
    if (mediaRef.current) {
      mediaRef.current.currentTime -= 10;
    }
  }, []);
  const handleSeekForward = useCallback(() => {
    if (mediaRef.current) {
      mediaRef.current.currentTime += 10;
    }
  }, []);
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      playerContainerRef.current
        ?.requestFullscreen()
        .catch((err) => console.error(`Error: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen) {
        setIsPlaylistVisible(true);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const resetTimer = () => {
      setAreControlsVisible(true);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = window.setTimeout(
        () => setAreControlsVisible(false),
        3000
      );
    };
    if (isFullscreen) {
      const events: ("mousemove" | "mousedown" | "keydown" | "touchstart")[] = [
        "mousemove",
        "mousedown",
        "keydown",
        "touchstart",
      ];
      events.forEach((event) => document.addEventListener(event, resetTimer));
      resetTimer();
      return () => {
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        events.forEach((event) =>
          document.removeEventListener(event, resetTimer)
        );
      };
    } else {
      setAreControlsVisible(true);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName.match(/INPUT|TEXTAREA/)) return;
      if (areControlsVisible) {
        switch (e.code) {
          case "Space":
            e.preventDefault();
            handlePlayPause();
            break;
          case "ArrowRight":
            handleSeekForward();
            break;
          case "ArrowLeft":
            handleSeekBackward();
            break;
          case "ArrowUp":
            e.preventDefault();
            setVolume((v) => Math.min(1, v + 0.05));
            break;
          case "ArrowDown":
            e.preventDefault();
            setVolume((v) => Math.max(0, v - 0.05));
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    areControlsVisible,
    handlePlayPause,
    handleSeekForward,
    handleSeekBackward,
  ]);

  useEffect(() => {
    setSubtitleUrl(currentTrack?.subtitleUrl || null);
    if (subtitleObjectUrlRef.current) {
      URL.revokeObjectURL(subtitleObjectUrlRef.current);
      subtitleObjectUrlRef.current = null;
    }
  }, [currentTrack]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;
    const handleTimeUpdate = () => setProgress(media.currentTime);
    const handleLoadedMetadata = () => setDuration(media.duration);
    const handleEnded = () => {
      if (repeatMode === "one") {
        media.currentTime = 0;
        media.play();
      } else {
        handleNext();
      }
    };
    media.addEventListener("timeupdate", handleTimeUpdate);
    media.addEventListener("loadedmetadata", handleLoadedMetadata);
    media.addEventListener("ended", handleEnded);
    isPlaying
      ? media.play().catch((e) => console.error(`Playback error: ${e.message}`))
      : media.pause();
    return () => {
      media.removeEventListener("timeupdate", handleTimeUpdate);
      media.removeEventListener("loadedmetadata", handleLoadedMetadata);
      media.removeEventListener("ended", handleEnded);
    };
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (mediaRef.current) mediaRef.current.volume = volume;
  }, [volume]);
  useEffect(() => {
    if (mediaRef.current) mediaRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const handleSubtitleFileChange = (file: File) => {
    if (subtitleObjectUrlRef.current) {
      URL.revokeObjectURL(subtitleObjectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    subtitleObjectUrlRef.current = url;
    setSubtitleUrl(url);
  };

  const createTrackFromFile = (file: File): Track => {
    const fileUrl = URL.createObjectURL(file);
    return {
      id: Date.now() + Math.random(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local File",
      url: fileUrl,
      thumbnail:
        "https://cdn.pixabay.com/photo/2019/07/25/17/09/music-4364022_1280.jpg",
      type: file.type.startsWith("audio/") ? "audio" : "video",
      isFavorite: false,
    };
  };

  const handleFilesAdded = (files: FileList) => {
    const newTracks = Array.from(files)
      // BUG FIX: Accept files with empty MIME types, as browsers often fail to identify types like .mkv
      .filter(
        (file) =>
          file.type.startsWith("audio/") ||
          file.type.startsWith("video/") ||
          file.type === ""
      )
      .map(createTrackFromFile);

    if (newTracks.length > 0) {
      setPlaylist((prev) => [...prev, ...newTracks]);
      if (!currentTrack) {
        setCurrentTrack(newTracks[0]);
        setIsPlaying(true);
      }
    }
  };

  const handlePlayerDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverPlayer(false);
    handleFilesAdded(e.dataTransfer.files);
  };
  const handlePlayerDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverPlayer(true);
  };
  const handlePlayerDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOverPlayer(false);
  };

  const handlePlaylistDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverPlaylist(false);
    handleFilesAdded(e.dataTransfer.files);
  };
  const handlePlaylistDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverPlaylist(true);
  };
  const handlePlaylistDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverPlaylist(false);
  };

  const handleSelectTrack = (trackId: number) => {
    const track = playlist.find((t) => t.id === trackId);
    if (track) {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentPlaylist = displayedPlaylist;
    if (currentPlaylist.length === 0) return;
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * currentPlaylist.length);
      if (
        currentPlaylist.length > 1 &&
        currentTrack &&
        currentPlaylist[randomIndex].id === currentTrack.id
      ) {
        randomIndex = (randomIndex + 1) % currentPlaylist.length;
      }
      setCurrentTrack(currentPlaylist[randomIndex]);
    } else {
      const currentIndex = currentTrack
        ? currentPlaylist.findIndex((t) => t.id === currentTrack.id)
        : -1;
      const nextIndex = currentIndex + 1;
      if (nextIndex < currentPlaylist.length) {
        setCurrentTrack(currentPlaylist[nextIndex]);
      } else {
        if (repeatMode === "all") {
          setCurrentTrack(currentPlaylist[0]);
        } else {
          setCurrentTrack(currentPlaylist[0]);
          setIsPlaying(false);
          setProgress(0);
          return;
        }
      }
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentPlaylist = displayedPlaylist;
    if (!currentTrack || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(
      (t) => t.id === currentTrack.id
    );
    const prevIndex =
      (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    setCurrentTrack(currentPlaylist[prevIndex]);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Number(e.target.value);
      setProgress(mediaRef.current.currentTime);
    }
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setVolume(Number(e.target.value));
  const handleMuteToggle = () => setVolume(volume > 0 ? 0 : 1);
  const handleShuffleToggle = () => setIsShuffle(!isShuffle);
  const handleRepeatToggle = () => {
    const modes: RepeatMode[] = ["off", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };
  const handleToggleFavorite = (trackId: number) => {
    setPlaylist(
      playlist.map((t) =>
        t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t
      )
    );
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(playlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPlaylist(items);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 text-white flex items-center justify-center p-4 font-sans">
        <input
          type="file"
          multiple
          accept="audio/*,video/*,.mkv,.flac,.ogg,.avi"
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
          className="hidden"
        />
        <div
          ref={playerContainerRef}
          className={`w-full max-w-7xl flex items-stretch justify-center ${
            isFullscreen
              ? "fixed inset-0 z-50 bg-black flex-row !max-w-full"
              : "flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0"
          } ${isFullscreen && !areControlsVisible ? "cursor-none" : ""}`}
        >
          <div
            className={`flex flex-col items-center relative transition-all duration-300 ${
              isFullscreen
                ? "flex-grow h-full"
                : "w-full lg:w-2/3 bg-black/20 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl"
            }`}
          >
            <div
              className={`w-full bg-black/50 overflow-hidden relative ${
                isDraggingOverPlayer
                  ? "border-purple-400 border-2 border-dashed"
                  : "border-transparent"
              } ${
                isFullscreen
                  ? "flex-grow rounded-none"
                  : "aspect-video rounded-lg mb-4"
              }`}
              onDrop={handlePlayerDrop}
              onDragOver={handlePlayerDragOver}
              onDragLeave={handlePlayerDragLeave}
            >
              {currentTrack ? (
                currentTrack.type === "video" ? (
                  <video
                    key={currentTrack.id}
                    ref={mediaRef as React.Ref<HTMLVideoElement>}
                    src={currentTrack.url}
                    className="w-full h-full object-contain"
                  >
                    {subtitleUrl && (
                      <track
                        key={subtitleUrl}
                        kind="subtitles"
                        srcLang="en"
                        label="English"
                        src={subtitleUrl}
                        default
                      />
                    )}
                  </video>
                ) : (
                  <>
                    <img
                      src={currentTrack.thumbnail}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <h2 className="text-3xl font-bold text-shadow-lg">
                        {currentTrack.title}
                      </h2>
                      <p className="text-xl text-gray-300 mt-2 text-shadow">
                        {currentTrack.artist}
                      </p>
                    </div>
                    <audio
                      key={currentTrack.id}
                      ref={mediaRef as React.Ref<HTMLAudioElement>}
                      src={currentTrack.url}
                    ></audio>
                  </>
                )
              ) : (
                <div
                  onClick={handleTriggerFileInput}
                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <UploadCloud size={64} />
                  <p className="mt-4 text-lg">
                    Click to select files or Drag & Drop here
                  </p>
                </div>
              )}
              {isDraggingOverPlayer && (
                <div className="absolute inset-0 bg-purple-900/50 flex flex-col items-center justify-center pointer-events-none">
                  <UploadCloud
                    size={80}
                    className="text-white animate-bounce"
                  />
                  <p className="text-2xl font-bold mt-4 text-white">
                    Drop to Play!
                  </p>
                </div>
              )}
            </div>
            {isFullscreen && (
              <button
                onClick={() => setIsPlaylistVisible(!isPlaylistVisible)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-white/20 transition-colors"
                title="Toggle Playlist"
              >
                <ListMusic className="w-6 h-6" />
              </button>
            )}
            <div
              className={`w-full transition-all duration-300 ease-in-out ${
                isFullscreen
                  ? `p-4 absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent ${
                      !areControlsVisible
                        ? "opacity-0 translate-y-full"
                        : "opacity-100"
                    }`
                  : "mt-auto"
              }`}
            >
              <div className="w-full flex items-center space-x-4">
                <PlaybackSpeedControl
                  currentRate={playbackRate}
                  onRateChange={setPlaybackRate}
                />
                <ProgressBar
                  progress={progress}
                  duration={duration}
                  onSeek={handleSeek}
                />
                <VolumeControl
                  volume={volume}
                  onVolumeChange={handleVolumeChange}
                  onMuteToggle={handleMuteToggle}
                />
                {currentTrack?.type === "video" && (
                  <SubtitleControl
                    onSubtitleChange={handleSubtitleFileChange}
                  />
                )}
                <FullscreenButton
                  isFullscreen={isFullscreen}
                  onToggle={handleToggleFullscreen}
                />
              </div>
              <Controls
                isPlaying={isPlaying}
                isShuffle={isShuffle}
                repeatMode={repeatMode}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrev={handlePrev}
                onShuffleToggle={handleShuffleToggle}
                onRepeatToggle={handleRepeatToggle}
                onSeekBackward={handleSeekBackward}
                onSeekForward={handleSeekForward}
                isAvailable={!!currentTrack}
              />
            </div>
          </div>
          <div
            className={`flex-col space-y-4 transition-all duration-300 ${
              isFullscreen
                ? `flex-shrink-0 h-full ${
                    isPlaylistVisible ? "w-[400px] flex" : "w-0 hidden"
                  }`
                : "w-full lg:w-1/3 flex"
            }`}
          >
            <div className="flex justify-end">
              <FavoriteToggle
                showFavorites={showFavorites}
                onToggle={() => setShowFavorites(!showFavorites)}
              />
            </div>
            <Playlist
              tracks={displayedPlaylist}
              currentTrack={currentTrack}
              isDraggingOver={isDraggingOverPlaylist}
              onSelectTrack={handleSelectTrack}
              onToggleFavorite={handleToggleFavorite}
              onAddTracksClick={handleTriggerFileInput}
              onDragOver={handlePlaylistDragOver}
              onDragLeave={handlePlaylistDragLeave}
              onDrop={handlePlaylistDrop}
            />
          </div>
        </div>
        <Footer />
      </div>
    </DragDropContext>
  );
};

export default Player;
