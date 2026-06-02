import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchMoviesFromOmdb } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany();

    if (movies.length > 0) {
      return NextResponse.json(movies);
    }
    console.warn("[Movies] DB empty, falling back to OMDb...");
    const fallback = await fetchMoviesFromOmdb();

    if (fallback.length === 0) {
      return NextResponse.json(
        { error: "No movies available. Please try again later." },
        { status: 503 }
      );
    }
    return NextResponse.json(fallback);

  } catch (error) {
    console.error("[Movies] DB error:", error);
    const fallback = await fetchMoviesFromOmdb();

    if (fallback.length === 0) {
      return NextResponse.json(
        { error: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(fallback);
  }
}