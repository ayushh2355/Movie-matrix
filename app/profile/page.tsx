import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  // Fetch the user and their bookings to calculate stats
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: true,
    }
  });

  if (!user) {
    redirect("/");
  }

  // Calculate statistics
  const totalBookings = user.bookings.length;
  const totalTickets = user.bookings.reduce((sum, booking) => sum + booking.seats.length, 0);
  const totalSpent = user.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  
  // Format member since date
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen bg-slate-950 font-sans pb-20">
      
      {/* Profile Header Banner */}
      <div className="relative h-64 md:h-80 w-full bg-slate-900 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/20 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-slate-950 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Avatar & User Details */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 md:-mt-24 mb-12">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-950 overflow-hidden bg-slate-800 shadow-2xl shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name || "User"} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-300">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="text-center md:text-left pb-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide mb-1">{user.name || "Movie Buff"}</h1>
            <p className="text-sm md:text-base text-amber-500 font-semibold">{user.email}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide uppercase">Member since {memberSince}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-lg flex flex-col items-center md:items-start transition-all hover:bg-slate-800/50 hover:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="text-3xl font-black text-white mb-1">{totalBookings}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transactions</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-lg flex flex-col items-center md:items-start transition-all hover:bg-slate-800/50 hover:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-3xl font-black text-white mb-1">{totalTickets}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tickets Booked</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-lg flex flex-col items-center md:items-start transition-all hover:bg-slate-800/50 hover:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-black text-white mb-1">₹{totalSpent}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Spent</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-lg flex flex-col items-center md:items-start transition-all hover:bg-slate-800/50 hover:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-3xl font-black text-white mb-1">Superfan</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status Tier</p>
          </div>
        </div>

        {/* Settings Layout */}
        <div className="max-w-3xl mx-auto space-y-8">
            
            <ProfileForm user={{ name: user.name, email: user.email }} />

        </div>

      </div>
    </main>
  );
}
