"use client";

import { useState, useMemo } from "react";
import MovieCard from "@/components/MovieCard";

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
  const [language, setLanguage] = useState("All");
  const [genre, setGenre] = useState("All");

  const { uniqueGenres, uniqueLanguages } = useMemo(() => {
    const genreSet = new Set<string>();
    const langSet = new Set<string>();
    
    const ALLOWED_LANGUAGES = ["English", "Hindi", "Telugu", "Tamil", "Malayalam", "Kannada"];
    const ALLOWED_GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Romance", "Thriller", "Horror", "Adventure"];
    
    initialMovies.forEach(m => {
      if (m.genre) {
        ALLOWED_GENRES.forEach(allowedGenre => {
          if (m.genre?.toLowerCase().includes(allowedGenre.toLowerCase())) {
            genreSet.add(allowedGenre);
          }
        });
      }
      if (m.language) {
        ALLOWED_LANGUAGES.forEach(allowedLang => {
          if (m.language?.toLowerCase().includes(allowedLang.toLowerCase())) {
            langSet.add(allowedLang);
          }
        });
      }
    });
    
    return {
      uniqueGenres: ["All", ...Array.from(genreSet)],
      uniqueLanguages: ["All", ...Array.from(langSet)]
    };
  }, [initialMovies]);

  const filteredMovies = useMemo(() => {
    let result = initialMovies;
    if (genre !== "All") {
      result = result.filter(m => m.genre?.toLowerCase().includes(genre.toLowerCase()));
    }
    if (language !== "All") {
      result = result.filter(m => m.language?.toLowerCase().includes(language.toLowerCase()));
    }
    return result;
  }, [initialMovies, genre, language]);

  return (
    <div className="w-full">
      <section className="w-full space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 select-none">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black tracking-wider uppercase text-slate-200">
              Recommended Movies
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              {filteredMovies.length} movies available
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              {uniqueGenres.map(g => (
                <option key={g} value={g}>{g === "All" ? "All Genres" : g}</option>
              ))}
            </select>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              {uniqueLanguages.map(l => (
                <option key={l} value={l}>{l === "All" ? "All Languages" : l}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-dashed border-slate-800/80 rounded-2xl select-none">
            <h3 className="text-sm font-bold text-slate-300">No movies found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}