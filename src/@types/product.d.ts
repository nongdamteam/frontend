export type ProductSortType =
  | 'distance'
  | 'priceLow'
  | 'priceHigh'
  | 'reviewCount'
  | 'rating';

export interface ProductBadge {
  /** 'groupbuy' | 'minQuantity' | 'gap' 등 식별자 */
  id: string;
  label: string;
}

export interface ProductListItem {
  id: string;
  /** 검색 키워드 (태그와 매칭) */
  keyword: string;
  name: string;
  thumbnailUrl?: string;
  /** 단위(예: 100g) */
  unit: string;
  /** 단위당 가격 (원) */
  pricePerUnit: number;
  /** 평점 (0~5) */
  rating: number;
  reviewCount: number;
  /** 사용자 위치로부터의 거리 (km) */
  distanceKm: number;
  badges: ProductBadge[];
}

export interface ProductDetail extends ProductListItem {
  /** 상세 이미지 URL 목록 */
  images: string[];
  /** "5일 전에는 100g당 1,500원이었어요!" 같은 가격 변동 안내 */
  priceHistoryNote?: string;
}
