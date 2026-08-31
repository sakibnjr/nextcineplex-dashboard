import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
      toast.success('Movie screening scheduled successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to schedule screening');
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
      toast.success('Screening details updated!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update screening');
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SHOWTIMES_QUERY_KEY });
      toast.success(`Screening marked as ${variables.status}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update status');
    },
  });
};

export const useDeleteShowtime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteShowtime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOWTIMES_QUERY_KEY });
      toast.success('Screening slot removed.');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete screening');
    },
  });
};
