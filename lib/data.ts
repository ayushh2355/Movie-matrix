// lib/data.ts

export interface Seat {
  id: string;
  row: string;
  col: number;
  status: string;
}

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


// LOCAL FALLBACK DATA
// This is Used when both the database AND the OMDb API are unreachable.

export const moviesList: ApiMovie[] = [
  {
    id: "6a15ecd987c25a1316b784cb",
    title: "Pushpa 2: The Rule",
    rating: 9.2,
    votes: "251.4K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa-2-the-rule-et00356724-1737184762.jpg",
    genre: "Action, Drama",
    language: "Hindi, Telugu, Tamil",
    cert: "UA",
  },
  {
    id: "6a15ecd987c25a1316b784cc",
    title: "Son of Sardaar 2",
    rating: 8.8,
    votes: "110K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/son-of-sardaar-2-et00450471-1754122330.jpg",
    genre: "Action, Drama, Comedy",
    language: "Telugu, Hindi",
    cert: "U",
  },
  {
    id: "6a15ecd987c25a1316b784cd",
    title: "KGF: Chapter 2",
    rating: 9.4,
    votes: "380K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kgf-chapter-2-et00098647-08-04-2022-11-33-32.jpg",
    genre: "Action, Thriller",
    language: "Kannada, Hindi, Telugu",
    cert: "UA",
  },
  {
    id: "6a15ecd987c25a1316b784ce",
    title: "RRR",
    rating: 9.5,
    votes: "420K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/rrr-et00094579-1700135873.jpg",
    genre: "Action, Drama",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
  },
  {
    id: "6a15ecd987c25a1316b784cf",
    title: "Salaar",
    rating: 8.9,
    votes: "190K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/salaar-cease-fire--part-1-et00301886-1702971289.jpg",
    genre: "Action, Thriller",
    language: "Telugu, Kannada, Hindi",
    cert: "UA16+",
  },
  {
    id: "6a15ecd987c25a1316b784d0",
    title: "Project Hail Mary",
    rating: 9.6,
    votes: "450K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/project-hail-mary-et00451760-1751358286.jpg",
    genre: "Action, Fantasy, Drama",
    language: "Telugu, Tamil, Hindi",
    cert: "UA",
  },
  {
    id: "6a15ecd987c25a1316b784d1",
    title: "Chand Mera Dil",
    rating: 8.7,
    votes: "95K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/chand-mera-dil-et00484700-1778492742.jpg",
    genre: "Action, Drama",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
  },
  {
    id: "6a15ecd987c25a1316b784d2",
    title: "Kalki 2898 AD",
    rating: 9.1,
    votes: "310K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kalki-2898-ad-et00352941-1718275859.jpg",
    genre: "Action, Sci-Fi",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
  },
  {
    id: "6a15ecd987c25a1316b784d3",
    title: "Star Wars: The Mandalorian and Grogu",
    rating: 8.5,
    votes: "1.9K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/star-wars-the-mandalorian-and-grogu-et00499642-1778916322.jpg",
    genre: "Action, Sci-Fi",
    language: "English, Hindi",
    cert: "UA16+",
  },
  {
    id: "6a15ecd987c25a1316b784d4",
    title: "Drishyam 3",
    rating: 8.4,
    votes: "64.4K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/drishyam-3-malayalam-et00487295-1771314145.jpg",
    genre: "Thriller, Drama",
    language: "Malayalam, Telugu",
    cert: "UA16+",
  },
  {
    id: "6a15ecd987c25a1316b784d5",
    title: "Krishnavataram Part 1: The Heart",
    rating: 9.1,
    votes: "25.1K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/krishnavataram-part-1-the-heart-et00495498-1779699659.jpg",
    genre: "Devotional, Drama",
    language: "Hindi, Telugu",
    cert: "U",
  },
  {
    id: "6a15ecd987c25a1316b784d8",
    title: "Pati Patni Aur Woh 2",
    rating: 8.1,
    votes: "10.3K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pati-patni-aur-woh-do-et00485890-1777898323.jpg",
    genre: "Comedy, Romance",
    language: "Hindi",
    cert: "UA16+",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// OMDB INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────

const OMDB_IMDB_IDS: string[] = [
  "tt16539454", // Pushpa: The Rule - Part 2
  "tt21615164", // RRR (2022)
  "tt12735488", // Kalki 2898 AD
  "tt13927994", // Salaar
  "tt27510174", // Stree 2
  "tt12844910", // Pathaan
  "tt15501640", // Drishyam 2
  "tt23849204", // 12th Fail
  "tt15354916", // Jawan
  "tt18411490", // Tiger 3
  "tt1394313",  // Brahmastra
  "tt1745960",  // Top Gun: Maverick
  "tt10872600", // Spider-Man: No Way Home
  "tt9114286",  // Black Panther: Wakanda Forever
  "tt15398776", // Oppenheimer
  "tt0816692",  // Interstellar
  "tt1375666",  // Inception
  "tt0468569",  // The Dark Knight
  "tt4154796",  // Avengers: Endgame
  "tt6751668",  // Parasite
];

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
    id:       data.imdbID,
    title:    data.Title,
    posterUrl: data.Poster !== "N/A" ? data.Poster : null,
    rating:   isNaN(rating) ? null : rating,
    votes:    data.imdbVotes !== "N/A" ? formatVotes(data.imdbVotes) : null,
    genre:    data.Genre    !== "N/A" ? data.Genre    : null,
    language: data.Language !== "N/A" ? data.Language : null,
    cert:     data.Rated    !== "N/A" ? data.Rated    : null,
  };
}

export async function fetchMoviesFromOmdb(): Promise<ApiMovie[]> {
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    console.warn("External API failed, falling back to local dummy data");
    return moviesList;
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

    if (movies.length === 0) throw new Error("OMDb returned 0 results");
    return movies;

  } catch (_err) {
    console.warn("External API failed, falling back to local dummy data");
    return moviesList;
  }
}