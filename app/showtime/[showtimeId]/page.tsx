import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SeatGrid from "../../../components/SeatGrid";

type Props = {
  params: Promise<{ showtimeId: string }>;
};

export default async function ShowtimePage(props: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const { showtimeId } = await props.params;

  const showtime = await prisma.showtime.findUnique({
    where: { id: showtimeId },
    select: {
      id: true,
      datetime: true,
      movieId: true,
      movie: {
        select: { title: true } 
      },

      bookings: {
        where: { status: { not: "CANCELLED" } },
        select: { seats: true } 
      }
    }
  });

  if (!showtime) {
    notFound();
  }

  const bookedSeatIds = showtime.bookings.flatMap(b => b.seats);

  return (
    <main className="min-h-screen py-12 px-4 bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[120px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl w-full relative z-10">
        <SeatGrid 
          bookedSeatIds={bookedSeatIds} 
          movieTitle={showtime.movie.title} 
          showTime={showtime.datetime} 
          movieId={showtime.movieId}
          showtimeId={showtime.id}
        />
      </div>
    </main>
  );
}