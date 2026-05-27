import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import SeatGrid from "../../../components/SeatGrid"; 

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage(props: Props) {
  const { id } = await props.params;

  const movie = await prisma.movie.findUnique({
    where: { id: id },
    include: {
      seats: {
        orderBy: [
          { row: 'asc' },
          { col: 'asc' }
        ]
      }
    }
  });

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Ambient theater glow representing light from the screen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[120px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl w-full relative z-10">
        <SeatGrid 
          seats={movie.seats} 
          movieTitle={movie.title} 
          showTime={movie.showTime} 
        />
      </div>
    </main>
  );
}