
import { Volume1, Volume2, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMuteToggle: () => void;
}

const VolumeControl = ({
  volume,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) => {
  const getVolumeIcon = () => {
    if (volume === 0) {
      return <VolumeX className="w-6 h-6 text-white" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="w-6 h-6 text-white" />;
    }
    return <Volume2 className="w-6 h-6 text-white" />;
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onMuteToggle}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        {getVolumeIcon()}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={onVolumeChange}
        className="w-24 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-400"
      />
    </div>
  );
};

export default VolumeControl;
