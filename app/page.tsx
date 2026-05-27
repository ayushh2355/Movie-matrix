"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Movie = {
  id: string;
  title: string;
  rating: number;
  votes: string;
  posterUrl: string;
  genre: string;
  language: string;
  cert: string;
  showTime: string;
};

const moviesList: Movie[] = [
  {
    id: "6a15ecd987c25a1316b784cb",
    title: "Pushpa 2: The Rule",
    rating: 9.2,
    votes: "251.4K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa-2-the-rule-et00356724-1737184762.jpg",
    genre: "Action, Drama",
    language: "Hindi, Telugu, Tamil",
    cert: "UA",
    showTime: "May 25, 23:30",
  },
  {
    id: "6a15ecd987c25a1316b784cc",
    title: "Son of Sardaar",
    rating: 7.3,
    votes: "26K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/son-of-sardaar-2-et00450471-1754122330.jpg",
    genre: "Comedy,Family,Romance",
    language: "Hindi",
    cert: "U",
    showTime: "May 26, 12:00",
  },
  {
    id: "6a15ecd987c25a1316b784cd",
    title: "KGF: Chapter 2",
    rating: 9.4,
    votes: "380K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kgf-chapter-2-et00098647-08-04-2022-11-33-32.jpg",
    genre: "Action, Thriller",
    language: "Kannada, Hindi, Telugu",
    cert: "UA",
    showTime: "May 26, 15:30",
  },
  {
    id: "6a15ecd987c25a1316b784ce",
    title: "RRR",
    rating: 9.5,
    votes: "420K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/rrr-et00094579-1700135873.jpg",
    genre: "Action, Drama",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
    showTime: "May 26, 19:00",
  },
  {
    id: "6a15ecd987c25a1316b784cf",
    title: "Salaar",
    rating: 8.9,
    votes: "190K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/salaar-cease-fire--part-1-et00301886-1702971289.jpg",
    genre: "Action, Thriller",
    language: "Telugu, Kannada, Hindi",
    cert: "UA16+",
    showTime: "May 27, 16:00",
  },
  {
    id: "6a15ecd987c25a1316b784d0",
    title: "Project Hail Mary",
    rating: 9.0,
    votes: "450K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/project-hail-mary-et00451760-1751358286.jpg",
    genre: "Adventure,Drama,Sci-Fi",
    language: "English,Telugu, Tamil, Hindi",
    cert: "UA",
    showTime: "May 27, 19:30",
  },
  {
    id: "6a15ecd987c25a1316b784d1",
    title: "Chand Mera Dil",
    rating: 8.5,
    votes: "95K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/chand-mera-dil-et00484700-1778492742.jpg",
    genre: "Drama,Musical,Romantic",
    language: "Hindi",
    cert: "UA",
    showTime: "May 28, 14:45",
  },
  {
    id: "6a15ecd987c25a1316b784d2",
    title: "Kalki 2898 AD",
    rating: 9.1,
    votes: "310K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kalki-2898-ad-et00352941-1718275859.jpg",
    genre: "Action, Sci-Fi",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
    showTime: "May 28, 18:00",
  },
  {
    id: "6a15ecd987c25a1316b784d3",
    title: "Star Wars: The Mandalorian and Grogu",
    rating: 8.5,
    votes: "1.9K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/star-wars-the-mandalorian-and-grogu-et00499642-1778916322.jpg",
    genre: "Action, Sci-Fi",
    language: "English, Hindi",
    cert: "UA16+",
    showTime: "May 28, 21:30",
  },
  {
    id: "6a15ecd987c25a1316b784d4",
    title: "Drishyam 3",
    rating: 8.4,
    votes: "64.4K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/drishyam-3-malayalam-et00487295-1771314145.jpg",
    genre: "Thriller, Drama",
    language: "Malayalam, Telugu",
    cert: "UA16+",
    showTime: "May 29, 14:30",
  },
  {
    id: "6a15ecd987c25a1316b784d5",
    title: "Krishnavataram Part 1: The Heart",
    rating: 9.1,
    votes: "25.1K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/krishnavataram-part-1-the-heart-et00495498-1779699659.jpg",
    genre: "Devotional, Drama",
    language: "Hindi, Telugu",
    cert: "U",
    showTime: "May 29, 18:00",
  },
  {
    id: "6a15ecd987c25a1316b784d8",
    title: "Pati Patni Aur Woh 2",
    rating: 8.1,
    votes: "10.3K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pati-patni-aur-woh-do-et00485890-1777898323.jpg",
    genre: "Comedy, Romance",
    language: "Hindi",
    cert: "UA16+",
    showTime: "May 31, 16:45",
  },
];

const featuredMovies = [
  {
    id: "6a15ecd987c25a1316b784cb",
    title: "Pushpa 2: The Rule",
    genre: "Action, Drama • Hindi, Telugu, Tamil • UA",
    bgImage: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa-2-the-rule-et00356724-1737184762.jpg",
    rating: 9.2,
    votes: "251.4K",
  },
  {
    id: "6a15ecd987c25a1316b784d2",
    title: "Kalki 2898 AD",
    genre: "Action, Sci-Fi • Telugu, Hindi, Tamil • UA",
    bgImage: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kalki-2898-ad-et00352941-1718275859.jpg",
    rating: 9.1,
    votes: "310K",
  },
  {
    id: "6a15ecd987c25a1316b784cf",
    title: "Salaar",
    genre: "Action, Thriller • Telugu, Kannada, Hindi • UA16+",
    bgImage: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/salaar-cease-fire--part-1-et00301886-1702971289.jpg",
    rating: 8.9,
    votes: "190K",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeFeatured = featuredMovies[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      <header className="bg-slate-900 border-b border-slate-800/80 sticky top-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between select-none">
   
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent tracking-wider">
            MOVIE MATRIX
          </span>
        </Link>

        <button className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-black tracking-wider uppercase px-5 py-2.5 rounded-xl transition-all shadow-md">
          Sign In
        </button>
      </header>

      {activeFeatured && (
        <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-slate-950 select-none">
          {featuredMovies.map((movie, index) => (
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

          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 space-y-2 md:space-y-3 max-w-xl md:max-w-2xl relative z-20">
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
            {featuredMovies.map((_, index) => (
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
      )}

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
              <div 
                key={movie.id} 
                className="flex flex-col group"
              >
          
                <Link href={`/movie/${movie.id}`} className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-900 hover:border-slate-800/80 transition-all select-none">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${movie.posterUrl})` }}
                  />
               
                  <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-950/80 backdrop-blur-xs flex items-center justify-between px-3 border-t border-slate-900/60">
                    <span className="text-[10px] font-black text-slate-300 flex items-center gap-1">
                      <span className="text-amber-500 text-xs">★</span> {movie.rating}/10
                    </span>
                    <span className="text-[9px] font-bold text-slate-500">
                      {movie.votes} Votes
                    </span>
                  </div>
                </Link>

                <div className="mt-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/movie/${movie.id}`} className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                        {movie.title}
                      </Link>
                      <span className="text-[8px] font-black text-slate-400 border border-slate-800 px-1 py-0.5 rounded leading-none shrink-0">
                        {movie.cert}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 line-clamp-1">
                      {movie.genre}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                      {movie.language}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link 
                      href={`/movie/${movie.id}`}
                      className="block w-full text-center bg-slate-900 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl border border-slate-800/80 group-hover:border-amber-400/20 shadow-md group-hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] transition-all duration-150 active:scale-95"
                    >
                      Book Seats
                    </Link>
                  </div>
                </div>
              </div>
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