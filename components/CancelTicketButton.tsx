"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CancelTicketButtonProps {
  bookingId: string;
}

export default function CancelTicketButton({ bookingId }: CancelTicketButtonProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setIsCancelling(true);

    try {
      const res = await fetch("/api/book/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (res.ok) {
        toast.success("Booking cancelled successfully");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling");
    } finally {
      setIsCancelling(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <span className="text-xs text-rose-400 font-bold uppercase tracking-wider mr-2">Are you sure?</span>
        <button 
          onClick={handleCancel}
          disabled={isCancelling}
          className="bg-rose-500 hover:bg-rose-600 disabled:bg-slate-700 disabled:text-slate-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          {isCancelling ? "Cancelling..." : "Yes, Cancel"}
        </button>
        <button 
          onClick={() => setShowConfirm(false)}
          disabled={isCancelling}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowConfirm(true)}
      className="mt-4 md:mt-0 border border-slate-700 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-all cursor-pointer"
    >
      Cancel Ticket
    </button>
  );
}