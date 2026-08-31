import { useQuery } from '@tanstack/react-query';
import { getSnackOrders } from '../api/snacksApi';

export const SNACK_ORDERS_QUERY_KEY = ['snack-orders'] as const;

export const useSnackOrders = () => {
  return useQuery({
    queryKey: SNACK_ORDERS_QUERY_KEY,
    queryFn: getSnackOrders,
    staleTime: 1000 * 60 * 2,
  });
};
