"use client";

import { useState } from "react";

type Seat = {
  id: string;
  row: string;
  col: number;
  status: string;
};

export default function SeatGrid({ seats }: { seats: Seat[] }) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter((id) => id !== seatId);
      return [...prev, seatId];
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200">
      <div className="grid grid-cols-10 gap-3">
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.id);

          return (
            <button
              key={seat.id}
              disabled={seat.status !== "AVAILABLE"}
              onClick={() => toggleSeat(seat.id)}
              className={`
                w-full aspect-square flex items-center justify-center rounded-t-lg text-xs font-bold transition-all duration-200
                ${
                  seat.status !== "AVAILABLE"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300" 
                    : isSelected
                    ? "bg-green-500 text-white border border-green-600 shadow-md transform scale-105" 
                    : "bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 cursor-pointer shadow-sm"
                }
              `}
            >
              {seat.row}{seat.col}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <div>
          <p className="text-gray-600 text-sm font-medium">Selected Seats:</p>
          <p className="text-lg font-bold text-black">
            {selectedSeats.length > 0 ? selectedSeats.length : "None"}
          </p>
        </div>
        
       <button 
  disabled={selectedSeats.length === 0}
  onClick={async () => {
  
    const res = await fetch("/api/book", {
      method: "POST",
      body: JSON.stringify({ seatIds: selectedSeats }),
    });

    if (res.ok) {
      alert("Booking Successful!");
      window.location.reload(); 
    } else {
      alert("Booking failed. Please try again.");
    }
  }}
  className={`px-8 py-3 rounded-lg font-bold transition-colors ${
    selectedSeats.length > 0 
    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
    : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  Confirm Booking
</button>
      </div>
    </div>
  );
}