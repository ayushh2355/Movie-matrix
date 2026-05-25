import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";


const prisma = new PrismaClient();

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage(props: Props) {

    const { id } = await props.params;

  const movie = await prisma.movie.findUnique({
    where: { 
      id: id 
    },
    include: {
      seats: {
        orderBy: [
          { row: 'asc' },
          { col: 'asc' }
        ]
      }
    }
  });

  
  if (!movie) {
    notFound();
  }

  
  return (
    <main className="min-h-screen p-10 bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto">
        
      
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-blue-600">{movie.title}</h1>
          <p className="text-gray-600 font-medium">
            Select your seats for {new Date(movie.showTime).toLocaleString()}
          </p>
        </div>

       
        <div className="w-full h-12 bg-linear-to-b from-gray-300 to-gray-100 rounded-t-full shadow-inner mb-16 flex items-center justify-center border-b-4 border-gray-400">
          <span className="text-gray-500 font-bold tracking-widest uppercase text-sm">
            Screen
          </span>
        </div>

       
        {movie.seats.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Theater is Empty</h2>
            <p className="text-gray-500">We need to run our database script to generate the seats!</p>
          </div>
        ) : (
          <div className="text-center text-green-600 font-bold">
            Seats loaded successfully!
          </div>
        )}

      </div>
    </main>
  );
}