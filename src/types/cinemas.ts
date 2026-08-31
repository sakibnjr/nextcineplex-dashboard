export type SeatType = 'regular' | 'premium' | 'accessible';

export interface Cinema {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Seat {
  id: string;
  cinema_id: string;
  seat_number: string;
  row_label: string;
  seat_type: SeatType;
  created_at: string;
}

export type CinemaInsert = Omit<Cinema, 'id' | 'created_at' | 'updated_at'>;
export type CinemaUpdate = Partial<CinemaInsert>;
export type SeatInsert = Omit<Seat, 'id' | 'created_at'>;

export interface CinemaWithStats extends Cinema {
  seats_count: number;
}

