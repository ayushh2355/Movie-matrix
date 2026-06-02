import HeroCarousel from "@/components/HeroCarousel";
import MovieListClient from "@/components/MovieListClient";
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
        <MovieListClient initialMovies={recommendedMovies as any} />
      </div>

      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-[10px] text-slate-600 select-none">
        &copy; {new Date().getFullYear()} Movie Matrix. Streamlined movie booking experience.
      </footer>
    </div>
  );
}