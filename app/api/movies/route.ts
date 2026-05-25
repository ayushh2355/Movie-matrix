import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const movies = await prisma.movie.findMany();
    return NextResponse.json(movies);
  } catch (error) {
    console.log("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
  
}