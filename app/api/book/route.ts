import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const SEAT_CATEGORY_PRICES: Record<string, number> = {
  BRONZE: 200,
  SILVER: 300,
  GOLD:   500,
};

const ROW_TO_CATEGORY: Record<string, string> = {
  A: "BRONZE", B: "BRONZE",
  C: "SILVER", D: "SILVER", E: "SILVER", F: "SILVER",
  G: "GOLD",   H: "GOLD",
};

const MAX_SEATS_PER_BOOKING = 10;

function getSeatCategory(seatId: string): string | null {
  const row = seatId.charAt(0).toUpperCase();
  return ROW_TO_CATEGORY[row] ?? null;
}

function calculateTotalPrice(seatIds: string[]): number | null {
  let total = 0;
  for (const seatId of seatIds) {
    const category = getSeatCategory(seatId);
    if (!category) return null; 
    total += SEAT_CATEGORY_PRICES[category];
  }
  return total;
}

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
    const { seatIds, showtimeId } = body; 

    if (!showtimeId || typeof showtimeId !== "string") {
      return NextResponse.json(
        { error: "Invalid request: showtimeId is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(seatIds) || seatIds.length === 0 || seatIds.length > MAX_SEATS_PER_BOOKING) {
      return NextResponse.json(
        { error: `Invalid request: select between 1 and ${MAX_SEATS_PER_BOOKING} seats.` },
        { status: 400 }
      );
    }

    if (new Set(seatIds).size !== seatIds.length) {
      return NextResponse.json(
        { error: "Invalid request: duplicate seat IDs found." },
        { status: 400 }
      );
    }

    const seatRegex = /^[A-H]([1-9]|10|11)$/;
    if (!seatIds.every((id: unknown) => typeof id === "string" && seatRegex.test(id.trim()))) {
      return NextResponse.json(
        { error: "Invalid request: one or more seat IDs are invalid." },
        { status: 400 }
      );
    }
    const totalPrice = calculateTotalPrice(seatIds);
    if (totalPrice === null) {
      return NextResponse.json(
        { error: "Invalid seat ID: unrecognized row." },
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

    const booking = await prisma.$transaction(async (tx) => {
        const conflictingBooking = await tx.booking.findFirst({
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
          throw new Error(`SEATS_TAKEN:${takenSeats}`);
        }

        return tx.booking.create({
          data: {
            userId:     session.user.id,
            showtimeId,
            seats:      seatIds,
            totalPrice, 
          },
        });
      });

      return NextResponse.json(
        { message: "Booking confirmed!", booking },
        { status: 201 }
      );

  } catch (error) {
    if (error instanceof Error && error.message.startsWith("SEATS_TAKEN:")) {
      const takenSeats = error.message.split("SEATS_TAKEN:")[1];
      return NextResponse.json(
        { error: `Seats already booked: ${takenSeats}. Please choose different seats.` },
        { status: 409 }
      );
    }

    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}