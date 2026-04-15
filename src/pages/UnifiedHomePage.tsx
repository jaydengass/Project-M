import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import { getRecentAnime, getTrendingAnime } from "@/backend/metadata/anime";
import type { AnimeSearchResult } from "@/backend/metadata/anime";
import {
  getPopularMovies,
  getTrendingMovies,
  getTrendingTV,
} from "@/backend/metadata/movies";
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

export function UnifiedHomePage() {
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState<MovieSearchResult[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieSearchResult[]>([]);
  const [trendingTV, setTrendingTV] = useState<MovieSearchResult[]>([]);
  const [trendingAnime, setTrendingAnime] = useState<AnimeSearchResult[]>([]);
  const [recentAnime, setRecentAnime] = useState<AnimeSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "movies" | "tv" | "anime">(
    "all",
  );

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [movies, popular, tv, anime, recent] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTrendingTV(),
          getTrendingAnime(),
          getRecentAnime(),
        ]);

        setTrendingMovies(movies);
        setPopularMovies(popular);
        setTrendingTV(tv);
        setTrendingAnime(anime);
        setRecentAnime(recent);
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  return (
    <>
      <Helmet>
        <title>Movie & Anime Hub - Stream Everything</title>
        <meta
          name="description"
          content="Stream movies, TV shows, and anime from all your favorite sources"
        />
      </Helmet>

      <HomeLayout showBg>
        <WideContainer>
          {/* Hero Section */}
          <div className="mb-12 -mx-8 px-8 py-16 bg-gradient-to-b from-blue-900 via-purple-900 to-transparent relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Watch Everything
              </h1>
              <p className="text-xl text-zinc-200 mb-8">
                Movies, TV Shows, and Anime from your favorite streaming sources
                - all in one place
              </p>

              {/* Search Bar */}
              <div className="flex gap-2 mb-8">
                <input
                  type="text"
                  placeholder="Search movies, shows, or anime..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      navigate(
                        `/search?q=${encodeURIComponent(e.currentTarget.value)}`,
                      );
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2">
                {["all", "movies", "tv", "anime"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      activeTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12 pb-12">
            {(activeTab === "all" || activeTab === "movies") &&
              trendingMovies.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    🔥 Trending Movies
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {trendingMovies.map((movie) => (
                      <SimpleMovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => navigate(`/media/${movie.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

            {(activeTab === "all" || activeTab === "movies") &&
              popularMovies.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    ⭐ Popular Movies
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {popularMovies.map((movie) => (
                      <SimpleMovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={() => navigate(`/media/${movie.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

            {(activeTab === "all" || activeTab === "tv") &&
              trendingTV.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    📺 Trending TV Shows
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {trendingTV.map((tv) => (
                      <SimpleMovieCard
                        key={tv.id}
                        movie={tv}
                        onClick={() => navigate(`/media/${tv.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

            {(activeTab === "all" || activeTab === "anime") &&
              trendingAnime.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    🎌 Trending Anime
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {trendingAnime.map((anime) => (
                      <SimpleAnimeCard
                        key={anime.id}
                        anime={anime}
                        onClick={() =>
                          navigate(`/media/${anime.id}?type=anime`)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

            {(activeTab === "all" || activeTab === "anime") &&
              recentAnime.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    🆕 Recent Anime Episodes
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {recentAnime.map((anime) => (
                      <SimpleAnimeCard
                        key={anime.id}
                        anime={anime}
                        onClick={() =>
                          navigate(`/media/${anime.id}?type=anime`)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
          )}
        </WideContainer>
      </HomeLayout>
    </>
  );
}
