"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import UserDropdown from "@/components/UserDropdown";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Record<string, unknown>[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all movies for client-side filtering
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMovies(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMovies = movies.filter(m => 
    typeof m.title === 'string' && m.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // show max 5 results

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleMovieSelect = (movieId: string) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    router.push(`/movie/${movieId}`);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-50 px-4 md:px-8 py-3.5 flex items-center justify-between select-none">
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
        <Link href="/" className="select-none shrink-0">
          <span className="text-xl md:text-2xl font-black bg-linear-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wide">
            MOVIE MATRIX
          </span>
        </Link>
        
        {/* Mobile menu could go here */}
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={dropdownRef}>
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search for Movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-sm transition-colors shadow-inner"
        />
        
        {/* Autocomplete Dropdown */}
        {isDropdownOpen && searchQuery.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
            {filteredMovies.length > 0 ? (
              <ul>
                {filteredMovies.map(movie => (
                  <li key={String(movie.id)}>
                    <button
                      onClick={() => handleMovieSelect(String(movie.id))}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors flex items-center gap-3 border-b border-slate-800/50 last:border-0"
                    >
                      {movie.posterUrl ? (
                        <img src={String(movie.posterUrl)} alt={String(movie.title)} className="w-8 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-8 h-10 bg-slate-800 rounded"></div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-slate-200">{String(movie.title)}</div>
                        <div className="text-xs text-slate-500">{movie.genre ? String(movie.genre) : 'Various'}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-4 text-sm text-slate-500 text-center">
                No movies found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {session?.user ? (
          <UserDropdown user={session.user} />
        ) : (
          <button onClick={() => signIn("google")} className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-[11px] font-black tracking-wider uppercase px-4 py-1.5 rounded-lg transition-all shadow-md">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}