"use client";

import { useState } from "react";

export type Tab = "UPI" | "CARD" | "NET_BANKING";

const UPI_APPS = ["GPay", "PhonePe", "Paytm", "BHIM"] as const;
const BANKS = ["SBI", "HDFC", "ICICI", "AXIS"] as const;

function isValidUpiId(id: string) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(id.trim());
}

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onMethodReady: (ready: boolean) => void;
};

const TAB_LABELS: Record<Tab, string> = {
  UPI: "UPI",
  CARD: "Credit / Debit Card",
  NET_BANKING: "Net Banking",
};

export default function PaymentTabs({ activeTab, onTabChange, onMethodReady }: Props) {
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  function handleUpiInput(val: string) {
    setUpiId(val);
    setSelectedUpiApp(null);
    onMethodReady(isValidUpiId(val));
  }

  function handleUpiAppSelect(app: string) {
    setSelectedUpiApp(app);
    setUpiId("");
    onMethodReady(true);
  }

  function handleBankSelect(bank: string) {
    setSelectedBank(bank);
    onMethodReady(true);
  }

  function handleTabChange(tab: Tab) {
    onTabChange(tab);
    onMethodReady(tab === "CARD");
  }

  return (
    <div className="w-full lg:w-3/5 bg-[#161b22] border border-[#21262d] rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Payment Options</h2>

      <div className="flex bg-[#0d1117] rounded-full p-1 mb-8 border border-[#21262d]">
        {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
              activeTab === tab
                ? "bg-[#F5C518] text-black shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="min-h-[280px]">
        {activeTab === "UPI" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Enter UPI ID
              </label>
              <input
                type="text"
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => handleUpiInput(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-slate-600"
              />
              {upiId.trim().length > 0 && !isValidUpiId(upiId) && (
                <p className="text-[11px] text-red-400 mt-1.5 ml-1">
                  Should look like <span className="font-mono">name@upi</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#21262d]" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">or pay using</span>
              <div className="flex-1 h-px bg-[#21262d]" />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {UPI_APPS.map((app) => (
                <button
                  key={app}
                  onClick={() => handleUpiAppSelect(app)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 bg-[#0d1117] border rounded-xl transition-colors group ${
                    selectedUpiApp === app ? "border-[#F5C518] bg-amber-500/10" : "border-[#21262d] hover:border-[#F5C518]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    selectedUpiApp === app
                      ? "bg-[#F5C518] border-[#F5C518] text-black"
                      : "bg-[#161b22] border-[#21262d] group-hover:bg-amber-500/10 text-slate-300 group-hover:text-[#F5C518]"
                  }`}>
                    <span className="text-xs font-bold">{app[0]}</span>
                  </div>
                  <span className={`text-xs font-medium ${selectedUpiApp === app ? "text-[#F5C518]" : "text-slate-400"}`}>
                    {app}
                  </span>
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
                <input type="text" placeholder="XXXX XXXX XXXX XXXX"
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
                <input type="text" placeholder="MM/YY"
                  className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">CVV</label>
                <input type="password" placeholder="•••"
                  className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all tracking-widest placeholder:text-slate-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Cardholder Name</label>
              <input type="text" placeholder="Name on card"
                className="w-full bg-[#0d1117] border border-[#21262d] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518] transition-all placeholder:text-slate-600"
              />
            </div>
          </div>
        )}

        {activeTab === "NET_BANKING" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Select Bank</label>
            <div className="grid grid-cols-2 gap-3">
              {BANKS.map((bank) => (
                <button key={bank} onClick={() => handleBankSelect(bank)}
                  className={`py-3 bg-[#0d1117] border rounded-xl text-sm font-semibold transition-colors ${
                    selectedBank === bank
                      ? "border-[#F5C518] text-[#F5C518] bg-amber-500/10"
                      : "border-[#21262d] text-slate-300 hover:border-[#F5C518] hover:text-[#F5C518]"
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
