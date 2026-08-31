import { useQuery } from '@tanstack/react-query';
import { getCinemaSeats } from '../api/cinemasApi';

export const getCinemaSeatsQueryKey = (cinemaId: string) =>
  ['cinemas', cinemaId, 'seats'] as const;

export const useCinemaSeats = (cinemaId?: string | null) => {
  return useQuery({
    queryKey: cinemaId ? getCinemaSeatsQueryKey(cinemaId) : ['cinemas', 'null', 'seats'],
    queryFn: () => (cinemaId ? getCinemaSeats(cinemaId) : Promise.resolve([])),
    enabled: !!cinemaId,
    staleTime: 1000 * 60 * 5,
  });
};
