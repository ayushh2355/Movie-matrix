"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface CarouselMovie {
  id: string;
  title: string;
  genre: string;
  bgImage: string;
  rating: number;
  votes: string;
}

interface HeroCarouselProps {
  movies: CarouselMovie[];
}

export default function HeroCarousel({ movies }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const movieCount = movies?.length || 0;

  useEffect(() => {
    if (movieCount === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movieCount);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [movieCount]); 

  const activeFeatured = movies[currentSlide];

  if (!activeFeatured) return null;

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-slate-950 select-none">

      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 -z-10"
          }`}
          style={{ backgroundImage: `url(${movie.bgImage})` }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent z-10 pointer-events-none" />

      <div className="inset-0 flex flex-col justify-center px-6 md:px-16 space-y-2 md:space-y-3 max-w-xl md:max-w-2xl relative z-20 h-full">
        <div className="inline-flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
            Trending
          </span>
          <span className="text-[11px] font-bold text-slate-400 drop-shadow-md">
            ★ {activeFeatured.rating}/10 ({activeFeatured.votes} Votes)
          </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-100 tracking-wide leading-tight drop-shadow-lg">
          {activeFeatured.title}
        </h1>

        <p className="text-xs md:text-sm text-slate-300 font-semibold drop-shadow-md">
          {activeFeatured.genre}
        </p>

        <div className="pt-2">
          <Link 
            href={`/movie/${activeFeatured.id}`}
            className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black tracking-wider uppercase px-6 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
          >
            Book Tickets
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-6 h-1.5 bg-amber-500"
                : "w-1.5 h-1.5 bg-slate-500/50 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}