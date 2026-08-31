import { useQuery } from '@tanstack/react-query';
import { getMovies } from '../api/moviesApi';

export const MOVIES_QUERY_KEY = ['movies'] as const;

export const useMovies = () => {
  return useQuery({
    queryKey: MOVIES_QUERY_KEY,
    queryFn: getMovies,
  });
};
