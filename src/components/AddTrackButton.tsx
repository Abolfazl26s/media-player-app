
import { PlusCircle } from "lucide-react";

interface AddTrackButtonProps {
  onClick: () => void;
}

const AddTrackButton = ({ onClick }: AddTrackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center p-2 mt-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
    >
      <PlusCircle className="w-5 h-5 mr-2" />
      Add Tracks
    </button>
  );
};

export default AddTrackButton;
