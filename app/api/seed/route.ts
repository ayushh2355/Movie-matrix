import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const moviesToSeed = [
  {
    id: "6a15ecd987c25a1316b784cb",
    title: "Pushpa 2: The Rule",
    rating: 9.2,
    votes: "251.4K",
    posterUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500",
    genre: "Action, Drama",
    language: "Hindi, Telugu, Tamil",
    cert: "UA",
    showTime: new Date("2026-05-25T23:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784cc",
    title: "Son of Satyamurthy",
    rating: 8.8,
    votes: "110K",
    posterUrl: "https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?q=80&w=500",
    genre: "Action, Drama, Comedy",
    language: "Telugu, Hindi",
    cert: "U",
    showTime: new Date("2026-05-26T12:00:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784cd",
    title: "KGF: Chapter 2",
    rating: 9.4,
    votes: "380K",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500",
    genre: "Action, Thriller",
    language: "Kannada, Hindi, Telugu",
    cert: "UA",
    showTime: new Date("2026-05-26T15:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784ce",
    title: "RRR",
    rating: 9.5,
    votes: "420K",
    posterUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=500",
    genre: "Action, Drama",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
    showTime: new Date("2026-05-26T19:00:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784cf",
    title: "Salaar",
    rating: 8.9,
    votes: "190K",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=500",
    genre: "Action, Thriller",
    language: "Telugu, Kannada, Hindi",
    cert: "UA16+",
    showTime: new Date("2026-05-27T16:00:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d0",
    title: "Baahubali 2",
    rating: 9.6,
    votes: "450K",
    posterUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=500",
    genre: "Action, Fantasy, Drama",
    language: "Telugu, Tamil, Hindi",
    cert: "UA",
    showTime: new Date("2026-05-27T19:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d1",
    title: "Devara",
    rating: 8.7,
    votes: "95K",
    posterUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=500",
    genre: "Action, Drama",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
    showTime: new Date("2026-05-28T14:45:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d2",
    title: "Kalki 2898 AD",
    rating: 9.1,
    votes: "310K",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500",
    genre: "Action, Sci-Fi",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
    showTime: new Date("2026-05-28T18:00:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d3",
    title: "Star Wars: The Mandalorian and Grogu",
    rating: 8.5,
    votes: "1.9K",
    posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=500",
    genre: "Action, Sci-Fi",
    language: "English, Hindi",
    cert: "UA16+",
    showTime: new Date("2026-05-28T21:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d4",
    title: "Drishyam 3",
    rating: 8.4,
    votes: "64.4K",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=500",
    genre: "Thriller, Drama",
    language: "Malayalam, Telugu",
    cert: "UA16+",
    showTime: new Date("2026-05-29T14:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d5",
    title: "Krishnavataram Part 1: The Heart",
    rating: 9.1,
    votes: "25.1K",
    posterUrl: "https://images.unsplash.com/photo-1608976328267-e673d3ec06ce?q=80&w=500",
    genre: "Devotional, Drama",
    language: "Hindi, Telugu",
    cert: "U",
    showTime: new Date("2026-05-29T18:00:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d6",
    title: "Mayaru Bhauji 2",
    rating: 8.9,
    votes: "12.2K",
    posterUrl: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=500",
    genre: "Family, Drama",
    language: "Chattisgarhi",
    cert: "U",
    showTime: new Date("2026-05-30T13:15:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d7",
    title: "Bhooth Bangla",
    rating: 8.2,
    votes: "5.5K",
    posterUrl: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?q=80&w=500",
    genre: "Comedy, Horror",
    language: "Hindi",
    cert: "UA16+",
    showTime: new Date("2026-05-30T21:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d8",
    title: "Pati Patni Aur Woh 2",
    rating: 8.1,
    votes: "10.3K",
    posterUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500",
    genre: "Comedy, Romance",
    language: "Hindi",
    cert: "UA16+",
    showTime: new Date("2026-05-31T16:45:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d9",
    title: "Pre Historic Adventure",
    rating: 8.0,
    votes: "1.2K",
    posterUrl: "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?q=80&w=500",
    genre: "Adventure",
    language: "English",
    cert: "U",
    showTime: new Date("2026-05-31T12:00:00.000Z"),
  },
];

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

export async function GET() {
  try {
    // 1. Delete all existing seats and movies
    await prisma.seat.deleteMany({});
    await prisma.movie.deleteMany({});

    let totalSeatsCreated = 0;

    // 2. Loop through each movie, insert it, and insert its seats
    for (const movieData of moviesToSeed) {
      const createdMovie = await prisma.movie.create({
        data: movieData,
      });

      const seatsToInsert: any[] = [];
      for (const row of rows) {
        for (let col = 1; col <= 10; col++) {
          seatsToInsert.push({
            row,
            col,
            status: "AVAILABLE",
            movieId: createdMovie.id,
          });
        }
      }

      const result = await prisma.seat.createMany({
        data: seatsToInsert,
      });

      totalSeatsCreated += result.count;
    }

    return NextResponse.json({
      message: "Success! Seeded 15 movies and their seat layouts.",
      moviesSeeded: moviesToSeed.length,
      seatsCreated: totalSeatsCreated,
    });
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to generate movies and seats" }, { status: 500 });
  }
}