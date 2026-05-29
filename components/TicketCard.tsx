import CancelTicketButton from "./CancelTicketButton";

interface TicketCardProps {
  booking: {
    id: string;
    status: string;
    seats: string[];
    totalPrice: number | null;
    createdAt: Date;
    showtime: { 
      datetime: Date; 
      theaterScreen: string | null;
      movie: { title: string; posterUrl: string | null; genre: string | null };
    } | null;
  };
}

export default function TicketCard({ booking }: TicketCardProps) {
  const isCancelled = booking.status === "CANCELLED";

  return (
    <div className={`relative flex flex-col md:flex-row bg-slate-900/80 rounded-2xl md:rounded-3xl border ${isCancelled ? 'border-slate-800/40 opacity-70' : 'border-slate-800/80'} overflow-hidden shadow-2xl group transition-all`}>
      
      <div className="w-full md:w-48 h-64 md:h-auto shrink-0 relative bg-slate-950 border-b md:border-b-0 md:border-r border-dashed border-slate-700">
        {booking.showtime?.movie.posterUrl ? (
          <img 
            src={booking.showtime.movie.posterUrl} 
            alt={booking.showtime.movie.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isCancelled ? 'grayscale opacity-50' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-600">No Image</div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:to-slate-900/90" />
      </div>

      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className={`text-2xl md:text-3xl font-black tracking-wide line-clamp-2 ${isCancelled ? 'text-slate-400 line-through decoration-rose-500/50' : 'text-slate-100'}`}>
              {booking.showtime?.movie.title || "Unknown Movie"}
            </h2>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shrink-0 ml-4 border ${isCancelled ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              {booking.status}
            </span>
          </div>
          <p className="text-sm font-semibold text-amber-500 mb-6">{booking.showtime?.movie.genre || "Feature Film"}</p>
          
          <div className={`grid grid-cols-2 gap-y-6 gap-x-4 ${isCancelled ? 'opacity-50' : ''}`}>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Date & Time</p>
              <p className="text-sm font-semibold text-slate-200">
                {booking.showtime ? new Date(booking.showtime.datetime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Screen</p>
              <p className="text-sm font-semibold text-slate-200">
                {booking.showtime?.theaterScreen || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Seats ({booking.seats.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {booking.seats.map(seat => (
                  <span key={seat} className={`border text-xs font-bold px-2 py-0.5 rounded ${isCancelled ? 'bg-slate-900 border-slate-800 text-slate-500 line-through' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                    {seat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Amount Paid</p>
              <p className="text-sm font-bold text-slate-200">₹{booking.totalPrice}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-slate-600 font-medium tracking-widest">
              BOOKING ID: {booking.id.toUpperCase().substring(0, 12)}
            </p>
            <p className="text-[10px] text-slate-600 font-medium">
              Booked on {new Date(booking.createdAt).toLocaleDateString()}
            </p>
          </div>
          {!isCancelled && <CancelTicketButton bookingId={booking.id} />}
        </div>
      </div>

      <div className="absolute hidden md:block w-8 h-8 bg-slate-950 rounded-full -top-4 left-44 border-b border-slate-800" />
      <div className="absolute hidden md:block w-8 h-8 bg-slate-950 rounded-full -bottom-4 left-44 border-t border-slate-800" />

      <div className="hidden md:flex w-24 shrink-0 border-l border-dashed border-slate-700/80 items-center justify-center bg-slate-900 relative">
        <div className="h-4/5 w-12 flex flex-col justify-between items-center opacity-30">
          <div className="w-full h-1 bg-slate-400"></div><div className="w-full h-3 bg-slate-400"></div><div className="w-full h-0.5 bg-slate-400"></div>
          <div className="w-full h-2 bg-slate-400"></div><div className="w-full h-5 bg-slate-400"></div><div className="w-full h-1 bg-slate-400"></div>
          <div className="w-full h-0.5 bg-slate-400"></div><div className="w-full h-4 bg-slate-400"></div><div className="w-full h-2 bg-slate-400"></div>
          <div className="w-full h-0.5 bg-slate-400"></div><div className="w-full h-3 bg-slate-400"></div><div className="w-full h-1 bg-slate-400"></div>
          <div className="w-full h-4 bg-slate-400"></div><div className="w-full h-0.5 bg-slate-400"></div><div className="w-full h-2 bg-slate-400"></div>
        </div>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[8px] tracking-[0.3em] font-mono text-slate-600 font-bold whitespace-nowrap">
          VALID ADMISSION
        </span>
      </div>
    </div>
  );
}