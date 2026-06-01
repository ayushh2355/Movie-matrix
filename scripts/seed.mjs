// Direct seed script — runs outside Next.js to avoid HTTP timeouts
// Usage: node scripts/seed.mjs

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env manually ────────────────────────────────────────
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
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  process.env[key] = val;
}

const OMDB_API_KEY = process.env.OMDB_API_KEY;
if (!OMDB_API_KEY) {
  console.error("❌ OMDB_API_KEY not found in .env");
  process.exit(1);
}

// ── 20 verified IMDb IDs ──────────────────────────────────────
const IMDB_IDS = [
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

function formatVotes(votesStr) {
  const n = parseInt(votesStr.replace(/,/g, ""), 10);
  if (isNaN(n)) return votesStr;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

async function fetchOne(imdbId) {
  const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ⚠️  HTTP ${res.status} for ${imdbId}`);
    return null;
  }
  const data = await res.json();
  if (data.Response === "False") {
    console.warn(`  ⚠️  No result for ${imdbId}: ${data.Error ?? ""}`);
    return null;
  }
  const rating = parseFloat(data.imdbRating);
  return {
    title:     data.Title,
    posterUrl: data.Poster !== "N/A" ? data.Poster : null,
    rating:    isNaN(rating) ? null : rating,
    votes:     data.imdbVotes !== "N/A" ? formatVotes(data.imdbVotes) : null,
    genre:     data.Genre    !== "N/A" ? data.Genre    : null,
    language:  data.Language !== "N/A" ? data.Language : null,
    cert:      data.Rated    !== "N/A" ? data.Rated    : null,
  };
}

const prisma = new PrismaClient();

async function main() {
  console.log(`\n🎬 Fetching ${IMDB_IDS.length} movies from OMDb in parallel...\n`);

  const fetched = await Promise.all(IMDB_IDS.map(fetchOne));
  const movies = fetched.filter(Boolean);
  console.log(`✅ Fetched ${movies.length}/${IMDB_IDS.length} movies\n`);

  console.log("🗑️  Clearing old records...");
  await prisma.showtime.deleteMany({});
  await prisma.movie.deleteMany({});

  console.log("💾 Writing to MongoDB...\n");
  const screens = ["Dolby Cinema", "IMAX"];
  let showtimesCreated = 0;
  const seeded = [];

  for (let idx = 0; idx < movies.length; idx++) {
    const m = movies[idx];
    const base = new Date();
    base.setDate(base.getDate() + 1 + (idx % 7));
    base.setHours(10 + (idx % 4) * 3, 0, 0, 0);

    const created = await prisma.movie.create({ data: m });

    for (let i = 0; i < screens.length; i++) {
      const dt = new Date(base);
      dt.setHours(dt.getHours() + i * 3);
      await prisma.showtime.create({
        data: { datetime: dt, theaterScreen: screens[i], movieId: created.id },
      });
      showtimesCreated++;
    }

    console.log(`  ✅ [${idx + 1}/${movies.length}] ${m.title}`);
    seeded.push(m.title);
  }

  console.log(`\n🎉 Done! Seeded ${seeded.length} movies & ${showtimesCreated} showtimes.\n`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
