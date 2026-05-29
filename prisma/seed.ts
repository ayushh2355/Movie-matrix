import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  await prisma.showtime.deleteMany()
  await prisma.movie.deleteMany()

  const moviesToSeed = [
    {
      id: "6a15ecd987c25a1316b784cb",
      title: "Pushpa 2: The Rule",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa-2-the-rule-et00356724-1737184762.jpg",
      genre: "Action, Drama",
      duration: 180,
    },
    {
      id: "6a15ecd987c25a1316b784cc",
      title: "Son of Sardaar",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/son-of-sardaar-2-et00450471-1754122330.jpg",
      genre: "Comedy,Family,Romance",
      duration: 145,
    },
    {
      id: "6a15ecd987c25a1316b784cd",
      title: "KGF: Chapter 2",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kgf-chapter-2-et00098647-08-04-2022-11-33-32.jpg",
      genre: "Action, Thriller",
      duration: 168,
    },
    {
      id: "6a15ecd987c25a1316b784ce",
      title: "RRR",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/extra/vertical_logo/mobile/thumbnail/xxlarge/rrr-et00094579-1700135873.jpg",
      genre: "Action, Drama",
      duration: 182,
    },
    {
      id: "6a15ecd987c25a1316b784cf",
      title: "Salaar",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/salaar-cease-fire--part-1-et00301886-1702971289.jpg",
      genre: "Action, Thriller",
      duration: 175,
    },
    {
      id: "6a15ecd987c25a1316b784d0",
      title: "Project Hail Mary",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/project-hail-mary-et00451760-1751358286.jpg",
      genre: "Adventure,Drama,Sci-Fi",
      duration: 150,
    },
    {
      id: "6a15ecd987c25a1316b784d1",
      title: "Chand Mera Dil",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/chand-mera-dil-et00484700-1778492742.jpg",
      genre: "Drama,Musical,Romantic",
      duration: 140,
    },
    {
      id: "6a15ecd987c25a1316b784d2",
      title: "Kalki 2898 AD",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kalki-2898-ad-et00352941-1718275859.jpg",
      genre: "Action, Sci-Fi",
      duration: 181,
    },
    {
      id: "6a15ecd987c25a1316b784d3",
      title: "Star Wars: The Mandalorian and Grogu",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/star-wars-the-mandalorian-and-grogu-et00499642-1778916322.jpg",
      genre: "Action, Sci-Fi",
      duration: 135,
    },
    {
      id: "6a15ecd987c25a1316b784d4",
      title: "Drishyam 3",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/drishyam-3-malayalam-et00487295-1771314145.jpg",
      genre: "Thriller, Drama",
      duration: 160,
    },
    {
      id: "6a15ecd987c25a1316b784d5",
      title: "Krishnavataram Part 1: The Heart",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/krishnavataram-part-1-the-heart-et00495498-1779699659.jpg",
      genre: "Devotional, Drama",
      duration: 145,
    },
    {
      id: "6a15ecd987c25a1316b784d8",
      title: "Pati Patni Aur Woh 2",
      poster: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pati-patni-aur-woh-do-et00485890-1777898323.jpg",
      genre: "Comedy, Romance",
      duration: 130,
    }
  ];

  for (const movie of moviesToSeed) {
    await prisma.movie.create({
      data: {
        id: movie.id,
        title: movie.title,
        poster: movie.poster,
        genre: movie.genre,
        duration: movie.duration,
        showtimes: {
          create: [
            {
              datetime: new Date(new Date().setHours(10, 0, 0, 0)),
              theaterScreen: "Screen 1"
            },
            {
              datetime: new Date(new Date().setHours(15, 30, 0, 0)),
              theaterScreen: "Screen 2"
            },
            {
              datetime: new Date(new Date().setHours(21, 0, 0, 0)),
              theaterScreen: "IMAX"
            }
          ]
        }
      }
    });
    console.log(`Created Movie: ${movie.title}`);
  }

  console.log("Seeding finished successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
