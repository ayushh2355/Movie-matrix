type Props = {
  movieTitle: string;
  posterUrl: string;
  showTime: string;
  seats: string[];
  baseAmount: number;
  isProcessing: boolean;
  onPay: () => void;
};

const CONVENIENCE_FEE = 30;

function getTierForSeat(seat: string) {
  const row = seat.charAt(0).toUpperCase();
  if (row === "A" || row === "B") return "Bronze";
  if (["C", "D", "E", "F"].includes(row)) return "Silver";
  return "Gold";
}

export default function OrderSummary({
  movieTitle,
  posterUrl,
  showTime,
  seats,
  baseAmount,
  isProcessing,
  onPay,
}: Props) {
  const totalAmount = baseAmount + CONVENIENCE_FEE;
  const categories = [...new Set(seats.map(getTierForSeat))].join(", ");

  const showDate = new Date(showTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const showHour = new Date(showTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="w-full lg:w-2/5 bg-[#161b22] border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
      {/* movie header */}
      <div className="bg-[#0d1117] p-6 border-b border-[#21262d] flex gap-4 items-center">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movieTitle}
            className="w-16 h-24 object-cover rounded-lg shadow-md border border-[#21262d] shrink-0"
          />
        ) : (
          <div className="w-16 h-24 shrink-0 bg-[#161b22] rounded-lg border border-[#21262d] flex items-center justify-center text-xs text-slate-500">
            No Image
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg text-white mb-1 leading-tight">{movieTitle}</h3>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {showDate} • {showHour}
          </p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Booking Summary
        </h4>

        <div className="flex justify-between items-start text-sm">
          <span className="text-slate-300">Seats ({seats.length})</span>
          <span className="font-semibold text-white text-right max-w-[55%] leading-snug">
            {seats.join(", ")}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Category</span>
          <span className="font-semibold text-white">{categories}</span>
        </div>

        <div className="w-full h-px bg-[#21262d]" />

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Subtotal</span>
          <span className="font-semibold text-white">₹{baseAmount}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-300">Convenience Fee</span>
          <span className="font-semibold text-white">₹{CONVENIENCE_FEE}</span>
        </div>

        <div className="w-full h-px bg-[#21262d]" />

        <div className="flex justify-between items-center text-lg">
          <span className="font-bold text-white">Total Amount</span>
          <span className="font-black text-[#F5C518] text-2xl">₹{totalAmount}</span>
        </div>

        <div className="pt-6">
          <button
            onClick={onPay}
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-full font-black text-black text-sm uppercase tracking-wider transition-all shadow-lg ${
              isProcessing
                ? "bg-amber-600/50 cursor-wait text-black/50"
                : "bg-[#F5C518] hover:bg-yellow-400 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(245,197,24,0.4)]"
            }`}
          >
            {isProcessing ? "Processing..." : `Pay ₹${totalAmount}`}
          </button>
          <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-4 opacity-70">
            🔒 100% Secure Payment
          </p>
        </div>
      </div>
    </div>
  );
}
