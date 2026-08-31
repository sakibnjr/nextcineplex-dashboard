import { useQuery } from '@tanstack/react-query';
import { getShowtimes } from '../api/showtimesApi';

export const SHOWTIMES_QUERY_KEY = ['showtimes'] as const;

export const useShowtimes = () => {
  return useQuery({
    queryKey: SHOWTIMES_QUERY_KEY,
    queryFn: getShowtimes,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};
