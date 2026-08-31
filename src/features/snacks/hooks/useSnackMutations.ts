import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createSnack,
  updateSnack,
  toggleSnackAvailability,
  deleteSnack,
  createSnackOrder,
  updateSnackOrderStatus,
  deleteSnackOrder,
} from '../api/snacksApi';
import { SNACKS_QUERY_KEY } from './useSnacks';
import { SNACK_ORDERS_QUERY_KEY } from './useSnackOrders';
import type {
  SnackInsert,
  SnackUpdate,
  SnackOrderStatus,
  CreateSnackOrderPayload,
} from '../../../types';

export const useCreateSnack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSnack: SnackInsert) => createSnack(newSnack),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
    },
  });
};

export const useUpdateSnack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SnackUpdate }) =>
      updateSnack(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
    },
  });
};

export const useToggleSnackAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_available }: { id: string; is_available: boolean }) =>
      toggleSnackAvailability(id, is_available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
    },
  });
};

export const useDeleteSnack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSnack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
    },
  });
};

export const useCreateSnackOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSnackOrderPayload) => createSnackOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACK_ORDERS_QUERY_KEY });
    },
  });
};

export const useUpdateSnackOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: SnackOrderStatus;
    }) => updateSnackOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACK_ORDERS_QUERY_KEY });
    },
  });
};

export const useDeleteSnackOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSnackOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACK_ORDERS_QUERY_KEY });
    },
  });
};
