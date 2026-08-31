import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMovie, updateMovie, deleteMovie } from '../api/moviesApi';
import { MOVIES_QUERY_KEY } from './useMovies';
import type { MovieInsert, MovieUpdate } from '../../../types';

export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMovie: MovieInsert) => createMovie(newMovie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MovieUpdate }) =>
      updateMovie(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIES_QUERY_KEY });
    },
  });
};
