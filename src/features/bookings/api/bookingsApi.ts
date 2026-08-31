import { supabase } from '../../../lib/supabase';
import type {
  Booking,
  CreateBookingPayload,
  Profile,
} from '../../../types';

export const getBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profile:profiles(*),
      showtime:showtimes(
        *,
        movie:movies(*),
        cinema:cinemas(*)
      ),
      booking_seats(
        *,
        seat:seats(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getShowtimeBookedSeatIds = async (
  showtimeId: string
): Promise<string[]> => {
  const { data, error } = await supabase
    .from('booking_seats')
    .select('seat_id, booking:bookings!inner(status)')
    .eq('showtime_id', showtimeId)
    .neq('booking.status', 'cancelled');

  if (error) throw error;
  return (data || []).map((row: { seat_id: string }) => row.seat_id);
};

export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createBooking = async (
  payload: CreateBookingPayload
): Promise<Booking> => {
  // Generate random 6-digit booking code NC-XXXXXX
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const bookingCode = `NC-${randomSuffix}`;

  // 1. Insert master booking record
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      user_id: payload.user_id,
      showtime_id: payload.showtime_id,
      booking_code: bookingCode,
      status: 'confirmed',
      total_amount: payload.total_amount,
    })
    .select()
    .single();

  if (bookingError) throw bookingError;

  // 2. Insert reserved seats
  if (payload.seats.length > 0) {
    const bookingSeatsData = payload.seats.map((s) => ({
      booking_id: booking.id,
      showtime_id: payload.showtime_id,
      seat_id: s.seat_id,
      unit_price: s.unit_price,
    }));

    const { error: seatsError } = await supabase
      .from('booking_seats')
      .insert(bookingSeatsData);

    if (seatsError) {
      // Rollback booking if seat insertion fails
      await supabase.from('bookings').delete().eq('id', booking.id);
      throw seatsError;
    }
  }

  // 3. Return full booking entity
  const { data: fullBooking, error: fetchError } = await supabase
    .from('bookings')
    .select(`
      *,
      profile:profiles(*),
      showtime:showtimes(
        *,
        movie:movies(*),
        cinema:cinemas(*)
      ),
      booking_seats(
        *,
        seat:seats(*)
      )
    `)
    .eq('id', booking.id)
    .single();

  if (fetchError) return booking;
  return fullBooking;
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (error) throw error;
};
