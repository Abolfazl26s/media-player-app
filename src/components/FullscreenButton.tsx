import { Expand, Shrink } from "lucide-react";

interface FullscreenButtonProps {
  isFullscreen: boolean;
  onToggle: () => void;
}

const FullscreenButton = ({
  isFullscreen,
  onToggle,
}: FullscreenButtonProps) => {
  return (
    <button
      onClick={onToggle}
      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      className="p-2 hover:bg-white/10 rounded-full transition-colors"
    >
      {isFullscreen ? (
        <Shrink className="w-6 h-6 text-white" />
      ) : (
        <Expand className="w-6 h-6 text-white" />
      )}
    </button>
  );
};

export default FullscreenButton;
