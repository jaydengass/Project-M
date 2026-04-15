/**
 * Anime metadata service
 * Integrates with multiple anime APIs
 */

export interface AnimeSearchResult {
  id: string;
  title: string;
  altTitle?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  rating?: number;
  status?: string;
  genres?: string[];
  synopsis?: string;
  episodes?: number;
  year?: number;
  source?: string;
}

export interface AnimeDetails extends AnimeSearchResult {
  source: string;
  url?: string;
  studios?: string[];
  season?: string;
  year?: number;
}

export interface AnimeEpisode {
  id: string;
  number: number;
  title: string;
  airDate?: string;
  description?: string;
}

const HIANIME_BASE = "https://api.consumet.org/anime/gogoanime";
const JIKAN_BASE = "https://api.jikan.moe/v4";

/**
 * Search anime on Jikan (MyAnimeList API)
 */
async function searchJikan(query: string): Promise<AnimeSearchResult[]> {
  try {
    const response = await fetch(
      `${JIKAN_BASE}/anime?query=${encodeURIComponent(query)}&order_by=score&sort=desc`,
    );
    if (!response.ok) throw new Error("Jikan search failed");

    const data = (await response.json()) as any;
    return (data.data || []).map((item: any) => ({
      id: item.mal_id?.toString(),
      title: item.title,
      altTitle: item.title_english,
      image: item.images?.jpg?.image_url,
      rating: item.score,
      status: item.status,
      genres: item.genres?.map((g: any) => g.name),
      synopsis: item.synopsis,
      episodes: item.episodes,
      source: "jikan",
    }));
  } catch (error) {
    console.error("Jikan search error:", error);
    return [];
  }
}

/**
 * Search anime by title using Jikan API (supports CORS)
 */
export async function searchAnime(query: string): Promise<AnimeSearchResult[]> {
  return searchJikan(query);
}

/**
 * Get trending anime
 */
export async function getTrendingAnime(): Promise<AnimeSearchResult[]> {
  try {
    const response = await fetch(`${JIKAN_BASE}/top/anime?limit=15`);
    if (!response.ok) throw new Error("Failed to fetch trending anime");

    const data = (await response.json()) as any;
    return (data.data || []).map((item: any) => ({
      id: item.mal_id?.toString(),
      title: item.title,
      altTitle: item.title_english,
      image: item.images?.jpg?.image_url,
      rating: item.score,
      status: item.status,
      genres: item.genres?.map((g: any) => g.name),
      episodes: item.episodes,
      year: item.year,
      source: "jikan",
    }));
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return [];
  }
}

/**
 * Get anime details
 */
export async function getAnimeDetails(
  id: string,
  source: string = "jikan",
): Promise<AnimeDetails | null> {
  try {
    if (source === "jikan") {
      const response = await fetch(`${JIKAN_BASE}/anime/${id}`);
      if (!response.ok) throw new Error("Failed to fetch anime details");

      const data = (await response.json()) as any;
      const item = data.data;

      return {
        id: item.mal_id?.toString(),
        title: item.title,
        altTitle: item.title_english,
        image: item.images?.jpg?.image_url,
        rating: item.score,
        status: item.status,
        genres: item.genres?.map((g: any) => g.name),
        synopsis: item.synopsis,
        episodes: item.episodes,
        year: item.year,
        studios: item.studios?.map((s: any) => s.name),
        season: item.season,
        source: "jikan",
        url: item.url,
      };
    }

    if (source === "hianime") {
      const response = await fetch(`${HIANIME_BASE}/info?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch anime info");

      const data = (await response.json()) as any;
      return {
        id: data.id,
        title: data.title,
        image: data.image,
        rating: data.rating,
        status: data.status,
        genres: data.genres,
        synopsis: data.description,
        episodes: data.totalEpisodes,
        source: "hianime",
        url: data.url,
      };
    }
  } catch (error) {
    console.error("Error fetching anime details:", error);
  }

  return null;
}

/**
 * Get anime episodes
 */
export async function getAnimeEpisodes(
  id: string,
  source: string = "hianime",
): Promise<AnimeEpisode[]> {
  try {
    if (source === "hianime") {
      const response = await fetch(`${HIANIME_BASE}/episodes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch episodes");

      const data = (await response.json()) as any;
      return (data || []).map((ep: any, index: number) => ({
        id: ep.id || `${id}-${index}`,
        number: index + 1,
        title: ep.title || `Episode ${index + 1}`,
        airDate: ep.airDate,
        description: ep.description,
      }));
    }
  } catch (error) {
    console.error("Error fetching episodes:", error);
  }

  return [];
}

/**
 * Get recent anime
 * Using Jikan API which supports CORS
 */
export async function getRecentAnime(): Promise<AnimeSearchResult[]> {
  try {
    const response = await fetch(
      `${JIKAN_BASE}/anime?order_by=start_date&sort=desc&limit=15`,
    );
    if (!response.ok) throw new Error("Failed to fetch recent anime");

    const data = (await response.json()) as any;
    return (data.data || []).map((item: any) => ({
      id: item.mal_id?.toString(),
      title: item.title,
      image: item.images?.jpg?.image_url,
      rating: item.score,
      status: item.status,
      source: "jikan",
    }));
  } catch (error) {
    console.error("Error fetching recent anime:", error);
    return [];
  }
}
