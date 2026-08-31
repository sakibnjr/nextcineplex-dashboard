import { supabase } from '../../../lib/supabase';
import type { Movie, MovieInsert, MovieUpdate } from '../../../types';

const sanitizePayload = <T extends MovieInsert | MovieUpdate>(payload: T): T => {
  const sanitized = { ...payload };
  for (const key of Object.keys(sanitized) as (keyof T)[]) {
    if (sanitized[key] === '') {
      (sanitized as Record<string, unknown>)[key as string] = null;
    }
  }
  return sanitized;
};

export const getMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createMovie = async (movie: MovieInsert): Promise<Movie> => {
  const sanitized = sanitizePayload(movie);
  const { data, error } = await supabase
    .from('movies')
    .insert(sanitized)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMovie = async (
  id: string,
  updates: MovieUpdate
): Promise<Movie> => {
  const sanitized = sanitizePayload(updates);
  const { data, error } = await supabase
    .from('movies')
    .update(sanitized)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteMovie = async (id: string): Promise<void> => {
  const { error } = await supabase.from('movies').delete().eq('id', id);
  if (error) throw error;
};
