import { ProductDetail, ProductListItem, ProductSortType } from '@/@types/product';
import { PRODUCTS_MOCK } from '@/assets/mock/products';
import { mockResolve } from './client';

const ALL_PRODUCTS = PRODUCTS_MOCK;

function sortProducts(
  list: ProductListItem[],
  sort: ProductSortType,
): ProductListItem[] {
  const copy = [...list];
  switch (sort) {
    case 'distance':
      return copy.sort((a, b) => a.distanceKm - b.distanceKm);
    case 'priceLow':
      return copy.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    case 'priceHigh':
      return copy.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    case 'reviewCount':
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'rating':
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy;
  }
}

/**
 * 키워드로 상품 목록 조회 + 정렬.
 * TODO: apiClient.get('/products', { params: { keyword, sort } }) 로 교체.
 */
export function fetchProductsByKeyword(
  keyword: string,
  sort: ProductSortType = 'distance',
): Promise<ProductListItem[]> {
  const filtered = ALL_PRODUCTS.filter(p => p.keyword === keyword);
  return mockResolve(sortProducts(filtered, sort));
}

/**
 * 상품 상세 조회.
 * TODO: apiClient.get(`/products/${id}`) 로 교체.
 */
export function fetchProductDetail(id: string): Promise<ProductDetail> {
  const found = ALL_PRODUCTS.find(p => p.id === id);
  if (!found) {
    return Promise.reject(new Error(`Product not found: ${id}`));
  }
  return mockResolve(found);
}
