import { Seat } from "./SeatGrid";
import Legend from "./Legend";

interface BookingSidebarProps {
  movieTitle: string;
  showTime: string | Date;
  selectedSeats: string[];
  selectedSeatDetails: Seat[];
  totalPrice: number;
  selectedTiersBreakdown: any;
  booking: boolean;
  handleBooking: () => void;
}

export default function BookingSidebar({ 
  movieTitle, 
  showTime, 
  selectedSeats, 
  selectedSeatDetails, 
  totalPrice, 
  selectedTiersBreakdown, 
  booking, 
  handleBooking 
}: BookingSidebarProps) {
  
  const formatShowTime = (time: string | Date) => {
    try {
      return new Date(time).toLocaleString("en-US", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    } catch { return String(time); }
  };

  const canBook = selectedSeats.length > 0 && !booking;
  
  const baseClasses = "w-full py-3 rounded-xl font-black text-xs shadow-md transition-all duration-150 select-none uppercase tracking-wider border";
  
  const activeClasses = "bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 border-amber-400/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-[0.98] cursor-pointer";
  
  const disabledClasses = "bg-slate-900/50 text-slate-600 border-slate-800/80 cursor-not-allowed shadow-none";

  const buttonClasses = `${baseClasses} ${canBook ? activeClasses : disabledClasses}`;

  return (
    <div className="w-full md:w-[350px] p-6 md:p-8 bg-slate-950/50 backdrop-blur-sm flex flex-col justify-between border-t md:border-t-0 border-slate-800/80">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-wide mb-1.5 select-none">{movieTitle}</h2>
          <p className="text-xs text-slate-400 font-semibold mb-6 select-none">{formatShowTime(showTime)}</p>
        </div>

        <div className="space-y-5 border-t border-slate-800/60 pt-5">
          {selectedSeats.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">Ticket Details</h3>
              {Object.entries(selectedTiersBreakdown).map(([tierName, count]: any) => {
                if (count === 0) return null;
                const tierPrice = tierName === "Bronze" ? 200 : tierName === "Silver" ? 300 : 500;
                return (
                  <div key={tierName} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300 font-medium select-none">{count} x {tierName}</span>
                    <span className="text-slate-200 font-bold">₹{count * tierPrice}</span>
                  </div>
                );
              })}
              
              <div className="pt-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 select-none">Selected Seats</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeatDetails.map((seat: Seat) => {
                    const t = seat.row <= "B" ? "Bronze" : seat.row <= "F" ? "Silver" : "Gold";
                    const badge = t === "Bronze" ? "bg-zinc-900/60 text-zinc-300 border-zinc-800" : t === "Silver" ? "bg-slate-900/60 text-slate-300 border-slate-800" : "bg-yellow-950/40 text-yellow-300 border-yellow-900/40";
                    return <span key={seat.id} className={`text-[9px] font-black px-2 py-0.5 rounded border select-none ${badge}`}>{seat.row}{seat.col}</span>;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 select-none">
              <p className="text-sm text-slate-500">No seats selected yet</p>
              <p className="text-[11px] text-slate-600 mt-1">Select seats on the left to start booking</p>
            </div>
          )}
          
          <div className="border-t border-slate-800/80 pt-4 mt-6 flex justify-between items-center">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest select-none">Total Amount</span>
            <span className="text-2xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">₹{totalPrice}</span>
          </div>
        </div>

        <button 
          disabled={!canBook} 
          onClick={handleBooking} 
          className={buttonClasses}
        >
          {booking ? "Booking..." : "Book Now"}
        </button>
      </div>

      <Legend />
    </div>
  );
}