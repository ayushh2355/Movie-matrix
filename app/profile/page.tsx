import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    where: { user: { email: session.user.email } },
    select: { seats: true, totalPrice: true, status: true, createdAt: true }
  });

  const transactions = bookings.length;
  const ticketsBooked = bookings.reduce((sum, b) => sum + (b.status !== "CANCELLED" ? b.seats.length : 0), 0);
  const totalSpent = bookings.reduce((sum, b) => sum + (b.status !== "CANCELLED" ? (b.totalPrice || 0) : 0), 0);
  
  let statusTier = "Member";
  if (ticketsBooked > 20) statusTier = "Superfan";
  else if (ticketsBooked > 10) statusTier = "Gold";
  else if (ticketsBooked > 5) statusTier = "Silver";

  const memberSince = "MAY 2026"; 

  const initials = session.user.name?.charAt(0).toUpperCase() || session.user.email.charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#070b14] py-12 md:py-20 px-4 md:px-8 font-sans text-slate-100 selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-teal-500 flex items-center justify-center text-5xl md:text-6xl font-black text-slate-50 shadow-2xl shrink-0">
            {initials}
          </div>
          <div className="text-center md:text-left pt-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-wide mb-2">
              {session.user.name || "Movie Matrix User"}
            </h1>
            <p className="text-amber-500 font-bold mb-4">{session.user.email}</p>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              MEMBER SINCE {memberSince}
            </p>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 flex flex-col shadow-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div className="text-3xl font-black text-slate-100">{transactions}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">TRANSACTIONS</div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 flex flex-col shadow-lg">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            </div>
            <div className="text-3xl font-black text-slate-100">{ticketsBooked}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">TICKETS BOOKED</div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 flex flex-col shadow-lg">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="text-3xl font-black text-slate-100">₹{totalSpent}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">TOTAL SPENT</div>
          </div>

          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-6 flex flex-col shadow-lg">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div className="text-3xl font-black text-slate-100">{statusTier}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">STATUS TIER</div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="bg-[#0b1120] border border-[#1e293b] rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-8">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                FULL NAME
              </label>
              <input 
                type="text" 
                defaultValue={session.user.name || "Movie Matrix User"}
                className="bg-[#111827] border border-[#1f2937] text-slate-300 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none focus:border-amber-500 transition-colors w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                EMAIL ADDRESS
              </label>
              <input 
                type="text" 
                readOnly
                disabled
                defaultValue={session.user.email || ""}
                className="bg-[#111827] border border-[#1f2937] text-slate-400 text-sm font-semibold rounded-xl px-4 py-3.5 focus:outline-none w-full opacity-80 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-500 ml-1">Email address cannot be changed.</span>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-[#1e293b]">
            <button className="bg-[#1e293b] hover:bg-[#334155] text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all">
              SAVE CHANGES
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
