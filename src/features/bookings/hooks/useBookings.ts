import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../api/bookingsApi';

export const BOOKINGS_QUERY_KEY = ['bookings'] as const;

export const useBookings = () => {
  return useQuery({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: getBookings,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
