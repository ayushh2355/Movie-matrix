import Link from "next/link";
import { Movie } from "./MovieListClient";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="flex flex-col group">
      <Link href={`/movie/${movie.id}`} className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-900 hover:border-slate-800/80 transition-all select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${movie.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500"})` }}
        />
        <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-950/80 backdrop-blur-sm flex items-center justify-between px-3 border-t border-slate-900">
          <span className="text-[10px] font-black text-slate-300 flex items-center gap-1">
            <span className="text-amber-500 text-xs">★</span> {movie.rating || "N/A"}/10
          </span>
          <span className="text-[9px] font-bold text-slate-500">
            {movie.votes || "0"} Votes
          </span>
        </div>
      </Link>

      <div className="mt-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/movie/${movie.id}`} className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
              {movie.title}
            </Link>
            {movie.cert && (
              <span className="text-[8px] font-black text-slate-400 border border-slate-800 px-1 py-0.5 rounded leading-none">
                {movie.cert}
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-bold mt-1 line-clamp-1">
            {movie.genre}
          </p>
          <p className="text-[9px] text-slate-400 font-medium mt-0.5">
            {movie.language}
          </p>
        </div>

        <div className="mt-4">
          <Link 
            href={`/movie/${movie.id}`}
            className="block w-full text-center bg-slate-900 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl border border-slate-800/80 group-hover:border-amber-400/20 shadow-md transition-all duration-150 active:scale-95"
          >
            Book Seats
          </Link>
        </div>
      </div>
    </div>
  );
}