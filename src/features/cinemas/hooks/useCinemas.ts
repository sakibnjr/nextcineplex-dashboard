import { useQuery } from '@tanstack/react-query';
import { getCinemas } from '../api/cinemasApi';

export const CINEMAS_QUERY_KEY = ['cinemas'] as const;

export const useCinemas = () => {
  return useQuery({
    queryKey: CINEMAS_QUERY_KEY,
    queryFn: getCinemas,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
