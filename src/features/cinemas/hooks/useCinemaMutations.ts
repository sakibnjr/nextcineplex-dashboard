import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createCinema,
  updateCinema,
  deleteCinema,
  saveCinemaSeatsLayout,
} from '../api/cinemasApi';
import { CINEMAS_QUERY_KEY } from './useCinemas';
import { getCinemaSeatsQueryKey } from './useCinemaSeats';
import type { CinemaInsert, CinemaUpdate, SeatInsert } from '../../../types';

export const useCreateCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCinema: CinemaInsert) => createCinema(newCinema),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CINEMAS_QUERY_KEY });
      toast.success(`Cinema branch "${data.name}" created!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create cinema');
    },
  });
};

export const useUpdateCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CinemaUpdate }) =>
      updateCinema(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CINEMAS_QUERY_KEY });
      toast.success(`Cinema branch "${data.name}" updated!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update cinema');
    },
  });
};

export const useDeleteCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCinema(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CINEMAS_QUERY_KEY });
      toast.success('Cinema branch removed.');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete cinema');
    },
  });
};

export const useSaveCinemaSeats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cinemaId,
      seats,
    }: {
      cinemaId: string;
      seats: SeatInsert[];
    }) => saveCinemaSeatsLayout(cinemaId, seats),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getCinemaSeatsQueryKey(variables.cinemaId),
      });
      queryClient.invalidateQueries({ queryKey: CINEMAS_QUERY_KEY });
      toast.success(`Auditorium seat map updated (${variables.seats.length} seats saved)!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save seat layout');
    },
  });
};
