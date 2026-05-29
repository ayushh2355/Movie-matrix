import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { seatIds, showtimeId, totalPrice } = body;

    if (!seatIds || seatIds.length === 0 || !showtimeId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        showtimeId,
        seats: seatIds,
        totalPrice: totalPrice || 0,
      },
    });

    return NextResponse.json({ message: "Booking successful!", booking }, { status: 200 });

  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Failed to book seats" }, { status: 500 });
  }
}