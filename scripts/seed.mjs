import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SCREENS        = ["Dolby Cinema", "IMAX"];
const RETRY_LIMIT    = 3;
const RETRY_DELAY_MS = 500;

function loadEnv() {
  const envPath    = resolve(__dirname, "../.env");
  const envContent = readFileSync(envPath, "utf8");

  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val   = trimmed.slice(eqIdx + 1).trim();

    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    process.env[key] = val;
  }
}

function formatVotes(raw) {
  const n = parseInt(raw.replace(/,/g, ""), 10);
  if (isNaN(n)) return raw;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function isValidPosterUrl(url) {
  if (!url || url.trim() === "" || url === "N/A") return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

async function fetchMovieFromOmdb(imdbId, apiKey, attempt = 1) {
  const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`;

  let res;
  try {
    res = await fetch(url);
  } catch (networkErr) {
    if (attempt < RETRY_LIMIT) {
      console.warn(`  ⚠️  Network error for ${imdbId} (attempt ${attempt}), retrying…`);
      await sleep(RETRY_DELAY_MS * attempt);
      return fetchMovieFromOmdb(imdbId, apiKey, attempt + 1);
    }
    console.error(`  ❌ Network error for ${imdbId} after ${RETRY_LIMIT} attempts:`, networkErr.message);
    return null;
  }

  if (res.status === 401) {
    console.error("  ❌ Invalid OMDB API key — aborting.");
    process.exit(1);
  }

  if (!res.ok) {
    if (attempt < RETRY_LIMIT) {
      console.warn(`  ⚠️  HTTP ${res.status} for ${imdbId} (attempt ${attempt}), retrying…`);
      await sleep(RETRY_DELAY_MS * attempt);
      return fetchMovieFromOmdb(imdbId, apiKey, attempt + 1);
    }
    console.warn(`  ❌ HTTP ${res.status} for ${imdbId} — skipping after ${RETRY_LIMIT} attempts.`);
    return null;
  }

  const data = await res.json();

  if (data.Response === "False") {
    console.warn(`  ⚠️  No result for ${imdbId}: ${data.Error ?? "unknown error"} — skipping.`);
    return null;
  }

  if (!data.Type || data.Type !== "movie") {
    console.warn(
      `  ⚠️  Skipping ${imdbId} — type is "${data.Type ?? "unknown"}", only "movie" is allowed.`
    );
    return null;
  }
  const missing = [];
  if (!data.Title || data.Title === "N/A") missing.push("title");
  if (!data.Genre  || data.Genre  === "N/A") missing.push("genre");

  if (!isValidPosterUrl(data.Poster)) {
    missing.push("posterUrl (must be a valid http/https URL)");
  }

  if (missing.length > 0) {
    console.warn(
      `  ⚠️  Skipping ${imdbId} — missing required fields: ${missing.join(", ")}`
    );
    return null;
  }

  const rating = parseFloat(data.imdbRating);

  return {
    imdbId,
    title:     data.Title,
    posterUrl: data.Poster.trim(),
    rating:    isNaN(rating) ? null : rating,
    votes:     data.imdbVotes !== "N/A" ? formatVotes(data.imdbVotes) : null,
    genre:     data.Genre,
    language:  data.Language !== "N/A" ? data.Language.split(",")[0].trim() : null,
    cert:      data.Rated    !== "N/A" ? data.Rated    : null,
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
        datetime:      dt,
        theaterScreen: SCREENS[i],
        movieId,
      },
    });
  }
}

const prisma = new PrismaClient();

async function main() {
  loadEnv();

  const OMDB_API_KEY = process.env.OMDB_API_KEY;
  if (!OMDB_API_KEY) {
    console.error("❌ OMDB_API_KEY not found in .env");
    process.exit(1);
  }

  const IMDB_IDS = JSON.parse(
    readFileSync(resolve(__dirname, "../lib/imdb-ids.json"), "utf8")
  );

  if (!Array.isArray(IMDB_IDS) || IMDB_IDS.length === 0) {
    console.error("❌ imdb-ids.json is empty or invalid.");
    process.exit(1);
  }

  const existingMovies = await prisma.movie.findMany({
    select: { imdbId: true },
  });
  const existingIds = new Set(existingMovies.map((m) => m.imdbId));

  const newIds    = IMDB_IDS.filter((id) => !existingIds.has(id));
  const skippedExisting = IMDB_IDS.length - newIds.length;

  console.log(`\n📋 Total IDs in file     : ${IMDB_IDS.length}`);
  console.log(`✅ Already in DB (skip)  : ${skippedExisting}`);
  console.log(`🆕 New to fetch & insert : ${newIds.length}\n`);

  if (newIds.length === 0) {
    console.log("🎉 Nothing new to add — database is already up to date.");
    await prisma.$disconnect();
    return;
  }

  console.log(`🎬 Fetching ${newIds.length} new movies from OMDb…\n`);
  const results = await Promise.all(
    newIds.map((id) => fetchMovieFromOmdb(id, OMDB_API_KEY))
  );
  const fetchedMovies = results.filter(Boolean);

  console.log(
    `\n✅ Accepted ${fetchedMovies.length} / ${newIds.length} new movies` +
    ` (${newIds.length - fetchedMovies.length} skipped)\n`
  );

  if (fetchedMovies.length === 0) {
    console.log("⚠️  No valid new movies to insert — aborting.");
    await prisma.$disconnect();
    return;
  }

  console.log("💾 Writing to MongoDB…\n");

  let inserted         = 0;
  let showtimesCreated = 0;
  const dbErrors       = [];

  for (let idx = 0; idx < fetchedMovies.length; idx++) {
    const { imdbId, ...movieData } = fetchedMovies[idx];

    try {
      const movie = await prisma.movie.create({
        data: { ...movieData, imdbId },
      });

      await createShowtimesForMovie(prisma, movie.id, idx);
      showtimesCreated += SCREENS.length;

      console.log(
        `  ✅ [${idx + 1}/${fetchedMovies.length}] ${movieData.title}` +
        ` — inserted with ${SCREENS.length} showtimes`
      );
      inserted++;
    } catch (dbErr) {
      console.error(
        `  ❌ DB error for "${movieData.title}" (${imdbId}):`,
        dbErr.message
      );
      dbErrors.push(imdbId);
    }
  }

  console.log("\n─────────────────────────────────────────");
  console.log(`🎉 Seed complete!`);
  console.log(`   Already in DB (untouched) : ${skippedExisting}`);
  console.log(`   Newly inserted            : ${inserted}`);
  console.log(`   Showtimes created         : ${showtimesCreated}`);
  console.log(`   OMDb skipped (bad data)   : ${newIds.length - fetchedMovies.length}`);
  if (dbErrors.length > 0) {
    console.log(`   ⚠️  DB errors for         : ${dbErrors.join(", ")}`);
  }
  console.log("─────────────────────────────────────────\n");

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("❌ Seed failed:", e);
  await prisma.$disconnect();
  process.exit(1);
});
