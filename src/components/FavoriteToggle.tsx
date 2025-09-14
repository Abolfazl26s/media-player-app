import { Star } from "lucide-react";

interface FavoriteToggleProps {
  showFavorites: boolean;
  onToggle: () => void;
}

const FavoriteToggle = ({ showFavorites, onToggle }: FavoriteToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors ${
        showFavorites
          ? "bg-yellow-500/80 text-white"
          : "bg-white/10 hover:bg-white/20"
      }`}
    >
      <Star className="w-5 h-5" />
      <span>{showFavorites ? "All Tracks" : "Favorites"}</span>
    </button>
  );
};

export default FavoriteToggle;
