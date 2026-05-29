import { useQuery } from '@tanstack/react-query';
import { ProductSortType } from '@/@types/product';
import { fetchProductsByKeyword } from '@/services/api/productApi';
import { queryKeys } from '@/services/queryKeys';

export function useProductList(keyword: string, sort: ProductSortType) {
  return useQuery({
    queryKey: queryKeys.productsByKeyword(keyword, sort),
    queryFn: () => fetchProductsByKeyword(keyword, sort),
    enabled: !!keyword,
  });
}
