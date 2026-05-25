import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
  try {
    // 1. Find Pushpa 2 in the database to get its exact ID
    const movie = await prisma.movie.findFirst({
      where: { 
        title: "Pushpa 2" 
      }
    });

    if (!movie) {
      return NextResponse.json({ error: "Could not find Pushpa 2 in the database!" }, { status: 404 });
    }

    // 2. Define the theater dimensions (5 Rows, 10 Columns)
    const rows = ["A", "B", "C", "D", "E"];
   const seatsToInsert: any[] = [];

    for (const row of rows) {
      for (let col = 1; col <= 10; col++) {
        seatsToInsert.push({
          row: row,
          col: col,
          status: "AVAILABLE",
          movieId: movie.id, // Linking the seat to Pushpa 2
        });
      }
    }

    // 3. Batch insert all 50 seats into MongoDB at once
    const result = await prisma.seat.createMany({
      data: seatsToInsert,
    });

    return NextResponse.json({ 
      message: "Success! Theater grid generated.", 
      seatsCreated: result.count 
    });

  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: "Failed to generate seats" }, { status: 500 });
  }
}