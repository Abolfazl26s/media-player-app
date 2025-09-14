const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

interface ProgressBarProps {
  progress: number;
  duration: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProgressBar = ({ progress, duration, onSeek }: ProgressBarProps) => {
  return (
    <div className="w-full">
      <input
        type="range"
        min="0"
        max={duration || 100}
        value={progress}
        onChange={onSeek}
        className="w-full h-1.5 focus-visible:border-0
         bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-400"
      />
      <div className="flex justify-between text-xs text-gray-300 mt-1">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
