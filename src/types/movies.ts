export type MovieStatus = 'upcoming' | 'now_showing' | 'ended';

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  duration_minutes: number;
  release_date: string | null;
  genre: string | null;
  language: string | null;
  rating: number | null;
  status: MovieStatus;
  created_at: string;
  updated_at: string;
}

export type MovieInsert = Omit<Movie, 'id' | 'created_at' | 'updated_at'>;
export type MovieUpdate = Partial<MovieInsert>;
