import { useQuery } from '@tanstack/react-query';
import { fetchProductDetail } from '@/services/api/productApi';
import { queryKeys } from '@/services/queryKeys';

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.productDetail(id),
    queryFn: () => fetchProductDetail(id),
    enabled: !!id,
  });
}
