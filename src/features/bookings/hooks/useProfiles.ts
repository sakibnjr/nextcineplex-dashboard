import { useQuery } from '@tanstack/react-query';
import { getProfiles } from '../api/bookingsApi';

export const PROFILES_QUERY_KEY = ['profiles'] as const;

export const useProfiles = () => {
  return useQuery({
    queryKey: PROFILES_QUERY_KEY,
    queryFn: getProfiles,
    staleTime: 1000 * 60 * 5,
  });
};
