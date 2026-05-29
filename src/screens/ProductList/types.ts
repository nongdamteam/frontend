import { ImageSourcePropType } from 'react-native';

export interface IProduct {
  id: string;
  title: string;
  pricePer100g: number;          // 100g당 가격 (예: 1000)
  tags: string[];                // 뱃지용 태그들 (예: ['공구 진행중', '최소 500g', 'GAP 인증'])
  isGroupPurchase: boolean;      // 공구 진행 여부
  distance: number;              // 내 주변 거리 (단위: km)
  participantsCount: number;     // 공구 참여자 수
  image: ImageSourcePropType;    // 상품 이미지 소스
  images?: any[];                // 상품 상세 캐러셀 이미지 배열
}

export type SortOption = 'distance' | 'price' | 'participants' | 'none';

export interface IFilterState {
  searchQuery: string;
  sortOption: SortOption;
  isGroupPurchaseOnly: boolean;
}
