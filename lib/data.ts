// lib/data.ts
export interface Seat {
  id: string;
  row: string;
  col: number;
  status: string;
}

export type Movie = {
  id: string;
  title: string;
  rating: number;
  votes: string;
  posterUrl: string;
  genre: string;
  language: string;
  cert: string;
  showTime: Date;
};

export const moviesList: Movie[] = [
  {
    id: "6a15ecd987c25a1316b784cb",
    title: "Pushpa 2: The Rule",
    rating: 9.2,
    votes: "251.4K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa-2-the-rule-et00356724-1737184762.jpg",
    genre: "Action, Drama",
    language: "Hindi, Telugu, Tamil",
    cert: "UA",
    showTime: new Date("2026-05-25T23:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784cc",
    title: "Son of Sardaar 2",
    rating: 8.8,
    votes: "110K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/son-of-sardaar-2-et00450471-1754122330.jpg",
    genre: "Action, Drama, Comedy",
    language: "Telugu, Hindi",
    cert: "U",
    showTime: new Date("2026-05-26T12:00:00.000Z"),
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
    showTime: new Date("2026-05-26T15:30:00.000Z"),
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
    showTime: new Date("2026-05-26T19:00:00.000Z"),
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
    showTime: new Date("2026-05-27T16:00:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d0",
    title: "Project Hail Mary",
    rating: 9.6,
    votes: "450K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/project-hail-mary-et00451760-1751358286.jpg",
    genre: "Action, Fantasy, Drama",
    language: "Telugu, Tamil, Hindi",
    cert: "UA",
    showTime: new Date("2026-05-27T19:30:00.000Z"),
  },
  {
    id: "6a15ecd987c25a1316b784d1",
    title: "Chand Mera Dil",
    rating: 8.7,
    votes: "95K",
    posterUrl: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/chand-mera-dil-et00484700-1778492742.jpg",
    genre: "Action, Drama",
    language: "Telugu, Hindi, Tamil",
    cert: "UA",
    showTime: new Date("2026-05-28T14:45:00.000Z"),
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
    showTime: new Date("2026-05-28T18:00:00.000Z"),
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
    showTime: new Date("2026-05-28T21:30:00.000Z"),
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
    showTime: new Date("2026-05-29T14:30:00.000Z"),
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
    showTime: new Date("2026-05-29T18:00:00.000Z"),
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
    showTime: new Date("2026-05-31T16:45:00.000Z"),
  },

];

export const featuredMovies = [
  { id: "6a15ecd987c25a1316b784d2", title: "Kalki 2898 AD", genre: "Action, Sci-Fi • Telugu, Hindi, Tamil • UA", bgImage: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/kalki-2898-ad-et00352941-1718275859.jpg", rating: 9.1, votes: "310K" },
  { id: "6a15ecd987c25a1316b784cf", title: "Salaar", genre: "Action, Thriller • Telugu, Kannada, Hindi • UA16+", bgImage: "https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/salaar-cease-fire--part-1-et00301886-1702971289.jpg", rating: 8.9, votes: "190K" },
];