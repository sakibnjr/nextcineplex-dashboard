import type { Movie } from './movies';
import type { Cinema } from './cinemas';

export type ShowtimeStatus = 'scheduled' | 'cancelled' | 'completed';

export interface Showtime {
  id: string;
  movie_id: string;
  cinema_id: string;
  start_time: string;
  end_time: string;
  ticket_price: number;
  status: ShowtimeStatus;
  created_at: string;
  updated_at: string;
  movie?: Movie;
  cinema?: Cinema;
}

export type ShowtimeInsert = Omit<Showtime, 'id' | 'created_at' | 'updated_at' | 'movie' | 'cinema'>;
export type ShowtimeUpdate = Partial<ShowtimeInsert>;
