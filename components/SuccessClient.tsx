"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TicketCard from "./TicketCard";
import { toPng } from "html-to-image";

type SuccessClientProps = {
  booking: any;
};

export default function SuccessClient({ booking }: SuccessClientProps) {
  const router = useRouter();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(ticketRef.current, {
        backgroundColor: "#0d1117",
        pixelRatio: 2, 
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `MovieMatrix_Ticket_${booking.id.toUpperCase().substring(0, 8)}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to generate ticket image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center animate-in zoom-in-95 duration-500">
      
      {/* Confetti / Success Header */}
      <div className="relative w-full flex flex-col items-center mb-8">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl animate-bounce">🎉 🎊</div>
        
        <div className="w-20 h-20 bg-[#2ea043]/10 rounded-full flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-[#2ea043] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(46,160,67,0.4)]">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Booking Confirmed!</h1>
        <p className="text-slate-400 font-semibold tracking-wide">
          Booking ID: <span className="font-mono text-[#F5C518]">#{booking.id.toUpperCase().substring(0, 12)}</span>
        </p>
      </div>

      {/* Ticket Card Component */}
      <div className="w-full mb-8 p-4 bg-[#0d1117] rounded-3xl" ref={ticketRef}>
        <TicketCard booking={booking} hideCancelButton={true} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mb-4 px-4">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-3.5 bg-[#F5C518] hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-wider rounded-full transition-all shadow-[0_0_15px_rgba(245,197,24,0.3)] hover:scale-[1.02] disabled:opacity-70 disabled:cursor-wait"
        >
          {isDownloading ? "Downloading..." : "Download Ticket"}
        </button>
        <button 
          onClick={() => router.push("/tickets")}
          className="flex-1 py-3.5 bg-transparent border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 font-bold text-sm uppercase tracking-wider rounded-full transition-all hover:scale-[1.02]"
        >
          My Tickets
        </button>
      </div>

    </div>
  );
}
