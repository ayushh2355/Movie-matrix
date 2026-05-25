import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
   
    const body = await req.json();
    const { seatIds } = body;

    if (!seatIds || seatIds.length === 0) {
      return NextResponse.json({ error: "No seats selected" }, { status: 400 });
    }

    await prisma.seat.updateMany({
      where: {
        id: {
          in: seatIds, 
        },
      },
      data: {
        status: "BOOKED",
      },
    });

    return NextResponse.json({ message: "Booking successful!" }, { status: 200 });

  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Failed to book seats" }, { status: 500 });
  }
}