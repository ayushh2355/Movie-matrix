import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SuccessClient from "@/components/SuccessClient";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const { bookingId } = await searchParams;

  if (!bookingId) {
    redirect("/");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId as string },
    select: {
      id: true,
      status: true,
      seats: true,
      totalPrice: true,
      createdAt: true,
      user: { select: { email: true } },
      showtime: {
        select: {
          datetime: true,
          theaterScreen: true,
          movie: { select: { title: true, posterUrl: true, genre: true } }
        }
      }
    }
  });

  if (!booking || booking.user.email !== session.user.email) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4 bg-[#0d1117] text-slate-100 flex justify-center items-center">
      <SuccessClient booking={booking} />
    </main>
  );
}
