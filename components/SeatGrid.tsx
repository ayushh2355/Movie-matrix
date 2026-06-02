"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Screen from "@/components/Screen";
import SeatButton from "@/components/SeatButton";
import BookingSidebar from "@/components/BookingSidebar";

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
  const [booking, setBooking] = useState(false);

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
        body: JSON.stringify({ seatIds: selectedSeats, showtimeId, totalPrice }),
      });

      if (res.ok) {
        toast.success("Booking Successful!");
        setSelectedSeats([]);
        router.refresh();
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch {
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

        {/* Seat Map */}
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

        {/* Booking Sidebar */}
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