import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const movies = await prisma.movie.findMany();
    return NextResponse.json(movies);
  } catch (error) {
    console.log("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
  
}