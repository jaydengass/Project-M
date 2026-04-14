import React, { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import { searchAnime } from "@/backend/metadata/anime";
import type { AnimeSearchResult } from "@/backend/metadata/anime";
import { searchMovies } from "@/backend/metadata/movies";
import type { MovieSearchResult } from "@/backend/metadata/movies";
import { WideContainer } from "@/components/layout/WideContainer";
import { HomeLayout } from "@/pages/layouts/HomeLayout";

function SimpleMovieCard({
  movie,
  onClick,
}: {
  movie: MovieSearchResult;
  onClick: () => void;
}) {
  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-zinc-900 transition-all h-full hover:scale-105"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-zinc-800">
        {movie.image ? (
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-700 to-zinc-900">
            <span className="text-center px-4 text-sm font-semibold text-zinc-200">
              {movie.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all" />
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
            ★ {movie.rating.toFixed(1)}
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold uppercase">
          {movie.type}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white truncate text-sm line-clamp-2">
          {movie.title}
        </h3>
        {movie.year && (
          <p className="text-xs text-zinc-400 mt-1">{movie.year}</p>
        )}
      </div>
    </div>
  );
}

function SimpleAnimeCard({
  anime,
  onClick,
}: {
  anime: AnimeSearchResult;
  onClick: () => void;
}) {
  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-zinc-900 transition-all h-full hover:scale-105"
      onClick={onClick}
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-zinc-800">
        {anime.image ? (
          <img
            src={anime.image}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-zinc-900">
            <span className="text-center px-4 text-sm font-semibold text-zinc-200">
              {anime.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all" />
        {anime.rating && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
            ★ {anime.rating.toFixed(1)}
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold uppercase">
          Anime
        </div>
        {anime.episodes && (
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
            {anime.episodes} eps
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white truncate text-sm line-clamp-2">
          {anime.title}
        </h3>
        {anime.year && (
          <p className="text-xs text-zinc-400 mt-1">{anime.year}</p>
        )}
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function UnifiedSearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{
    movies: MovieSearchResult[];
    anime: AnimeSearchResult[];
  }>({ movies: [], anime: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "movies" | "anime">("all");

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ movies: [], anime: [] });
      return;
    }

    setLoading(true);
    try {
      const [movies, anime] = await Promise.all([
        searchMovies(query),
        searchAnime(query),
      ]);

      setSearchResults({ movies, anime });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ movies: [], anime: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  const displayMovies = searchResults.movies.filter((m) => m.type === "movie");
  const displayTV = searchResults.movies.filter((m) => m.type === "tv");
  const displayAnime = searchResults.anime;

  return (
    <>
      <Helmet>
        <title>Search - Movie & Anime Hub</title>
      </Helmet>

      <HomeLayout showBg>
        <WideContainer>
          {/* Search Header */}
          <div className="py-12 -mx-8 px-8 bg-gradient-to-b from-blue-900 to-transparent">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-6">
                Search Movies, Shows &amp; Anime
              </h1>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* Results */}
          {searchTerm && (
            <div className="py-12">
              {/* Tab Navigation */}
              {(displayMovies.length > 0 ||
                displayTV.length > 0 ||
                displayAnime.length > 0) && (
                <div className="flex gap-2 mb-8">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    }`}
                  >
                    All
                  </button>
                  {displayMovies.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("movies")}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "movies"
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      }`}
                    >
                      Movies ({displayMovies.length})
                    </button>
                  )}
                  {displayTV.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("movies")}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "movies"
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      }`}
                    >
                      TV Shows ({displayTV.length})
                    </button>
                  )}
                  {displayAnime.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("anime")}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        activeTab === "anime"
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                      }`}
                    >
                      Anime ({displayAnime.length})
                    </button>
                  )}
                </div>
              )}

              {/* Movies Grid */}
              {(activeTab === "all" || activeTab === "movies") &&
                displayMovies.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Movies
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {displayMovies.map((movie) => (
                        <SimpleMovieCard
                          key={movie.id}
                          movie={movie}
                          onClick={() => navigate(`/movie/${movie.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* TV Grid */}
              {(activeTab === "all" || activeTab === "movies") &&
                displayTV.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      TV Shows
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {displayTV.map((tv) => (
                        <SimpleMovieCard
                          key={tv.id}
                          movie={tv}
                          onClick={() => navigate(`/tv/${tv.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* Anime Grid */}
              {(activeTab === "all" || activeTab === "anime") &&
                displayAnime.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Anime
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {displayAnime.map((anime) => (
                        <SimpleAnimeCard
                          key={anime.id}
                          anime={anime}
                          onClick={() => navigate(`/anime/${anime.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}

              {/* No Results */}
              {!loading &&
                displayMovies.length === 0 &&
                displayTV.length === 0 &&
                displayAnime.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xl text-zinc-400">
                      No results found for &quot;{searchTerm}&quot;
                    </p>
                  </div>
                )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!searchTerm && (
            <div className="text-center py-12">
              <p className="text-lg text-zinc-400">
                Start typing to search for movies, shows, or anime
              </p>
            </div>
          )}
        </WideContainer>
      </HomeLayout>
    </>
  );
}
