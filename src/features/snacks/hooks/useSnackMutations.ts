import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
      toast.success(`Menu item "${data.name}" added!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add menu item');
    },
  });
};

export const useUpdateSnack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: SnackUpdate }) =>
      updateSnack(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
      toast.success(`Menu item "${data.name}" updated!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update menu item');
    },
  });
};

export const useToggleSnackAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_available }: { id: string; is_available: boolean }) =>
      toggleSnackAvailability(id, is_available),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
      toast.success(`"${data.name}" marked as ${data.is_available ? 'In Stock' : 'Sold Out'}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update availability');
    },
  });
};

export const useDeleteSnack = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSnack(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACKS_QUERY_KEY });
      toast.success('Menu item deleted.');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete menu item');
    },
  });
};

export const useCreateSnackOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSnackOrderPayload) => createSnackOrder(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SNACK_ORDERS_QUERY_KEY });
      toast.success(`Concession order ${data.order_code} placed successfully!`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create concession order');
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SNACK_ORDERS_QUERY_KEY });
      toast.success(`Concession order marked as ${variables.status}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update order status');
    },
  });
};

export const useDeleteSnackOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSnackOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SNACK_ORDERS_QUERY_KEY });
      toast.success('Concession order removed.');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete order');
    },
  });
};
