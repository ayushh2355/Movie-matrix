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
        orderBy: {
          datetime: 'asc',
        },
      },
    },
  });

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
        
        <div className="w-full md:w-1/3 shrink-0">
          <div className="aspect-2/3 w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative bg-slate-900">
            {movie.poster ? (
              <img 
                src={movie.poster} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-600">No Poster</div>
            )}
          </div>
        </div>

        {/* Right: Movie Details & Showtimes */}
        <div className="flex-1 flex flex-col">
          <h1 className="text-4xl md:text-5xl font-black tracking-wide text-slate-100 mb-2">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-400 mb-8">
            {movie.genre && <span className="bg-slate-900 px-3 py-1 rounded-md border border-slate-800">{movie.genre}</span>}
            {movie.duration && <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h2 className="text-lg font-black uppercase tracking-wider text-amber-500 mb-6">
              Available Showtimes
            </h2>

            {movie.showtimes.length === 0 ? (
              <p className="text-slate-500 font-medium">No showtimes available for this movie right now.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {movie.showtimes.map((showtime) => {
                  const showDate = new Date(showtime.datetime);
                  return (
                    <Link 
                      key={showtime.id}
                      href={`/showtime/${showtime.id}`}
                      className="flex flex-col items-center justify-center bg-slate-950 hover:bg-amber-500 text-slate-300 hover:text-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl p-4 transition-all duration-200 active:scale-95 group shadow-lg"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70 group-hover:opacity-100">
                        {showDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-xl font-black">
                        {showDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] font-bold mt-2 opacity-50 group-hover:opacity-100">
                        {showtime.theaterScreen}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}