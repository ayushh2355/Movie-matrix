import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PaymentClient from "@/components/PaymentClient";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const { showtimeId, seats, amount } = await searchParams;

  if (!showtimeId || !seats || !amount) {
    redirect("/");
  }

  const showtime = await prisma.showtime.findUnique({
    where: { id: showtimeId as string },
    select: {
      id: true,
      datetime: true,
      movie: {
        select: { title: true, posterUrl: true }
      }
    }
  });

  if (!showtime) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-[#0d1117] text-slate-100 flex justify-center items-start">
      <PaymentClient 
        showtimeId={showtime.id}
        movieTitle={showtime.movie.title}
        posterUrl={showtime.movie.posterUrl || ""}
        showTime={showtime.datetime.toISOString()}
        seats={(seats as string).split(",")}
        baseAmount={parseInt(amount as string, 10)}
      />
    </main>
  );
}
