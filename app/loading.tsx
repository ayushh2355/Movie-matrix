export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center py-10 px-4">
      {/* Top Navigation Skeleton */}
      <div className="w-full max-w-6xl h-16 bg-slate-900/50 rounded-2xl border border-slate-800/80 animate-pulse mb-12 flex items-center px-6 justify-between">
        <div className="w-32 h-6 bg-slate-800/80 rounded-md" />
        <div className="w-64 h-10 bg-slate-800/80 rounded-full hidden md:block" />
        <div className="w-20 h-8 bg-slate-800/80 rounded-full" />
      </div>

      {/* Main Content Skeleton */}
      <div className="w-full max-w-6xl">
        {/* Title area */}
        <div className="w-48 h-8 bg-slate-900/80 rounded-lg animate-pulse mb-8" />
        
        {/* Grid area */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="w-full aspect-[2/3] bg-slate-900/60 rounded-xl border border-slate-800/50" />
              <div className="w-3/4 h-4 bg-slate-900/80 rounded-md" />
              <div className="w-1/2 h-3 bg-slate-800/80 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
