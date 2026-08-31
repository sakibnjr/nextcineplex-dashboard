import { supabase } from '../../../lib/supabase';
import type { Movie, MovieInsert, MovieUpdate } from '../../../types';

export const getMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createMovie = async (movie: MovieInsert): Promise<Movie> => {
  const { data, error } = await supabase
    .from('movies')
    .insert(movie)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateMovie = async (
  id: string,
  updates: MovieUpdate
): Promise<Movie> => {
  const { data, error } = await supabase
    .from('movies')
    .update(updates)
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
