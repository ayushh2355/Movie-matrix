"use client";


import MovieCard from "@/components/MovieCard";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useState } from "react";

export default function Home() {
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/movies')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMoviesList(data);
         const top2 = data.slice(1, 3).map((m: any) => ({
            id: m.id,
            title: m.title,
            genre: [m.genre, m.language, m.cert].filter(Boolean).join(" • "),
            bgImage: m.posterUrl,
            rating: m.rating || "N/A",
            votes: m.votes || "0",
          }));
          setFeaturedMovies(top2);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      <HeroCarousel movies={featuredMovies} />

      
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">
        <section className="w-full space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 select-none">
            <h2 className="text-sm font-black tracking-wider uppercase text-slate-200">
              Recommended Movies
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {moviesList.length} movies available
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {moviesList.map((movie) => (
              <MovieCard key={movie.id} movie={movie as any} />
            ))}
          </div>
        </section>
      </div>
  
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-[10px] text-slate-600 select-none">
        &copy; {new Date().getFullYear()} Movie Matrix. Streamlined movie booking experience.
      </footer>
    </div>
  );
}