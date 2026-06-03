"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import UserDropdown from "@/components/UserDropdown";

type Movie = {
  id: string;
  title: string;
  posterUrl: string | null;
  genre: string | null;
  rating?: number | null;
  votes?: string | null;
};

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setMovies(data); })
      .catch((err) => console.error("Navbar fetch error:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMovies = searchQuery.trim()
    ? movies
        .filter((m) => {
          const hasNoVotes = !m.votes || m.votes === "0" || m.votes.toLowerCase() === "n/a";
          const hasNoRating = !m.rating || m.rating === 0;
          const isInvalid = !m.posterUrl || m.posterUrl === "N/A" || failedImages.has(m.id) || hasNoVotes || hasNoRating;
          return m.title.toLowerCase().includes(searchQuery.toLowerCase()) && !isInvalid;
        })
        .slice(0, 6)
    : [];

  const handleSelect = (movieId: string) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    router.push(`/movie/${movieId}`);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between select-none">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <span className="text-xl md:text-2xl font-black bg-linear-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wide">
          MOVIE MATRIX
        </span>
      </Link>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={dropdownRef}>
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search for Movies..."
          value={searchQuery}
          autoComplete="off"
          onChange={(e) => { setSearchQuery(e.target.value); setIsDropdownOpen(true); }}
          onFocus={() => { if (searchQuery.trim()) setIsDropdownOpen(true); }}
          onKeyDown={(e) => { if (e.key === "Escape") { setIsDropdownOpen(false); inputRef.current?.blur(); } }}
          className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 pl-10 pr-9 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-sm transition-colors shadow-inner"
        />

        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(""); setIsDropdownOpen(false); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {isDropdownOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
            {filteredMovies.length > 0 ? (
              <ul>
                {filteredMovies.map((movie) => (
                  <li key={movie.id}>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(movie.id)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/60 transition-colors"
                    >
                      {movie.posterUrl ? (
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          onError={() => setFailedImages(prev => new Set(prev).add(movie.id))}
                          className="w-8 h-10 object-cover rounded shrink-0" 
                        />
                      ) : (
                        <div className="w-8 h-10 bg-slate-800 rounded shrink-0 flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate">{movie.title}</p>
                        <p className="text-xs text-slate-500 truncate">{movie.genre ?? "Various"}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-5 text-sm text-slate-500 text-center">
                <span className="block mb-1">🎬</span>
                No movies found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth */}
      <div className="flex items-center gap-4 shrink-0">
        {session?.user ? (
          <UserDropdown user={session.user} />
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-[11px] font-black tracking-wider uppercase px-4 py-1.5 rounded-lg transition-all shadow-md"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
