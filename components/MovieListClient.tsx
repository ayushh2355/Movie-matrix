"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  allMovies: Movie[];
  recommended: Movie[];
  trending: Movie[];
  topRated: Movie[];
  totalCount: number;
};

const INITIAL_SHOW = 4;

function Section({ title, movies }: { title: string; movies: Movie[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? movies : movies.slice(0, INITIAL_SHOW);
  const hasMore = movies.length > INITIAL_SHOW;

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between pb-3 select-none">
        <h2 className="text-sm font-black tracking-wider uppercase text-[#F5C518] border-l-[6px] border-amber-500 pl-3">
          {title}
        </h2>
        {hasMore && (
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-xs font-semibold text-amber-500 hover:text-amber-400 tracking-wider uppercase cursor-pointer transition-all hover:drop-shadow-[0_0_8px_rgba(245,197,24,0.7)]"
          >
            {showAll ? "Show Less ▲" : "Show More ▼"}
          </button>
        )}
      </div>
      <div className="h-px bg-gradient-to-r from-amber-500/40 via-slate-700 to-transparent mb-2" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {visible.map((movie) => (
          <MovieCard key={movie.id} movie={movie as any} />
        ))}
      </div>
    </section>
  );
}

const ALLOWED_GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Romance", "Thriller", "Horror", "Adventure"];
const ALLOWED_LANGUAGES = ["Hindi", "Telugu", "Tamil", "Malayalam", "Kannada", "English"];

export default function MovieListClient({
  allMovies,
  recommended,
  trending,
  topRated,
  totalCount,
}: Props) {
  const router = useRouter();

  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  const [showAllMovies, setShowAllMovies] = useState(false);

  const isFiltering = selectedGenre !== "All" || selectedLanguage !== "All" || showAllMovies;

  const filteredAll = useMemo(() => {
    let result = allMovies;
    if (selectedGenre !== "All") {
      result = result.filter(m => m.genre?.toLowerCase().includes(selectedGenre.toLowerCase()));
    }
    if (selectedLanguage !== "All") {
      result = result.filter(m => m.language?.toLowerCase().includes(selectedLanguage.toLowerCase()));
    }
    return result;
  }, [allMovies, selectedGenre, selectedLanguage]);

  const filteredRecommended = useMemo(() => recommended, [recommended]);
  const visibleRecommended = showAllRecommended
    ? filteredRecommended
    : filteredRecommended.slice(0, INITIAL_SHOW);
  const recHasMore = filteredRecommended.length > INITIAL_SHOW;

  const FilterBar = (
    <div className="flex items-center justify-between select-none">
      <button
        onClick={() => { setShowAllMovies(prev => !prev); setSelectedGenre("All"); setSelectedLanguage("All"); setShowAllRecommended(false); }}
        className={`text-xs font-semibold tracking-wider uppercase cursor-pointer transition-all border rounded px-2.5 py-1 ${
          showAllMovies
            ? "text-amber-500 border-amber-500 hover:text-amber-400 hover:border-amber-400 hover:drop-shadow-[0_0_6px_rgba(245,197,24,0.5)]"
            : "text-amber-400 border-amber-500/50 hover:border-amber-400 hover:drop-shadow-[0_0_6px_rgba(245,197,24,0.5)]"
        }`}
      >
        {showAllMovies ? "← Back to Sections" : "Show All Movies"}
      </button>

      <div className="flex gap-2">
        <select
          value={selectedGenre}
          onChange={(e) => { setSelectedGenre(e.target.value); setShowAllMovies(false); setShowAllRecommended(false); }}
          className="bg-slate-900 border border-amber-500/50 text-amber-400 text-xs rounded px-2.5 py-1 outline-none hover:border-amber-400 focus:border-[#F5C518] hover:drop-shadow-[0_0_6px_rgba(245,197,24,0.5)] transition-all cursor-pointer"
        >
          <option value="All">All Genres</option>
          {ALLOWED_GENRES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={selectedLanguage}
          onChange={(e) => { setSelectedLanguage(e.target.value); setShowAllMovies(false); setShowAllRecommended(false); }}
          className="bg-slate-900 border border-amber-500/50 text-amber-400 text-xs rounded px-2.5 py-1 outline-none hover:border-amber-400 focus:border-[#F5C518] hover:drop-shadow-[0_0_6px_rgba(245,197,24,0.5)] transition-all cursor-pointer"
        >
          <option value="All">All Languages</option>
          {ALLOWED_LANGUAGES.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
  if (isFiltering) {
    return (
      <div className="w-full space-y-6">
        {FilterBar}
        <div className="h-px bg-gradient-to-r from-amber-500/40 via-slate-700 to-transparent" />

        <div className="flex items-center justify-between select-none">
          <h2 className="text-sm font-black tracking-wider uppercase text-[#F5C518] border-l-[6px] border-amber-500 pl-3">
            {filteredAll.length} {showAllMovies ? "Total Movies" : "Movies Found"}
          </h2>
          {!showAllMovies && (
            <button
              onClick={() => { setSelectedGenre("All"); setSelectedLanguage("All"); }}
              className="text-xs font-semibold text-slate-400 hover:text-amber-400 tracking-wider uppercase cursor-pointer transition-colors"
            >
              Clear Filters ✕
            </button>
          )}
        </div>

        {filteredAll.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {filteredAll.map((movie) => (
              <MovieCard key={movie.id} movie={movie as any} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-dashed border-slate-800/80 rounded-2xl select-none">
            <h3 className="text-sm font-bold text-slate-300">No movies found</h3>
            <p className="text-xs text-slate-500 mt-1">Try a different genre or language.</p>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="w-full space-y-12">

      <section className="w-full space-y-6">
        {FilterBar}
        <div className="h-px bg-gradient-to-r from-amber-500/40 via-slate-700 to-transparent" />

        <div className="flex items-center justify-between pb-1 select-none">
          <h2 className="text-sm font-black tracking-wider uppercase text-[#F5C518] border-l-[6px] border-amber-500 pl-3">
            Recommended
          </h2>
          {recHasMore && (
            <button
              onClick={() => setShowAllRecommended(prev => !prev)}
              className="text-xs font-semibold text-amber-500 hover:text-amber-400 tracking-wider uppercase cursor-pointer transition-all hover:drop-shadow-[0_0_8px_rgba(245,197,24,0.7)]"
            >
              {showAllRecommended ? "Show Less ▲" : "Show More ▼"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {visibleRecommended.map((movie) => (
            <MovieCard key={movie.id} movie={movie as any} />
          ))}
        </div>
      </section>

      <Section title="Trending" movies={trending} />
      <Section title="Top Rated" movies={topRated} />

    </div>
  );
}