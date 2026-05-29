import { ProductSortType } from '@/@types/product';

/**
 * React Query 키 팩토리.
 * 키 구조 변경 시 이 파일만 수정하면 됨.
 */
export const queryKeys = {
  feed: ['feed'] as const,
  productsByKeyword: (keyword: string, sort: ProductSortType) =>
    ['products', keyword, sort] as const,
  productDetail: (id: string) => ['product', id] as const,
  productSearch: (query: string) => ['products', 'search', query] as const,
};
