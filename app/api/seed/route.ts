import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchMoviesFromOmdb } from "@/lib/data";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  // Create a fresh Prisma client to avoid stale Atlas M0 connections
  const { PrismaClient } = await import("@prisma/client");
  const db = new PrismaClient({ log: ["error"] });

  try {
    // 1. Connect and warm up the Atlas connection
    console.log("[Seed] Connecting to MongoDB...");
    await db.$connect();
    await db.movie.findFirst({ select: { id: true } }); // warm-up ping
    console.log("[Seed] Connection warm ✅");

    // 2. Fetch live data from OMDb (falls back to local moviesList if API fails)
    console.log("[Seed] Fetching movies from OMDb...");
    const movies = await fetchMoviesFromOmdb();
    console.log(`[Seed] Got ${movies.length} movies.`);

    if (movies.length === 0) {
      await db.$disconnect();
      return NextResponse.json(
        { error: "No movies returned. Check OMDB_API_KEY in .env." },
        { status: 500 }
      );
    }

    // 3. Clear old records one-by-one (MongoDB M0 free tier has no transactions)
    console.log("[Seed] Clearing old records...");
    const oldShowtimes = await db.showtime.findMany({ select: { id: true } });
    for (const s of oldShowtimes) {
      await db.showtime.delete({ where: { id: s.id } });
    }
    const oldMovies = await db.movie.findMany({ select: { id: true } });
    for (const m of oldMovies) {
      await db.movie.delete({ where: { id: m.id } });
    }

    // 4. Insert new movies + showtimes
    const screens = ["Dolby Cinema", "IMAX"];
    const seededTitles: string[] = [];
    let showtimesCreated = 0;

    for (let idx = 0; idx < movies.length; idx++) {
      const m = movies[idx];

      // Spread showtimes across the next 7 days with varied start times
      const base = new Date();
      base.setDate(base.getDate() + 1 + (idx % 7));
      base.setHours(10 + (idx % 4) * 3, 0, 0, 0); // 10:00 / 13:00 / 16:00 / 19:00

      const created = await db.movie.create({
        data: {
          title:     m.title,
          posterUrl: m.posterUrl,
          rating:    m.rating,
          votes:     m.votes,
          genre:     m.genre,
          language:  m.language,
          cert:      m.cert,
        },
      });

      for (let i = 0; i < screens.length; i++) {
        const dt = new Date(base);
        dt.setHours(dt.getHours() + i * 3);
        await db.showtime.create({
          data: { datetime: dt, theaterScreen: screens[i], movieId: created.id },
        });
        showtimesCreated++;
      }

      seededTitles.push(m.title);
      console.log(`[Seed] ✅ [${idx + 1}/${movies.length}] ${m.title}`);
    }

    await db.$disconnect();

    return NextResponse.json({
      message:          `Seeded ${seededTitles.length} movies from OMDb.`,
      moviesSeeded:     seededTitles.length,
      showtimesCreated,
      movies:           seededTitles,
    });

  } catch (error) {
    console.error("[Seed] Error:", error);
    await db.$disconnect().catch(() => {});
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
