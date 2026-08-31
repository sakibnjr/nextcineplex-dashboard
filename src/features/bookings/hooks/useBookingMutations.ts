import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking, cancelBooking } from '../api/bookingsApi';
import { BOOKINGS_QUERY_KEY } from './useBookings';
import { getShowtimeBookedSeatsKey } from './useShowtimeBookedSeats';
import type { CreateBookingPayload } from '../../../types';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: getShowtimeBookedSeatsKey(variables.showtime_id),
      });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['showtimes'] });
    },
  });
};
