"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export type Seat = {
  id: string;
  row: string;
  col: number;
  status: string;
};

type SeatGridProps = {
  seats: Seat[];
  movieTitle: string;
  showTime: Date | string;
};


export default function SeatGrid({ seats, movieTitle, showTime }: SeatGridProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [booking, setBooking] = useState(false);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };


  const groupedSeats: { [key: string]: Seat[] } = {};
  seats.forEach((seat) => {
    if (!groupedSeats[seat.row]) groupedSeats[seat.row] = [];
    groupedSeats[seat.row].push(seat);
  });

  const selectedSeatDetails = seats.filter((s) => selectedSeats.includes(s.id));
  
  const getSeatPrice = (row: string) => {
    const r = row.toUpperCase();
    if (r === "A" || r === "B") return 200;
    if (r === "C" || r === "D" || r === "E" || r === "F") return 300;
    return 500;
  };

  const totalPrice = selectedSeatDetails.reduce((sum, seat) => sum + getSeatPrice(seat.row), 0);

  const selectedTiersBreakdown = { Bronze: 0, Silver: 0, Gold: 0 };
  selectedSeatDetails.forEach((seat) => {
    const r = seat.row.toUpperCase();
    if (r === "A" || r === "B") selectedTiersBreakdown.Bronze += 1;
    else if (r === "C" || r === "D" || r === "E" || r === "F") selectedTiersBreakdown.Silver += 1;
    else selectedTiersBreakdown.Gold += 1;
  });

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    setBooking(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatIds: selectedSeats }),
      });

      if (res.ok) {
        toast.success("Booking Successful!");
        setSelectedSeats([]);
        router.refresh();
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  const tiers = [
    { name: "Bronze", price: 200, rows: ["A", "B"], badgeColor: "bg-zinc-900/90 text-zinc-300 border-zinc-700/60", seatBg: "bg-zinc-800/40 border-zinc-700/40 text-zinc-300 hover:bg-zinc-500 hover:text-white" },
    { name: "Silver", price: 300, rows: ["C", "D", "E", "F"], badgeColor: "bg-slate-900/90 text-slate-300 border-slate-700/60", seatBg: "bg-slate-800/40 border-slate-700/40 text-slate-300 hover:bg-slate-500 hover:text-white" },
    { name: "Gold", price: 500, rows: ["G", "H"], badgeColor: "bg-yellow-950/80 text-yellow-400 border-yellow-800/60", seatBg: "bg-yellow-950/30 border-yellow-900/40 text-yellow-300/80 hover:bg-yellow-600 hover:text-white" },
  ];

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[580px]">
        
       
        <div className="flex-1 p-6 md:p-8 flex flex-col items-center justify-between">
          <Screen />

          <div className="w-full max-w-md space-y-8 mb-6">
            {tiers.map((tier) => {
              const hasSeatsInTier = tier.rows.some((rowKey) => groupedSeats[rowKey]?.length > 0);
              if (!hasSeatsInTier) return null;

              return (
                <div key={tier.name} className="w-full">
                  <div className="w-full py-1.5 px-4 mb-4 rounded-lg bg-linear-to-r from-slate-900 to-slate-900/40 border border-slate-800/70 flex items-center justify-between select-none">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${tier.badgeColor}`}>
                      {tier.name}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">₹{tier.price} / seat</span>
                  </div>

                  <div className="space-y-3.5">
                    {tier.rows.map((rowKey) => {
                      const rowSeats = groupedSeats[rowKey] || [];
                      if (rowSeats.length === 0) return null;
                      const sortedSeats = [...rowSeats].sort((a, b) => a.col - b.col);

                      return (
                        <div key={rowKey} className="flex items-center gap-4">
                          <div className="w-5 font-black text-slate-500 text-xs text-center select-none">{rowKey}</div>
                          <div className="flex-1 grid grid-cols-11 gap-1.5">
                            {Array.from({ length: 11 }, (_, i) => i + 1).map((colIndex) => {
                              if (colIndex === 6) return <div key={`aisle-${rowKey}`} className="w-full aspect-square pointer-events-none" />;
                              
                              const seatCol = colIndex < 6 ? colIndex : colIndex - 1;
                              const seat = sortedSeats.find((s) => s.col === seatCol);
                              
                              if (!seat) return <div key={colIndex} className="w-full aspect-square opacity-0 pointer-events-none" />;
                              
                              return (
                                <SeatButton 
                                  key={seat.id} 
                                  seat={seat} 
                                  tier={tier} 
                                  isSelected={selectedSeats.includes(seat.id)} 
                                  onClick={() => toggleSeat(seat.id)} 
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden md:block w-px bg-slate-800/80 self-stretch" />

     
        <BookingSidebar 
          movieTitle={movieTitle}
          showTime={showTime}
          selectedSeats={selectedSeats}
          selectedSeatDetails={selectedSeatDetails}
          totalPrice={totalPrice}
          selectedTiersBreakdown={selectedTiersBreakdown}
          booking={booking}
          handleBooking={handleBooking}
        />
      </div>
    </div>
  );
}



function Screen() {
  return (
    <div className="w-full max-w-md flex flex-col items-center mb-10 relative">
      <div className="w-[85%] h-5 border-t-[3px] border-cyan-400/80 rounded-[100%] shadow-[0_-8px_16px_-4px_rgba(34,211,238,0.3)] relative flex items-center justify-center">
        <div className="absolute top-[3px] left-0 right-0 h-8 bg-linear-to-b from-cyan-500/10 to-transparent blur-md pointer-events-none" />
      </div>
      <span className="text-cyan-400 font-extrabold tracking-[0.25em] uppercase text-[10px] mt-2.5 select-none drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
        SCREEN
      </span>
    </div>
  );
}

function SeatButton({ seat, tier, isSelected, onClick }: { seat: Seat; tier: any; isSelected: boolean; onClick: () => void }) {
  const isBooked = seat.status !== "AVAILABLE";
  return (
    <button
      disabled={isBooked}
      onClick={onClick}
      title={`${seat.row}${seat.col} - ${tier.name} (₹${tier.price})`}
      className={`
        w-full aspect-square flex items-center justify-center rounded text-[10px] font-black transition-all duration-150 select-none border
        ${isBooked ? "bg-rose-950/40 text-rose-500/50 border-rose-950 cursor-not-allowed opacity-40 shadow-sm relative overflow-hidden"
          : isSelected ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-105"
          : tier.seatBg
        }
      `}
    >
      {seat.col}
    </button>
  );
}

function BookingSidebar({ movieTitle, showTime, selectedSeats, selectedSeatDetails, totalPrice, selectedTiersBreakdown, booking, handleBooking }: any) {
  const formatShowTime = (time: string | Date) => {
    try {
      return new Date(time).toLocaleString("en-US", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
    } catch { return String(time); }
  };

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

        <button disabled={selectedSeats.length === 0 || booking} onClick={handleBooking} className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition-all duration-150 select-none uppercase tracking-wider border ${selectedSeats.length > 0 && !booking ? "bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 border-amber-400/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-[0.98] cursor-pointer" : "bg-slate-900/50 text-slate-600 border-slate-800/80 cursor-not-allowed shadow-none"}`}>
          {booking ? "Booking..." : "Book Now"}
        </button>
      </div>

      <Legend />
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-8 pt-6 border-t border-slate-800/60 space-y-3">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest select-none mb-1.5">Seat Categories</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-zinc-800/40 border border-zinc-700/60 rounded" /><span className="text-[10px] font-semibold text-slate-400 select-none">Bronze (₹200)</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-slate-800/40 border border-slate-700/60 rounded" /><span className="text-[10px] font-semibold text-slate-400 select-none">Silver (₹300)</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-yellow-950/40 border border-yellow-900/60 rounded" /><span className="text-[10px] font-semibold text-slate-400 select-none">Gold (₹500)</span></div>
        <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 bg-rose-950/40 border border-rose-950/60 rounded opacity-60" /><span className="text-[10px] font-semibold text-slate-400 select-none">Sold Out</span></div>
        <div className="flex items-center gap-2 col-span-2"><div className="w-3.5 h-3.5 bg-emerald-500 border border-emerald-400 rounded shadow-[0_0_8px_rgba(16,185,129,0.35)]" /><span className="text-[10px] font-semibold text-slate-400 select-none">Selected Seat</span></div>
      </div>
    </div>
  );
}