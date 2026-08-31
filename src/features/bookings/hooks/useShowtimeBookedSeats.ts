import { useQuery } from '@tanstack/react-query';
import { getShowtimeBookedSeatIds } from '../api/bookingsApi';

export const getShowtimeBookedSeatsKey = (showtimeId: string) =>
  ['showtimes', showtimeId, 'booked-seats'] as const;

export const useShowtimeBookedSeats = (showtimeId?: string | null) => {
  return useQuery({
    queryKey: showtimeId
      ? getShowtimeBookedSeatsKey(showtimeId)
      : ['showtimes', 'null', 'booked-seats'],
    queryFn: () =>
      showtimeId ? getShowtimeBookedSeatIds(showtimeId) : Promise.resolve([]),
    enabled: !!showtimeId,
    staleTime: 1000 * 30, // 30 seconds for live seat reservation freshness
  });
};
