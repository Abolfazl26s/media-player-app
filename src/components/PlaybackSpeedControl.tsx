import { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

interface PlaybackSpeedControlProps {
  currentRate: number;
  onRateChange: (rate: number) => void;
}

const speedRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

const PlaybackSpeedControl = ({
  currentRate,
  onRateChange,
}: PlaybackSpeedControlProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectRate = (rate: number) => {
    onRateChange(rate);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-20 p-2 text-sm bg-black/20 hover:bg-white/20 rounded-md transition-colors"
      >
        {currentRate}x
        <ChevronsUpDown className="w-4 h-4 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-20 bg-gray-800 border border-white/10 rounded-md shadow-lg">
          {speedRates.map((rate) => (
            <div
              key={rate}
              onClick={() => handleSelectRate(rate)}
              className="flex items-center justify-between p-2 hover:bg-purple-600 cursor-pointer"
            >
              <span>{rate}x</span>
              {currentRate === rate && <Check className="w-4 h-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaybackSpeedControl;
