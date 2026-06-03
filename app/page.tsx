import HeroCarousel from "@/components/HeroCarousel";
import MovieListClient from "@/components/MovieListClient";
import { prisma } from "@/lib/prisma";

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
  const allMovies = await prisma.movie.findMany({
  where: {
    posterUrl: { not: null },
    OR: [
      { rating: { gt: 0 } },  
      { votes: { not: "0" } }, 
    ],  
  }
});

  const recommended = allMovies.slice(0, 16);

  const trending = [...allMovies]
    .filter(m => m.votes)
    .sort((a, b) => {
      const parse = (v: string) => {
        if (!v) return 0;
        if (v.endsWith("M")) return parseFloat(v) * 1_000_000;
        if (v.endsWith("K")) return parseFloat(v) * 1_000;
        return parseFloat(v);
      };
      return parse(b.votes ?? "") - parse(a.votes ?? "");
    })
    .slice(0, 12);

  const topRated = [...allMovies]
    .filter(m => m.rating)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 12);

  const FEATURED_BANNERS = [
    { keyword: "kalki",  banner: "/banners/kalki-poster.jpg"  },
    { keyword: "pushpa", banner: "/banners/pushpa-poster.jpg" },
    { keyword: "salaar", banner: "/banners/salaar-poster.jpg" },
  ];

  type FeaturedMovie = {
    id: string; title: string; genre: string;
    bgImage: string; bannerImage: string;
    rating: string | number; votes: string;
  };

  const featuredMovies: FeaturedMovie[] = FEATURED_BANNERS
    .map(({ keyword, banner }) => {
      const m = allMovies.find(movie =>
        movie.title.toLowerCase().includes(keyword)
      );
      if (!m) return null;
      return {
        id:          m.id,
        title:       m.title,
        genre:       [m.genre, m.language, m.cert].filter(Boolean).join(" • "),
        bgImage:     m.posterUrl || "",   
        bannerImage: banner,             
        rating:      m.rating ?? "N/A",
        votes:       m.votes ?? "0",
      };
    })
    .filter((m): m is FeaturedMovie => m !== null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <HeroCarousel movies={featuredMovies} />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-12">
        <MovieListClient
          allMovies={allMovies as any}
          recommended={recommended as any}
          trending={trending as any}
          topRated={topRated as any}
          totalCount={allMovies.length}
        />
      </div>

      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-[10px] text-slate-600 select-none">
        &copy; {new Date().getFullYear()} Movie Matrix. Streamlined movie booking experience.
      </footer>
    </div>
  );
}