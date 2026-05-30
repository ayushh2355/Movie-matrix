"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";

export type Movie = {
  id: string;
  title: string;
  showTime: string;
  posterUrl: string | null;
  rating: number | null;
  votes: string | null;
  genre: string | null;
  language: string | null;
  cert: string | null;
};

type Props = {
  initialMovies: Movie[];
};

export default function MovieListClient({ initialMovies }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = useMemo(() => {
    return initialMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialMovies, searchQuery]);

  const featuredMovie = useMemo(() => {
    return initialMovies.length > 0 ? initialMovies[0] : null;
  }, [initialMovies]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      <Navbar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {featuredMovie && (
        <section className="relative w-full aspect-[2.8/1] md:aspect-[3.5/1] overflow-hidden bg-slate-900 select-none">
        
         
          <div 
            className="absolute inset-0 bg-cover filter brightness-[0.35] scale-105"
            style={{ 
              backgroundImage: `url(${featuredMovie.posterUrl})`,
              backgroundPosition: "center 20%" 
            }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 space-y-2 md:space-y-4 max-w-xl md:max-w-2xl z-10">
            <div className="inline-flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                Trending #1
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                ★ {featuredMovie.rating || "N/A"}/10 ({featuredMovie.votes || "0"} Votes)
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100 tracking-wide leading-tight">
              {featuredMovie.title}
            </h1>

            <p className="text-xs text-slate-300 font-semibold hidden md:block">
              {[featuredMovie.genre, featuredMovie.language, featuredMovie.cert].filter(Boolean).join(" • ")}
            </p>

            <div className="pt-2">
              <Link 
                href={`/movie/${featuredMovie.id}`}
                className="inline-block bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black tracking-wider uppercase px-6 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
              >
                Book Tickets Now
              </Link>
            </div>
          </div>
        </section>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex-1">
        <section className="w-full space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 select-none">
            <h2 className="text-sm font-black tracking-wider uppercase text-slate-200">
              Now Showing
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredMovies.length} movies
            </span>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-dashed border-slate-800/80 rounded-2xl select-none">
              <h3 className="text-sm font-bold text-slate-300">No movies found</h3>
              <p className="text-xs text-slate-500 mt-1">Try modifying your search query.</p>
            </div>
          )}
        </section>
      </div>
      
      <Footer />
    </div>
  );
}