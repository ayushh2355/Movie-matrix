import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage(props: Props) {
  const { id } = await props.params;

  const movie = await prisma.movie.findUnique({
    where: { id: id },
    include: {
      showtimes: {
        orderBy: { datetime: 'asc' }
      }
    }
  });

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
        
        
        <div className="w-full md:w-5/12 lg:w-2/5 shrink-0">
          <div className="aspect-2/3 md:aspect-auto md:h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative bg-slate-900 min-h-[450px]">
            {movie.posterUrl ? (
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-600">No Poster</div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-wide text-slate-100">
              {movie.title}
            </h1>
            {movie.cert && (
              <span className="border-2 border-slate-700 px-2 py-0.5 rounded-md text-sm font-bold text-slate-400 self-start mt-2">
                {movie.cert}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-400 mb-8">
            {movie.genre && <span className="bg-slate-900 px-3 py-1 rounded-md border border-slate-800">{movie.genre}</span>}
            {movie.language && <span>{movie.language}</span>}
          </div>

          <div className="bg-[#0b1120] border border-[#1e293b] rounded-3xl p-6 md:p-8 mt-4 md:mt-auto flex-1 md:flex-none flex flex-col">
            <h2 className="text-lg font-black uppercase tracking-widest text-amber-500 mb-8">
              Showtime Details
            </h2>

            {movie.showtimes && movie.showtimes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {movie.showtimes.map((st) => (
                  <div key={st.id} className="flex flex-col items-center justify-between bg-[#060913] border border-[#1e293b]/50 rounded-4xl py-10 px-8 shadow-2xl transition-all hover:border-[#1e293b] hover:shadow-black/50">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-slate-400 text-center">
                      {st.theaterScreen || "Standard"}
                    </span>
                    <span className="text-4xl font-black text-slate-50 mb-10 text-center tracking-wide">
                      {new Date(st.datetime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                    <Link 
                      href={`/showtime/${st.id}`}
                      className="w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black tracking-widest uppercase px-6 py-3.5 rounded-full transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] active:scale-95"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 font-semibold">No showtimes available for this movie.</div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}