import MovieCard from "@/components/MovieCard";
import HeroCarousel from "@/components/HeroCarousel";
import { prisma } from "@/lib/prisma";
import { fetchMoviesFromOmdb } from "@/lib/data";

export const dynamic = "force-dynamic";

const BANNER_MAP: Record<string, string> = {
  "kalki":  "/banners/kalki-poster.jpg",
  "pushpa": "/banners/pushpa-poster.jpg",
  "salaar": "/banners/salaar-poster.jpg",
};

function getBannerForMovie(title: string): string | null {
  const lower = title.toLowerCase();
  for (const [keyword, path] of Object.entries(BANNER_MAP)) {
    if (lower.includes(keyword)) return path;
  }
  return null; 
}

export default async function Home() {
  const dbMovies = await prisma.movie.findMany();
  const allMovies = dbMovies.length > 0 ? dbMovies : await fetchMoviesFromOmdb();

  const MAX_RECOMMENDED_MOVIES = 40;
  const recommendedMovies = allMovies.slice(0, MAX_RECOMMENDED_MOVIES);

  const featuredMovies = allMovies.slice(0, 3).map((m) => ({
    id:          m.id,
    title:       m.title,
    genre:       [m.genre, m.language, m.cert].filter(Boolean).join(" • "),
    bgImage:     m.posterUrl || "",           
    bannerImage: getBannerForMovie(m.title),  
    rating:      m.rating || "N/A",
    votes:       m.votes || "0",
  }));

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
              Showing {recommendedMovies.length} movies
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {recommendedMovies.map((movie) => (
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