"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type PaymentClientProps = {
  showtimeId: string;
  movieTitle: string;
  posterUrl: string;
  showTime: string;
  seats: string[];
  baseAmount: number;
};

export default function PaymentClient({ showtimeId, movieTitle, posterUrl, showTime, seats, baseAmount }: PaymentClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"UPI" | "CARD" | "NET_BANKING">("UPI");
  const [selectedUpi, setSelectedUpi] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const CONVENIENCE_FEE = 30;
  const totalAmount = baseAmount + CONVENIENCE_FEE;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatIds: seats, showtimeId, totalPrice: baseAmount }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Payment Successful!");
        const params = new URLSearchParams({
          bookingId: data.booking.id
        });
        router.push(`/success?${params.toString()}`);
      } else {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      }
    } catch {
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const getTierForSeat = (seat: string) => {
    const r = seat.charAt(0).toUpperCase();
    if (r === "A" || r === "B") return "Bronze";
    if (r === "C" || r === "D" || r === "E" || r === "F") return "Silver";
    return "Gold";
  };

  const categories = Array.from(new Set(seats.map(getTierForSeat))).join(", ");

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
      
      {/* Left Panel - Payment Methods (60%) */}
      <div className="w-full lg:w-3/5 bg-[#161b22] border border-[#21262d] rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6">Payment Options</h2>
        
        {/* Tabs */}
        <div className="flex bg-[#0d1117] rounded-full p-1 mb-8 border border-[#21262d]">
          {["UPI", "CARD", "NET_BANKING"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
                activeTab === tab
                  ? "bg-[#F5C518] text-black shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "UPI" ? "UPI" : tab === "CARD" ? "Credit/Debit Card" : "Net Banking"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[280px]">
          {activeTab === "UPI" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Enter UPI ID</label>
                <input 
                  type="text" 
                  placeholder="name@upi" 
                  className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-slate-600"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#21262d]" />
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">OR PAY USING</span>
                <div className="flex-1 h-px bg-[#21262d]" />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                  <button 
                    key={app} 
                    onClick={() => setSelectedUpi(app)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 bg-[#0d1117] border rounded-xl transition-colors group ${selectedUpi === app ? 'border-[#F5C518] bg-amber-500/10' : 'border-[#21262d] hover:border-[#F5C518]'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${selectedUpi === app ? 'bg-[#F5C518] border-[#F5C518] text-black' : 'bg-[#161b22] border-[#21262d] group-hover:bg-amber-500/10 text-slate-300 group-hover:text-[#F5C518]'}`}>
                      <span className="text-xs font-bold">{app[0]}</span>
                    </div>
                    <span className={`text-xs font-medium ${selectedUpi === app ? 'text-[#F5C518]' : 'text-slate-400'}`}>{app}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "CARD" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="XXXX XXXX XXXX XXXX" 
                    className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all font-mono tracking-widest placeholder:text-slate-600"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-6 h-4 bg-red-500 rounded-sm opacity-80" />
                    <div className="w-6 h-4 bg-orange-400 rounded-sm opacity-80 -ml-3 mix-blend-multiply" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">CVV</label>
                  <input 
                    type="password" 
                    placeholder="•••" 
                    className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all tracking-widest placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Cardholder Name</label>
                <input 
                  type="text" 
                  placeholder="Name on card" 
                  className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          {activeTab === "NET_BANKING" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Select Bank</label>
                <div className="grid grid-cols-2 gap-3">
                  {["SBI", "HDFC", "ICICI", "AXIS"].map(bank => (
                    <button 
                      key={bank} 
                      onClick={() => setSelectedBank(bank)}
                      className={`py-3 bg-[#0d1117] border rounded-xl text-sm font-semibold transition-colors ${selectedBank === bank ? 'border-[#F5C518] text-[#F5C518] bg-amber-500/10' : 'border-[#21262d] text-slate-300 hover:border-[#F5C518] hover:text-[#F5C518]'}`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Order Summary (40%) */}
      <div className="w-full lg:w-2/5 bg-[#161b22] border border-[#21262d] rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-[#0d1117] p-6 border-b border-[#21262d] flex gap-4 items-center">
          {posterUrl ? (
            <img src={posterUrl} alt={movieTitle} className="w-16 h-24 object-cover rounded-lg shadow-md border border-[#21262d]" />
          ) : (
            <div className="w-16 h-24 bg-[#161b22] rounded-lg border border-[#21262d] flex items-center justify-center text-xs text-slate-500">No Image</div>
          )}
          <div>
            <h3 className="font-bold text-lg text-white mb-1 leading-tight">{movieTitle}</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {new Date(showTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {new Date(showTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Booking Summary</h4>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Seats ({seats.length})</span>
            <span className="font-semibold text-white">{seats.join(", ")}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Category</span>
            <span className="font-semibold text-white">{categories}</span>
          </div>

          <div className="w-full h-px bg-[#21262d] my-2" />

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Subtotal</span>
            <span className="font-semibold text-white">₹{baseAmount}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-300">Convenience Fee</span>
            <span className="font-semibold text-white">₹{CONVENIENCE_FEE}</span>
          </div>

          <div className="w-full h-px bg-[#21262d] my-2" />

          <div className="flex justify-between items-center text-lg mt-2">
            <span className="font-bold text-white">Total Amount</span>
            <span className="font-black text-[#F5C518] text-2xl">₹{totalAmount}</span>
          </div>

          <div className="pt-6">
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-full font-black text-black text-sm uppercase tracking-wider transition-all shadow-lg ${
                isProcessing 
                  ? "bg-amber-600/50 cursor-wait text-black/50" 
                  : "bg-[#F5C518] hover:bg-yellow-400 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(245,197,24,0.4)]"
              }`}
            >
              {isProcessing ? "Processing Payment..." : `Pay ₹${totalAmount}`}
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 opacity-70">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">🔒 100% Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
