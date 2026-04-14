import React, { useState } from "react";

interface AnimeCardProps {
  id: string;
  title: string;
  altTitle?: string;
  image?: string;
  rating?: number;
  year?: number;
  genres?: string[];
  episodes?: number;
  onSelect: (id: string) => void;
}

export function AnimeCard({
  id,
  title,
  altTitle,
  image,
  rating,
  year,
  genres,
  episodes,
  onSelect,
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-zinc-900 transition-all duration-300 hover:scale-105 h-full"
      onClick={() => onSelect(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-zinc-800">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-zinc-900 text-zinc-400">
            <span className="text-center px-4 text-sm font-semibold">
              {title}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300" />

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold z-10">
            ★ {rating.toFixed(1)}
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold uppercase z-10">
          Anime
        </div>

        {/* Episodes Badge */}
        {episodes && (
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
            {episodes} eps
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 bg-zinc-900">
        <h3 className="font-semibold text-white truncate text-sm group-hover:text-purple-400 transition-colors line-clamp-2">
          {title}
        </h3>
        {year && <p className="text-xs text-zinc-400 mt-1">{year}</p>}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded"
              >
                {genre}
              </span>
            ))}
            {genres.length > 2 && (
              <span className="text-xs text-zinc-500">
                +{genres.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors">
          <svg
            className="w-6 h-6 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Alt Title Tooltip */}
      {altTitle && isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 p-2 text-xs text-white max-h-12 overflow-hidden">
          {altTitle}
        </div>
      )}
    </div>
  );
}
