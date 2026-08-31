import { supabase } from '../../../lib/supabase';
import type {
  Showtime,
  ShowtimeInsert,
  ShowtimeUpdate,
  ShowtimeStatus,
} from '../../../types';

const sanitizePayload = <T extends ShowtimeInsert | ShowtimeUpdate>(payload: T): T => {
  const sanitized = { ...payload };
  for (const key of Object.keys(sanitized) as (keyof T)[]) {
    if (sanitized[key] === '') {
      (sanitized as Record<string, unknown>)[key as string] = null;
    }
  }
  return sanitized;
};

export const getShowtimes = async (): Promise<Showtime[]> => {
  const { data, error } = await supabase
    .from('showtimes')
    .select('*, movie:movies(*), cinema:cinemas(*)')
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const createShowtime = async (
  showtime: ShowtimeInsert
): Promise<Showtime> => {
  const sanitized = sanitizePayload(showtime);
  const { data, error } = await supabase
    .from('showtimes')
    .insert(sanitized)
    .select('*, movie:movies(*), cinema:cinemas(*)')
    .single();

  if (error) throw error;
  return data;
};

export const updateShowtime = async (
  id: string,
  updates: ShowtimeUpdate
): Promise<Showtime> => {
  const sanitized = sanitizePayload(updates);
  const { data, error } = await supabase
    .from('showtimes')
    .update(sanitized)
    .eq('id', id)
    .select('*, movie:movies(*), cinema:cinemas(*)')
    .single();

  if (error) throw error;
  return data;
};

export const updateShowtimeStatus = async (
  id: string,
  status: ShowtimeStatus
): Promise<Showtime> => {
  const { data, error } = await supabase
    .from('showtimes')
    .update({ status })
    .eq('id', id)
    .select('*, movie:movies(*), cinema:cinemas(*)')
    .single();

  if (error) throw error;
  return data;
};

export const deleteShowtime = async (id: string): Promise<void> => {
  const { error } = await supabase.from('showtimes').delete().eq('id', id);
  if (error) throw error;
};
