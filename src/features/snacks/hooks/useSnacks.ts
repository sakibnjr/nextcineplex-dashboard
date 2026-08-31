import { useQuery } from '@tanstack/react-query';
import { getSnacks } from '../api/snacksApi';

export const SNACKS_QUERY_KEY = ['snacks'] as const;

export const useSnacks = () => {
  return useQuery({
    queryKey: SNACKS_QUERY_KEY,
    queryFn: getSnacks,
    staleTime: 1000 * 60 * 5,
  });
};
