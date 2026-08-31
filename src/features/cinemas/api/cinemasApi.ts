import { supabase } from '../../../lib/supabase';
import type {
  Cinema,
  CinemaInsert,
  CinemaUpdate,
  CinemaWithStats,
  Seat,
  SeatInsert,
} from '../../../types';

const sanitizePayload = <T extends CinemaInsert | CinemaUpdate>(payload: T): T => {
  const sanitized = { ...payload };
  for (const key of Object.keys(sanitized) as (keyof T)[]) {
    if (sanitized[key] === '') {
      (sanitized as Record<string, unknown>)[key as string] = null;
    }
  }
  return sanitized;
};

export const getCinemas = async (): Promise<CinemaWithStats[]> => {
  const { data, error } = await supabase
    .from('cinemas')
    .select('*, seats(count)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  type CinemaRawResponse = Cinema & {
    seats?: Array<{ count: number }> | { count: number } | null;
  };

  return ((data || []) as CinemaRawResponse[]).map((item) => {
    let count = 0;
    if (Array.isArray(item.seats) && item.seats.length > 0) {
      count = item.seats[0].count || 0;
    } else if (item.seats && typeof item.seats === 'object' && 'count' in item.seats) {
      count = item.seats.count || 0;
    }

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      address: item.address,
      city: item.city,
      image_url: item.image_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      seats_count: count,
    };
  });
};

export const createCinema = async (cinema: CinemaInsert): Promise<Cinema> => {
  const sanitized = sanitizePayload(cinema);
  const { data, error } = await supabase
    .from('cinemas')
    .insert(sanitized)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCinema = async (
  id: string,
  updates: CinemaUpdate
): Promise<Cinema> => {
  const sanitized = sanitizePayload(updates);
  const { data, error } = await supabase
    .from('cinemas')
    .update(sanitized)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCinema = async (id: string): Promise<void> => {
  const { error } = await supabase.from('cinemas').delete().eq('id', id);
  if (error) throw error;
};

export const getCinemaSeats = async (cinemaId: string): Promise<Seat[]> => {
  const { data, error } = await supabase
    .from('seats')
    .select('*')
    .eq('cinema_id', cinemaId)
    .order('row_label', { ascending: true })
    .order('seat_number', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const saveCinemaSeatsLayout = async (
  cinemaId: string,
  seats: SeatInsert[]
): Promise<void> => {
  // Delete existing seats for this cinema
  const { error: deleteError } = await supabase
    .from('seats')
    .delete()
    .eq('cinema_id', cinemaId);

  if (deleteError) throw deleteError;

  // Insert newly generated/edited seats if any
  if (seats.length > 0) {
    const { error: insertError } = await supabase
      .from('seats')
      .insert(seats);

    if (insertError) throw insertError;
  }
};
