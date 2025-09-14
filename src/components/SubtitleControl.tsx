import { Captions } from "lucide-react";
import React, { useRef } from "react";

interface SubtitleControlProps {
  onSubtitleChange: (file: File) => void;
}

const SubtitleControl = ({ onSubtitleChange }: SubtitleControlProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSubtitleChange(file);
    }
    e.target.value = ""; // Reset for re-selection of the same file
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        accept=".vtt"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        title="Add Subtitles (.vtt)"
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <Captions className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default SubtitleControl;
