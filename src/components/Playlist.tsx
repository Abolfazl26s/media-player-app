import React from "react";
import type { Track } from "../types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, Heart, PlayCircle, Video } from "lucide-react";
import AddTrackButton from "./AddTrackButton";

interface PlaylistProps {
  tracks: Track[];
  currentTrack: Track | null;
  isDraggingOver: boolean;
  onSelectTrack: (trackId: number) => void;
  onToggleFavorite: (trackId: number) => void;
  onAddTracksClick: () => void; // For the button click
  // Event handlers for drag and drop on the playlist itself
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Playlist = ({
  tracks,
  currentTrack,
  isDraggingOver,
  onSelectTrack,
  onToggleFavorite,
  onAddTracksClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: PlaylistProps) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`w-full h-full bg-black/20 backdrop-blur-lg border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isDraggingOver ? "border-purple-400 scale-105" : "border-transparent"
      }`}
    >
      <h2 className="text-xl font-bold mb-4 text-white flex-shrink-0">
        Playlist
      </h2>

      <Droppable droppableId="playlist">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2 overflow-y-auto pr-2 flex-grow"
          >
            {tracks.map((track, index) => (
              <Draggable
                key={track.id}
                draggableId={track.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`group flex items-center p-2 rounded-md transition-all duration-200 ${
                      currentTrack?.id === track.id
                        ? "bg-purple-600/70 shadow-md"
                        : "hover:bg-white/10 bg-white/5"
                    } ${snapshot.isDragging ? "bg-purple-500/50" : ""}`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="p-1 cursor-grab"
                    >
                      <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </div>
                    <div
                      className="flex-grow flex items-center cursor-pointer overflow-hidden"
                      onClick={() => onSelectTrack(track.id)}
                    >
                      {track.type === "audio" ? (
                        <PlayCircle className="w-10 h-10 mx-2 text-purple-300 flex-shrink-0" />
                      ) : (
                        <Video className="w-10 h-10 mx-2 text-blue-300 flex-shrink-0" />
                      )}

                      <div className="w-full overflow-hidden whitespace-nowrap">
                        <p className="font-semibold text-white inline-block w-full group-hover:animate-marquee">
                          {track.title}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFavorite(track.id)}
                      className="p-2 ml-2 hover:bg-white/20 rounded-full"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          track.isFavorite
                            ? "text-red-500 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      <div className="flex-shrink-0">
        <AddTrackButton onClick={onAddTracksClick} />
      </div>
    </div>
  );
};

export default Playlist;
