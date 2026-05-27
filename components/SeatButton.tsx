import { Seat } from "./SeatGrid";

interface SeatButtonProps {
  seat: Seat;
  tier: any;
  isSelected: boolean;
  onClick: () => void;
}

export default function SeatButton({ seat, tier, isSelected, onClick }: SeatButtonProps) {
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