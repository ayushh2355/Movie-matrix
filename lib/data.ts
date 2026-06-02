// lib/data.ts

export type ApiMovie = {
  id: string;
  title: string;
  rating: number | null;
  votes: string | null;
  posterUrl: string | null;
  genre: string | null;
  language: string | null;
  cert: string | null;
};

// ── OMDb Integration ──────────────────────────────────────────
import OMDB_IMDB_IDS from "./imdb-ids.json";

interface OmdbResponse {
  imdbID: string;
  Title: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  Genre: string;
  Language: string;
  Rated: string;
  Response: string;
}

function formatVotes(raw: string): string {
  const n = parseInt(raw.replace(/,/g, ""), 10);
  if (isNaN(n)) return raw;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function mapOmdb(data: OmdbResponse): ApiMovie {
  const rating = parseFloat(data.imdbRating);
  return {
    id:        data.imdbID,
    title:     data.Title,
    posterUrl: data.Poster    !== "N/A" ? data.Poster    : null,
    rating:    isNaN(rating)  ? null    : rating,
    votes:     data.imdbVotes !== "N/A" ? formatVotes(data.imdbVotes) : null,
    genre:     data.Genre     !== "N/A" ? data.Genre     : null,
    language:  data.Language  !== "N/A" ? data.Language  : null,
    cert:      data.Rated     !== "N/A" ? data.Rated     : null,
  };
}

export async function fetchMoviesFromOmdb(): Promise<ApiMovie[]> {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    console.warn("[OMDb] OMDB_API_KEY not set in .env");
    return [];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const settled = await Promise.allSettled(
      OMDB_IMDB_IDS.map(async (id) => {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`,
          { signal: controller.signal, cache: "no-store" }
        );
        if (!res.ok) return null;
        const data: OmdbResponse = await res.json();
        if (data.Response === "False") return null;
        return mapOmdb(data);
      })
    );

    clearTimeout(timeoutId);

    const movies = settled
      .filter((r): r is PromiseFulfilledResult<ApiMovie> =>
        r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);

    return movies; 

  } catch (err) {
    console.warn("[OMDb] Fetch failed:", err);
    return []; 
  }
}