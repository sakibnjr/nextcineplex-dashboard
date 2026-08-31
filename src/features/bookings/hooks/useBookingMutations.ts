import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createBooking, cancelBooking } from '../api/bookingsApi';
import { BOOKINGS_QUERY_KEY } from './useBookings';
import { getShowtimeBookedSeatsKey } from './useShowtimeBookedSeats';
import type { CreateBookingPayload } from '../../../types';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: getShowtimeBookedSeatsKey(variables.showtime_id),
      });
      toast.success(`Booking ${data.booking_code} confirmed (${variables.seats.length} seats reserved)!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to place booking');
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
      toast.success('Booking reservation cancelled.');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to cancel booking');
    },
  });
};
