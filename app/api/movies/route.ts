import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchMoviesFromOmdb } from "@/lib/data";

export const dynamic = "force-dynamic";

const DB_TIMEOUT_MS = 5000;

export async function GET() {
  try {
    
    const movies = await Promise.race([
      prisma.movie.findMany(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`DB timeout after ${DB_TIMEOUT_MS}ms`)),
          DB_TIMEOUT_MS
        )
      ),
    ]);

    return NextResponse.json(movies);

  } catch (error) {
    console.warn("External API failed, falling back to local dummy data", error);

    const fallbackMovies = await fetchMoviesFromOmdb();
    return NextResponse.json(fallbackMovies);
  }
}