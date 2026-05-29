import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/services/api/productApi';
import { queryKeys } from '@/services/queryKeys';

/**
 * 디바운스된 키워드로 상품 검색.
 * 빈 문자열이면 호출 안 함.
 */
export function useProductSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.productSearch(query),
    queryFn: () => searchProducts(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 30,
  });
}
