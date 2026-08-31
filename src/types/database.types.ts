export type UserRole = 'user' | 'admin';
export type MovieStatus = 'upcoming' | 'now_showing' | 'ended';
export type SeatType = 'regular' | 'premium' | 'accessible';
export type ShowtimeStatus = 'scheduled' | 'cancelled' | 'completed';
export type BookingStatus = 'confirmed' | 'cancelled';
export type SnackOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_role: UserRole;
  created_at: string;
  updated_at: string;
}

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
  // Joined fields for UI convenience
  movie?: Movie;
  cinema?: Cinema;
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
  // Joined fields
  profile?: Profile;
  showtime?: Showtime;
  booking_seats?: BookingSeat[];
}

export interface BookingSeat {
  id: string;
  booking_id: string;
  showtime_id: string;
  seat_id: string;
  unit_price: number;
  created_at: string;
  // Joined fields
  seat?: Seat;
}

export interface Snack {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  price: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SnackOrder {
  id: string;
  user_id: string;
  cinema_id: string;
  booking_id: string | null;
  order_code: string;
  status: SnackOrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: Profile;
  cinema?: Cinema;
  booking?: Booking;
  items?: SnackOrderItem[];
}

export interface SnackOrderItem {
  id: string;
  snack_order_id: string;
  snack_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
  // Joined fields
  snack?: Snack;
}
