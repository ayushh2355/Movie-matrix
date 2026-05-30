import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { moviesList } from "@/lib/data";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {

    await prisma.showtime.deleteMany({});
    await prisma.movie.deleteMany({});

    let totalShowtimesCreated = 0;

    
    for (const movieData of moviesList) {
      const { showTime, ...movieFields } = movieData;
      const createdMovie = await prisma.movie.create({
        data: movieFields,
      });

      const baseShowTime = new Date(showTime);
      const screens = ["Dolby Cinema", "IMAX"];
      
      for (let i = 0; i < screens.length; i++) {
        const currentShowTime = new Date(baseShowTime);
        currentShowTime.setHours(currentShowTime.getHours() + (i * 3));

        await prisma.showtime.create({
          data: {
            datetime: currentShowTime,
            theaterScreen: screens[i],
            movieId: createdMovie.id
          }
        });
        totalShowtimesCreated += 1;
      }
    }

    return NextResponse.json({
      message: "Success! Seeded " + moviesList.length + " movies and their showtimes.",
      moviesSeeded: moviesList.length,
      showtimesCreated: totalShowtimesCreated,
    });
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to generate movies and showtimes" }, { status: 500 });
  }
}
