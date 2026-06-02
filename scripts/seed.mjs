
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envPath = resolve(__dirname, "../.env");
const envContent = readFileSync(envPath, "utf8");

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;

  const key = trimmed.slice(0, eqIdx).trim();
  let val = trimmed.slice(eqIdx + 1).trim();

  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }

  process.env[key] = val;
}
const OMDB_API_KEY = process.env.OMDB_API_KEY;
if (!OMDB_API_KEY) {
  console.error("❌ OMDB_API_KEY not found in .env");
  process.exit(1);
}

const IMDB_IDS = JSON.parse(
  readFileSync(resolve(__dirname, "../lib/imdb-ids.json"), "utf8")
);

const SCREENS = ["Dolby Cinema", "IMAX"];

function formatVotes(raw) {
  const n = parseInt(raw.replace(/,/g, ""), 10);
  if (isNaN(n)) return raw;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

async function fetchMovieFromOmdb(imdbId) {
  const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ⚠️  HTTP ${res.status} for ${imdbId}`);
    return null;
  }

  const data = await res.json();
  if (data.Response === "False") {
    console.warn(`  ⚠️  No result for ${imdbId}: ${data.Error ?? "unknown error"}`);
    return null;
  }

  const rating = parseFloat(data.imdbRating);

return {
    title:    data.Title,
    posterUrl: data.Poster !== "N/A" ? data.Poster : null,
    rating:   isNaN(rating) ? null : rating,
    votes:    data.imdbVotes !== "N/A" ? formatVotes(data.imdbVotes) : null,
    genre:    data.Genre    !== "N/A" ? data.Genre    : null,
    language: data.Language !== "N/A" ? data.Language.split(",")[0].trim() : null,
    cert:     data.Rated    !== "N/A" ? data.Rated    : null,
  };
}

async function createShowtimesForMovie(prisma, movieId, idx) {
  const base = new Date();
  base.setDate(base.getDate() + 1 + (idx % 7));
  base.setHours(10 + (idx % 4) * 3, 0, 0, 0);

  for (let i = 0; i < SCREENS.length; i++) {
    const dt = new Date(base);
    dt.setHours(dt.getHours() + i * 3);

    await prisma.showtime.create({
      data: {
        datetime: dt,
        theaterScreen: SCREENS[i],
        movieId,
      },
    });
  }
}

const prisma = new PrismaClient();

async function main() {
  console.log(`\n🎬 Fetching ${IMDB_IDS.length} movies from OMDb...\n`);

  const fetched = await Promise.all(IMDB_IDS.map(fetchMovieFromOmdb));
  const movies = fetched.filter(Boolean);

  console.log(`✅ Fetched ${movies.length} / ${IMDB_IDS.length} movies\n`);

  if (movies.length === 0) {
    console.error("❌ No movies fetched — aborting to avoid wiping the database.");
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log("💾 Upserting movies into MongoDB...\n");

  let showtimesCreated = 0;
  const seeded = [];

  for (let idx = 0; idx < movies.length; idx++) {
    const movieData = movies[idx];
    const imdbId = IMDB_IDS[idx];

    const movie = await prisma.movie.upsert({
      where:  { imdbId },
      update: movieData,
      create: { ...movieData, imdbId },
    });

    const existingShowtimes = await prisma.showtime.findMany({
      where: { movieId: movie.id },
    });

    if (existingShowtimes.length === 0) {
      await createShowtimesForMovie(prisma, movie.id, idx);
      showtimesCreated += SCREENS.length;
      console.log(`  ✅ [${idx + 1}/${movies.length}] ${movieData.title} — created with ${SCREENS.length} showtimes`);
    } else {
      console.log(`  🔄 [${idx + 1}/${movies.length}] ${movieData.title} — updated (showtimes kept)`);
    }

    seeded.push(movieData.title);
  }

  console.log(`\n🎉 Done! Upserted ${seeded.length} movies, created ${showtimesCreated} new showtimes.\n`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});