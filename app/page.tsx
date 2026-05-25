
async function getMovies() {

  const res = await fetch("http://localhost:3000/api/movies", {
    cache: "no-store", 
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }
  
  return res.json();
}

export default async function Home() {
  const movies = await getMovies();

  return (
    <main className="min-h-screen p-10 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          Movie Matrix
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie: any) => (
            <div 
              key={movie.id} 
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Showtime:</span> {new Date(movie.showTime).toLocaleString()}
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Book Seats
              </button>
            </div>
          ))}
        </div>
        
      </div>
    </main>
  );
}