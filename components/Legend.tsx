export default function Legend() {
  return (
    <div className="mt-8 pt-6 border-t border-slate-800/60 space-y-3">
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest select-none mb-1.5">Seat Categories
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-zinc-800/40 border border-zinc-700/60 rounded" />
            <span className="text-[10px] font-semibold text-slate-400 select-none">Bronze (₹200)</span>
            </div>
        <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-slate-800/40 border border-slate-700/60 rounded" />
            <span className="text-[10px] font-semibold text-slate-400 select-none">Silver (₹300)</span>
            </div>
        <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-yellow-950/40 border border-yellow-900/60 rounded" />
            <span className="text-[10px] font-semibold text-slate-400 select-none">Gold (₹500)</span>
            </div>
        <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-rose-950/40 border border-rose-950/60 rounded opacity-60" />
            <span className="text-[10px] font-semibold text-slate-400 select-none">Sold Out</span>
            </div>
        <div className="flex items-center gap-2 col-span-2">
            <div className="w-3.5 h-3.5 bg-emerald-500 border border-emerald-400 rounded shadow-[0_0_8px_rgba(16,185,129,0.35)]" />
            <span className="text-[10px] font-semibold text-slate-400 select-none">Selected Seat</span>
            </div>
      </div>
    </div>
  );
}