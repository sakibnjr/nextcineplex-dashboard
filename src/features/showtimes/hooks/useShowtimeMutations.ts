import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createShowtime,
  updateShowtime,
  updateShowtimeStatus,
  deleteShowtime,
} from '../api/showtimesApi';
import { SHOWTIMES_QUERY_KEY } from './useShowtimes';
import type {
  ShowtimeInsert,
  ShowtimeUpdate,
  ShowtimeStatus,
} from '../../../types';

export const useCreateShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newShowtime: ShowtimeInsert) => createShowtime(newShowtime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOWTIMES_QUERY_KEY });
    },
  });
};

export const useUpdateShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: ShowtimeUpdate;
    }) => updateShowtime(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOWTIMES_QUERY_KEY });
    },
  });
};

export const useUpdateShowtimeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ShowtimeStatus;
    }) => updateShowtimeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOWTIMES_QUERY_KEY });
    },
  });
};

export const useDeleteShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShowtime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOWTIMES_QUERY_KEY });
    },
  });
};
