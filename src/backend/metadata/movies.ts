/**
 * Movie metadata and streaming service
 * Integrates TMDB API with streaming providers
 */

export interface MovieSearchResult {
  id: string;
  title: string;
  year?: number;
  image?: string;
  rating?: number;
  overview?: string;
  type: "movie" | "tv";
  source?: string;
}

type MovieDetailsBase = {
  runtime?: number;
  genres?: string[];
  releaseDate?: string;
  director?: string;
  cast?: string[];
  providers?: string[];
  imdbId?: string;
  tmdbId?: string;
};

export interface MovieDetails extends MovieSearchResult, MovieDetailsBase {}

export interface TVShow extends MovieDetailsBase {
  type: "tv";
  id: string;
  title: string;
  year?: number;
  image?: string;
  rating?: number;
  overview?: string;
  seasons: number;
  episodes: number;
  createdBy?: string[];
}

const TMDB_BASE = "https://api.themoviedb.org/3";

/**
 * Initialize TMDB API key from environment
 */
function getTmdbApiKey(): string {
  const key = import.meta.env.VITE_TMDB_READ_API_KEY;
  if (!key) {
    console.warn("VITE_TMDB_READ_API_KEY is not set");
  }
  return key || "";
}

/** * Search TMDB API
 */
async function searchTMDB(
  query: string,
  type: "movie" | "tv",
  apiKey: string,
): Promise<MovieSearchResult[]> {
  try {
    const endpoint = `${TMDB_BASE}/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("TMDB search failed");

    const data = (await response.json()) as any;
    return (data.results || []).slice(0, 10).map((item: any) => ({
      id: item.id?.toString(),
      title: item.title || item.name,
      year: item.release_date
        ? new Date(item.release_date).getFullYear()
        : item.first_air_date
          ? new Date(item.first_air_date).getFullYear()
          : undefined,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : undefined,
      rating: item.vote_average,
      overview: item.overview,
      type: type as "movie" | "tv",
      source: "tmdb",
    }));
  } catch (error) {
    console.error(`TMDB search error for ${type}:`, error);
    return [];
  }
}

/** * Search movies by title
 */
export async function searchMovies(
  query: string,
  type: "movie" | "tv" | "all" = "all",
): Promise<MovieSearchResult[]> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return [];

  try {
    const queries: Promise<MovieSearchResult[]>[] = [];

    if (type === "all" || type === "movie") {
      queries.push(searchTMDB(query, "movie", apiKey));
    }

    if (type === "all" || type === "tv") {
      queries.push(searchTMDB(query, "tv", apiKey));
    }

    const results = await Promise.allSettled(queries);
    return results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
}

/**
 * Get trending movies
 */
export async function getTrendingMovies(): Promise<MovieSearchResult[]> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return [];

  try {
    const endpoint = `${TMDB_BASE}/trending/movie/week?api_key=${apiKey}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch trending movies");

    const data = (await response.json()) as any;
    return (data.results || []).slice(0, 15).map((item: any) => ({
      id: item.id?.toString(),
      title: item.title,
      year: item.release_date
        ? new Date(item.release_date).getFullYear()
        : undefined,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : undefined,
      rating: item.vote_average,
      overview: item.overview,
      type: "movie" as const,
      source: "tmdb",
    }));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}

/**
 * Get trending TV shows
 */
export async function getTrendingTV(): Promise<MovieSearchResult[]> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return [];

  try {
    const endpoint = `${TMDB_BASE}/trending/tv/week?api_key=${apiKey}`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch trending TV");

    const data = (await response.json()) as any;
    return (data.results || []).slice(0, 15).map((item: any) => ({
      id: item.id?.toString(),
      title: item.name,
      year: item.first_air_date
        ? new Date(item.first_air_date).getFullYear()
        : undefined,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : undefined,
      rating: item.vote_average,
      overview: item.overview,
      type: "tv" as const,
      source: "tmdb",
    }));
  } catch (error) {
    console.error("Error fetching trending TV:", error);
    return [];
  }
}

/**
 * Get movie/TV details
 */
export async function getMovieDetails(
  id: string,
  type: "movie" | "tv" = "movie",
): Promise<MovieDetails | null> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return null;

  try {
    const endpoint = `${TMDB_BASE}/${type}/${id}?api_key=${apiKey}&append_to_response=credits,external_ids`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch details");

    const data = (await response.json()) as any;

    return {
      id: data.id?.toString(),
      title: data.title || data.name,
      year:
        data.release_date || data.first_air_date
          ? new Date(data.release_date || data.first_air_date).getFullYear()
          : undefined,
      image: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : undefined,
      rating: data.vote_average,
      overview: data.overview,
      type,
      runtime: data.runtime || data.episode_run_time?.[0],
      genres: data.genres?.map((g: any) => g.name),
      releaseDate: data.release_date || data.first_air_date,
      director: data.credits?.crew?.find((c: any) => c.job === "Director")
        ?.name,
      cast: data.credits?.cast?.slice(0, 5).map((c: any) => c.name),
      imdbId: data.external_ids?.imdb_id,
      tmdbId: data.id?.toString(),
      source: "tmdb",
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

/**
 * Get popular movies
 */
export async function getPopularMovies(): Promise<MovieSearchResult[]> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return [];

  try {
    const endpoint = `${TMDB_BASE}/movie/popular?api_key=${apiKey}&page=1`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch popular movies");

    const data = (await response.json()) as any;
    return (data.results || []).slice(0, 12).map((item: any) => ({
      id: item.id?.toString(),
      title: item.title,
      year: item.release_date
        ? new Date(item.release_date).getFullYear()
        : undefined,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : undefined,
      rating: item.vote_average,
      overview: item.overview,
      type: "movie" as const,
      source: "tmdb",
    }));
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
}

/**
 * Get popular TV shows
 */
export async function getPopularTV(): Promise<MovieSearchResult[]> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) return [];

  try {
    const endpoint = `${TMDB_BASE}/tv/popular?api_key=${apiKey}&page=1`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to fetch popular TV");

    const data = (await response.json()) as any;
    return (data.results || []).slice(0, 12).map((item: any) => ({
      id: item.id?.toString(),
      title: item.name,
      year: item.first_air_date
        ? new Date(item.first_air_date).getFullYear()
        : undefined,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : undefined,
      rating: item.vote_average,
      overview: item.overview,
      type: "tv" as const,
      source: "tmdb",
    }));
  } catch (error) {
    console.error("Error fetching popular TV:", error);
    return [];
  }
}
