import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createMovie, updateMovie, deleteMovie } from '../api/moviesApi';
import { MOVIES_QUERY_KEY } from './useMovies';
import type { MovieInsert, MovieUpdate } from '../../../types';

export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMovie: MovieInsert) => createMovie(newMovie),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
      toast.success(`Movie "${data.title}" added to catalog!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create movie');
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MovieUpdate }) =>
      updateMovie(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
      toast.success(`Movie "${data.title}" updated!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update movie');
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
      toast.success('Movie deleted from catalog.');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete movie');
    },
  });
};
