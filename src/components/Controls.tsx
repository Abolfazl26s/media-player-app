import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import type { RepeatMode } from "../types";

interface ControlsProps {
  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffleToggle: () => void;
  onRepeatToggle: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  isAvailable: boolean;
}

const Controls = ({
  isPlaying,
  isShuffle,
  repeatMode,
  onPlayPause,
  onNext,
  onPrev,
  onShuffleToggle,
  onRepeatToggle,
  onSeekBackward,
  onSeekForward,
  isAvailable,
}: ControlsProps) => {
  const RepeatIcon = () => {
    const baseIcon = (
      <Repeat
        className={`w-5 h-5 ${
          repeatMode === "all" ? "text-purple-400" : "text-white"
        }`}
      />
    );

    switch (repeatMode) {
      case "one":
        return (
          <div className="relative">
            <Repeat1 className="w-5 h-5 text-purple-400" />
            <span className="absolute -top-1 -right-1 text-xs bg-purple-500 text-white rounded-full h-3.5 w-3.5 flex items-center justify-center">
              1
            </span>
          </div>
        );
      case "all":
        return baseIcon;
      case "off":
      default:
        return <Repeat className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 w-full mt-4">
      <button
        onClick={onShuffleToggle}
        disabled={!isAvailable}
        title="Shuffle"
        className="p-2 hover:bg-white/10 rounded-full disabled:opacity-50 transition-colors"
      >
        <Shuffle
          className={`w-5 h-5 transition-colors ${
            isShuffle ? "text-purple-400" : "text-white"
          }`}
        />
      </button>
      <button
        onClick={onSeekBackward}
        disabled={!isAvailable}
        title="Seek Backward 10s"
        className="p-2 hover:bg-white/10 rounded-full disabled:opacity-50 transition-colors"
      >
        <RotateCcw className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={onPrev}
        disabled={!isAvailable}
        title="Previous"
        className="p-2 rounded-full bg-black/20 hover:bg-white/20 disabled:opacity-50 transition-colors"
      >
        <SkipBack className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={onPlayPause}
        disabled={!isAvailable}
        title={isPlaying ? "Pause" : "Play"}
        className="p-4 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-transform transform hover:scale-110"
      >
        {isPlaying ? (
          <Pause className="w-8 h-8 text-white" />
        ) : (
          <Play className="w-8 h-8 text-white" />
        )}
      </button>
      <button
        onClick={onNext}
        disabled={!isAvailable}
        title="Next"
        className="p-2 rounded-full bg-black/20 hover:bg-white/20 disabled:opacity-50 transition-colors"
      >
        <SkipForward className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={onSeekForward}
        disabled={!isAvailable}
        title="Seek Forward 10s"
        className="p-2 hover:bg-white/10 rounded-full disabled:opacity-50 transition-colors"
      >
        <RotateCw className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={onRepeatToggle}
        disabled={!isAvailable}
        title="Repeat"
        className="p-2 hover:bg-white/10 rounded-full disabled:opacity-50 transition-colors"
      >
        <RepeatIcon />
      </button>
    </div>
  );
};

export default Controls;
