import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import TicketCard from "@/components/TicketCard"; 

export default async function TicketsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: { 
      user: { email: session.user.email } 
    },
    select: {
      id: true,
      status: true,
      seats: true,
      totalPrice: true,
      createdAt: true,
      showtime: {
        select: { 
          datetime: true, 
          theaterScreen: true,
          movie: { select: { title: true, posterUrl: true, genre: true } }
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-950 py-12 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
       
        <div className="flex items-center gap-4 mb-10 border-b border-slate-800 pb-6">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <h1 className="text-3xl md:text-4xl font-black text-slate-100 tracking-wider">My Tickets</h1>
        </div>

       
        {bookings.length === 0 ? (
          <div className="text-center py-20 px-4 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700/50">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-300 mb-2">No tickets yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't booked any movies yet. Browse our selection and grab your seats now!</p>
            <Link 
              href="/"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black tracking-wider uppercase px-8 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <TicketCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}