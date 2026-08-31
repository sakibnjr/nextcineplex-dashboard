import type { Profile } from './profiles';
import type { Showtime } from './showtimes';
import type { Seat } from './cinemas';

export type BookingStatus = 'confirmed' | 'cancelled';

export interface BookingSeat {
  id: string;
  booking_id: string;
  showtime_id: string;
  seat_id: string;
  unit_price: number;
  created_at: string;
  seat?: Seat;
}

export interface Booking {
  id: string;
  user_id: string;
  showtime_id: string;
  booking_code: string;
  status: BookingStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  showtime?: Showtime;
  booking_seats?: BookingSeat[];
}

export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'profile' | 'showtime' | 'booking_seats'>;
export type BookingUpdate = Partial<BookingInsert>;

export interface CreateBookingPayload {
  user_id: string;
  showtime_id: string;
  seats: Array<{
    seat_id: string;
    unit_price: number;
  }>;
  total_amount: number;
}

