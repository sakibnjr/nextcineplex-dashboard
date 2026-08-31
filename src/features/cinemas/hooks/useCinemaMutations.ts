import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CINEMAS_QUERY_KEY });
    },
  });
};

export const useUpdateCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: CinemaUpdate }) =>
      updateCinema(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CINEMAS_QUERY_KEY });
    },
  });
};

export const useDeleteCinema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCinema(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CINEMAS_QUERY_KEY });
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
    },
  });
};
