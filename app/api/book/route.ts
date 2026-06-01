import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
   
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to book seats." },
        { status: 401 }
      );
    }

    
    const body = await req.json();
    const { seatIds, showtimeId, totalPrice } = body;

    if (!showtimeId || typeof showtimeId !== "string") {
      return NextResponse.json(
        { error: "Invalid request: showtimeId is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: select at least one seat." },
        { status: 400 }
      );
    }

    if (typeof totalPrice !== "number" || totalPrice < 0) {
      return NextResponse.json(
        { error: "Invalid request: totalPrice must be a non-negative number." },
        { status: 400 }
      );
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      select: { id: true },
    });

    if (!showtime) {
      return NextResponse.json(
        { error: "Showtime not found." },
        { status: 404 }
      );
    }

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        showtimeId,
        seats: { hasSome: seatIds },
        status: "CONFIRMED",
      },
      select: { seats: true },
    });

    if (conflictingBooking) {
      const takenSeats = conflictingBooking.seats
        .filter((s: string) => seatIds.includes(s))
        .join(", ");
      return NextResponse.json(
        { error: `Seats already booked: ${takenSeats}. Please choose different seats.` },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        userId:     session.user.id,
        showtimeId,
        seats:      seatIds,
        totalPrice,
      },
    });

    return NextResponse.json(
      { message: "Booking confirmed!", booking },
      { status: 201 }
    );

  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}