import { useQuery } from '@tanstack/react-query';
import { fetchFeed } from '@/services/api/feedApi';
import { queryKeys } from '@/services/queryKeys';

export function useBabsFeed() {
  return useQuery({
    queryKey: queryKeys.feed,
    queryFn: fetchFeed,
    staleTime: 1000 * 60,
  });
}
