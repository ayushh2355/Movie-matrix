"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Screen from "@/components/Screen";
import SeatButton from "@/components/SeatButton";
import BookingSidebar from "@/components/BookingSidebar";

export const TIER_PRICES: Record<string, number> = {
  Bronze: 200,
  Silver: 300,
  Gold: 500,
};

export type Seat = {
  id: string;
  row: string;
  col: number;
  status: string;
};

type SeatGridProps = {
  bookedSeatIds: string[];
  movieTitle: string;
  showTime: Date | string;
  movieId: string;
  showtimeId: string;
};

export default function SeatGrid({ bookedSeatIds, movieTitle, showTime, movieId, showtimeId }: SeatGridProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  for (const row of rows) {
    for (let col = 1; col <= 11; col++) {
      if (col === 6) continue;
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        row,
        col: col < 6 ? col : col - 1,
        status: bookedSeatIds.includes(seatId) ? "BOOKED" : "AVAILABLE"
      });
    }
  }

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
    if (r === "A" || r === "B") return TIER_PRICES.Bronze;
    if (r === "C" || r === "D" || r === "E" || r === "F") return TIER_PRICES.Silver;
    return TIER_PRICES.Gold;
  };

  const totalPrice = selectedSeatDetails.reduce((sum, seat) => sum + getSeatPrice(seat.row), 0);

  const selectedTiersBreakdown = { Bronze: 0, Silver: 0, Gold: 0 };
  selectedSeatDetails.forEach((seat) => {
    const r = seat.row.toUpperCase();
    if (r === "A" || r === "B") selectedTiersBreakdown.Bronze += 1;
    else if (r === "C" || r === "D" || r === "E" || r === "F") selectedTiersBreakdown.Silver += 1;
    else selectedTiersBreakdown.Gold += 1;
  });

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;
    setShowConfirmModal(true);
  };

  const tiers = [
    { name: "Bronze", price: TIER_PRICES.Bronze, rows: ["A", "B"], badgeColor: "bg-zinc-900/90 text-zinc-300 border-zinc-700/60", seatBg: "bg-zinc-800/40 border-zinc-700/40 text-zinc-300 hover:bg-zinc-500 hover:text-white" },
    { name: "Silver", price: TIER_PRICES.Silver, rows: ["C", "D", "E", "F"], badgeColor: "bg-slate-900/90 text-slate-300 border-slate-700/60", seatBg: "bg-slate-800/40 border-slate-700/40 text-slate-300 hover:bg-slate-500 hover:text-white" },
    { name: "Gold", price: TIER_PRICES.Gold, rows: ["G", "H"], badgeColor: "bg-yellow-950/80 text-yellow-400 border-yellow-800/60", seatBg: "bg-yellow-950/30 border-yellow-900/40 text-yellow-300/80 hover:bg-yellow-600 hover:text-white" },
  ];

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[580px]">

        {/* Seat Map */}
        <div className="flex-1 p-3 sm:p-6 md:p-8 flex flex-col items-center justify-between overflow-x-hidden">
          <Screen />

          <div className="w-full max-w-md overflow-x-auto pb-6 scrollbar-hide">
            <div className="min-w-[380px] sm:min-w-0 space-y-8 mb-6 px-1">
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
        </div>

        <div className="hidden md:block w-px bg-slate-800/80 self-stretch" />

        {/* Booking Sidebar */}
        <BookingSidebar
          movieTitle={movieTitle}
          showTime={showTime}
          selectedSeats={selectedSeats}
          selectedSeatDetails={selectedSeatDetails}
          totalPrice={totalPrice}
          selectedTiersBreakdown={selectedTiersBreakdown}
          handleBooking={handleBooking}
        />
      </div>

      {/* Confirm Booking Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-[#21262d] rounded-2xl w-full max-w-md p-6 shadow-2xl overflow-hidden relative">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Confirm Booking</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">{movieTitle}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(showTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {new Date(showTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">Selected Seats</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeatDetails.map(seat => (
                    <span key={seat.id} className="bg-amber-500/20 text-[#F5C518] border border-amber-500/30 px-2 py-0.5 rounded text-xs font-bold">
                      {seat.row}{seat.col}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Category</p>
                {Object.entries(selectedTiersBreakdown).map(([tierName, count]: any) => {
                  if (count === 0) return null;
                  const tierPrice = TIER_PRICES[tierName];
                  return (
                    <div key={tierName} className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">{count} x {tierName} (₹{tierPrice}/seat)</span>
                      <span className="text-slate-200 font-bold">₹{count * tierPrice}</span>
                    </div>
                  );
                })}
              </div>

              <div className="w-full h-px bg-slate-800/80 my-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-bold">Total Amount</span>
                <span className="text-2xl font-black text-[#F5C518]">₹{totalPrice}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button 
                onClick={() => {
                  router.push(`/payment?showtimeId=${showtimeId}&seats=${selectedSeats.join(",")}&amount=${totalPrice}`);
                }}
                className="w-full py-3 bg-[#F5C518] hover:bg-yellow-500 text-black font-bold rounded-full transition-colors"
              >
                Confirm & Pay
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-3 bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold rounded-full transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}