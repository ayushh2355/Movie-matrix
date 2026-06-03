import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { showtime: true },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (existingBooking.userId !== session.user.id) {
      return NextResponse.json({ error: "You do not have permission to cancel this booking." }, { status: 403 });
    }

    if (existingBooking.status === "CANCELLED") {
      return NextResponse.json({ error: "Booking is already cancelled." }, { status: 400 });
    }

    const showtimeDate = new Date(existingBooking.showtime.datetime);
    const thirtyMinsBefore = new Date(showtimeDate.getTime() - 30 * 60000);
    
    if (new Date() >= thirtyMinsBefore) {
      return NextResponse.json({ error: "Cancellations are only allowed up to 30 minutes before showtime." }, { status: 400 });
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, booking: cancelledBooking }, { status: 200 });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}
