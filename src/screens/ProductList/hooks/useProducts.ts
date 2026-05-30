import { useState, useMemo, useEffect } from 'react';
import { IProduct, SortOption, IFilterState } from '../types';

const BOMDONG_IMAGES_1 = [
  require('@/assets/images/products/prod_001.png'),
  'https://images.unsplash.com/photo-1628773822503-930a8589c017?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587334206506-697678d49127?w=800&auto=format&fit=crop&q=80',
];

const BOMDONG_IMAGES_2 = [
  require('@/assets/images/products/prod_002.png'),
  'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=800&auto=format&fit=crop&q=80',
];

const BOMDONG_IMAGES_3 = [
  require('@/assets/images/products/prod_003.png'),
  require('@/assets/images/bomdong_fresh.png'),
  'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=80',
];

const BOMDONG_IMAGES_4 = [
  require('@/assets/images/products/prod_004.png'),
  require('@/assets/images/bomdong_fresh.png'),
  'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=800&auto=format&fit=crop&q=80',
];

const NAENGI_IMAGES_1 = [
  require('@/assets/images/products/prod_naengi_1.png'),
  require('@/assets/images/products/prod_naengi_2.png'),
  require('@/assets/images/tags/naengi.png'),
];

const NAENGI_IMAGES_2 = [
  require('@/assets/images/products/prod_naengi_2.png'),
  require('@/assets/images/products/prod_naengi_1.png'),
  require('@/assets/images/tags/naengi.png'),
];

const BANGPUNG_IMAGES = [
  require('@/assets/images/products/prod_bangpung_1.png'),
  require('@/assets/images/products/prod_bangpung_2.png'),
  require('@/assets/images/feed/eco_vegetables.png'),
];

const SESAME_IMAGES = [
  require('@/assets/images/products/prod_101.png'),
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&auto=format&fit=crop&q=80',
];

const KOCHUJANG_IMAGES = [
  require('@/assets/images/products/prod_201.png'),
  'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618414503926-2eed7b3c25b6?w=800&auto=format&fit=crop&q=80',
];

export const MOCK_PRODUCTS: IProduct[] = [
  {
    id: '1',
    title: '철원 최고의 냉이 농장에서 자란 봄동',
    pricePer100g: 1000,
    tags: ['공구 진행중', '최소 500g', 'GAP 인증'],
    isGroupPurchase: true,
    distance: 0.8,
    participantsCount: 25,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
    timeRemaining: '08:10:02 남음',
    timeInSeconds: 29402,
  },
  {
    id: '2',
    title: '유기농 스마트팜 봄동',
    pricePer100g: 1200,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 1.5,
    participantsCount: 8,
    image: BOMDONG_IMAGES_2[0],
    images: BOMDONG_IMAGES_2,
    timeRemaining: '05:30:15 남음',
    timeInSeconds: 19815,
  },
  {
    id: '3',
    title: '충남 서산 황토 봄동',
    pricePer100g: 1100,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.3,
    participantsCount: 12,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
    timeRemaining: '12:15:00 남음',
    timeInSeconds: 44100,
  },
  {
    id: '4',
    title: '신선한 홍성 봄동',
    pricePer100g: 980,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 3.1,
    participantsCount: 5,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
    timeRemaining: '02:45:10 남음',
    timeInSeconds: 9910,
  },
  {
    id: '5',
    title: '산지직송 무농약 해남 봄동',
    pricePer100g: 850,
    tags: ['공구 예정', '최소 1kg'],
    isGroupPurchase: false,
    distance: 4.5,
    participantsCount: 0,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
  },
  {
    id: '6',
    title: '여수 돌산 무농약 방풍나물 300g',
    pricePer100g: 1600,
    tags: ['공구 진행중', '무농약', '산지직송'],
    isGroupPurchase: true,
    distance: 1.2,
    participantsCount: 19,
    image: BANGPUNG_IMAGES[0],
    images: BANGPUNG_IMAGES,
    timeRemaining: '23:59:59 남음',
    timeInSeconds: 86399,
  },
  {
    id: '7',
    title: '철원 노지 향긋한 냉이 300g',
    pricePer100g: 1930,
    tags: ['공구 진행중', '향 진함', '당일 수확'],
    isGroupPurchase: true,
    distance: 5.2,
    participantsCount: 3,
    image: NAENGI_IMAGES_1[0],
    images: NAENGI_IMAGES_1,
    timeRemaining: '01:10:00 남음',
    timeInSeconds: 4200,
  },
  {
    id: '8',
    title: '나주 평야 달콤 봄동',
    pricePer100g: 950,
    tags: ['공구 마감', '최소 1kg'],
    isGroupPurchase: false,
    distance: 3.8,
    participantsCount: 30,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
  },
  {
    id: '9',
    title: '청주 시설재배 꿀봄동',
    pricePer100g: 1150,
    tags: ['공구 진행중', '최소 400g'],
    isGroupPurchase: true,
    distance: 0.5,
    participantsCount: 14,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
    timeRemaining: '09:05:30 남음',
    timeInSeconds: 32730,
  },
  {
    id: '10',
    title: '서산 황토밭 캐낸 생 냉이 300g',
    pricePer100g: 1800,
    tags: ['공구 진행중', '인기 폭발', 'GAP 인증'],
    isGroupPurchase: true,
    distance: 8.4,
    participantsCount: 27,
    image: NAENGI_IMAGES_2[0],
    images: NAENGI_IMAGES_2,
    timeRemaining: '18:40:22 남음',
    timeInSeconds: 67222,
  },
  // 2페이지용 데이터
  {
    id: '11',
    title: '안동 하회마을 봄동 농가',
    pricePer100g: 990,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 6.1,
    participantsCount: 11,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
    timeRemaining: '06:15:00 남음',
    timeInSeconds: 22500,
  },
  {
    id: '12',
    title: '여주 도자기마을 근처 봄동',
    pricePer100g: 1080,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.7,
    participantsCount: 7,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
    timeRemaining: '15:20:00 남음',
    timeInSeconds: 55200,
  },
  {
    id: '13',
    title: '김제 지평선 아삭 봄동',
    pricePer100g: 900,
    tags: ['공구 예정', '최소 800g'],
    isGroupPurchase: false,
    distance: 4.2,
    participantsCount: 0,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
  },
  {
    id: '14',
    title: '부안 바닷바람 맞은 봄동',
    pricePer100g: 1250,
    tags: ['공구 진행중', '최소 500g', '해풍재배'],
    isGroupPurchase: true,
    distance: 3.5,
    participantsCount: 16,
    image: BOMDONG_IMAGES_2[0],
    images: BOMDONG_IMAGES_2,
    timeRemaining: '04:10:00 남음',
    timeInSeconds: 15000,
  },
  {
    id: '15',
    title: '밀양 햇살 가득 봄동',
    pricePer100g: 1020,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 1.9,
    participantsCount: 4,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
    timeRemaining: '10:50:00 남음',
    timeInSeconds: 39000,
  },
  {
    id: '16',
    title: '성주 참외밭 옆 봄동',
    pricePer100g: 1120,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.1,
    participantsCount: 9,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
    timeRemaining: '11:30:00 남음',
    timeInSeconds: 41400,
  },
  {
    id: '17',
    title: '진도 신선 울돌목 봄동',
    pricePer100g: 920,
    tags: ['공구 진행중', '최소 600g'],
    isGroupPurchase: true,
    distance: 7.2,
    participantsCount: 13,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
    timeRemaining: '07:45:00 남음',
    timeInSeconds: 27900,
  },
  {
    id: '18',
    title: '순천만 유기농 벌판 봄동',
    pricePer100g: 1350,
    tags: ['공구 진행중', '최소 300g'],
    isGroupPurchase: true,
    distance: 0.9,
    participantsCount: 20,
    image: BOMDONG_IMAGES_2[0],
    images: BOMDONG_IMAGES_2,
    timeRemaining: '03:15:00 남음',
    timeInSeconds: 11700,
  },
  {
    id: '19',
    title: '영광 굴비마을 봄동 야채',
    pricePer100g: 880,
    tags: ['공구 예정'],
    isGroupPurchase: false,
    distance: 5.8,
    participantsCount: 0,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
  },
  {
    id: '20',
    title: '고창 선운산 자락 봄동',
    pricePer100g: 1070,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 4.8,
    participantsCount: 6,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
    timeRemaining: '14:50:00 남음',
    timeInSeconds: 53400,
  },
  // 3페이지용 데이터
  {
    id: '21',
    title: '부여 백마강 이슬 봄동',
    pricePer100g: 970,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 3.3,
    participantsCount: 10,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
    timeRemaining: '08:50:00 남음',
    timeInSeconds: 31800,
  },
  {
    id: '22',
    title: '광양 평화로운 농원 봄동',
    pricePer100g: 1180,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 1.8,
    participantsCount: 5,
    image: BOMDONG_IMAGES_2[0],
    images: BOMDONG_IMAGES_2,
    timeRemaining: '13:10:00 남음',
    timeInSeconds: 47400,
  },
  {
    id: '23',
    title: '보성 녹차밭 기운 봄동',
    pricePer100g: 1220,
    tags: ['공구 진행중', '최소 400g'],
    isGroupPurchase: true,
    distance: 2.5,
    participantsCount: 11,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
    timeRemaining: '05:40:00 남음',
    timeInSeconds: 20400,
  },
  {
    id: '24',
    title: '진안 고원 고랭지 봄동',
    pricePer100g: 1290,
    tags: ['공구 예정'],
    isGroupPurchase: false,
    distance: 6.5,
    participantsCount: 0,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
  },
  {
    id: '25',
    title: '장흥 버섯마을 촉촉 봄동',
    pricePer100g: 1010,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.0,
    participantsCount: 17,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
    timeRemaining: '19:15:00 남음',
    timeInSeconds: 69300,
  },
  {
    id: '26',
    title: '완도 전복바다 해풍 봄동',
    pricePer100g: 1130,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 9.0,
    participantsCount: 14,
    image: BOMDONG_IMAGES_2[0],
    images: BOMDONG_IMAGES_2,
    timeRemaining: '22:30:00 남음',
    timeInSeconds: 81000,
  },
  {
    id: '27',
    title: '무안 양파밭 옆 황토 봄동',
    pricePer100g: 940,
    tags: ['공구 진행중', '최소 700g'],
    isGroupPurchase: true,
    distance: 3.9,
    participantsCount: 21,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
    timeRemaining: '01:50:00 남음',
    timeInSeconds: 6600,
  },
  {
    id: '28',
    title: '화순 평온한 시골 봄동',
    pricePer100g: 1040,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.4,
    participantsCount: 2,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
    timeRemaining: '16:05:00 남음',
    timeInSeconds: 57900,
  },
  {
    id: '29',
    title: '담양 대나무숲 맑은 봄동',
    pricePer100g: 1280,
    tags: ['공구 마감'],
    isGroupPurchase: false,
    distance: 1.3,
    participantsCount: 25,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
  },
  {
    id: '30',
    title: '곡성 장미정원 근처 봄동',
    pricePer100g: 1060,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 4.1,
    participantsCount: 7,
    image: BOMDONG_IMAGES_2[0],
    images: BOMDONG_IMAGES_2,
    timeRemaining: '17:25:00 남음',
    timeInSeconds: 62700,
  },
  // 4페이지용 여분 데이터
  {
    id: '31',
    title: '구례 지리산 약초 봄동',
    pricePer100g: 1190,
    tags: ['공구 진행중', '최소 400g'],
    isGroupPurchase: true,
    distance: 3.0,
    participantsCount: 15,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
    timeRemaining: '20:10:00 남음',
    timeInSeconds: 72600,
  },
  {
    id: '32',
    title: '하동 섬진강 모래뜰 봄동',
    pricePer100g: 990,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 5.0,
    participantsCount: 9,
    image: BOMDONG_IMAGES_4[0],
    images: BOMDONG_IMAGES_4,
    timeRemaining: '11:05:00 남음',
    timeInSeconds: 39900,
  },
  {
    id: '33',
    title: '산청 허브농원 웰빙 봄동',
    pricePer100g: 1240,
    tags: ['공구 예정'],
    isGroupPurchase: false,
    distance: 4.7,
    participantsCount: 0,
    image: BOMDONG_IMAGES_1[0],
    images: BOMDONG_IMAGES_1,
  },
  {
    id: '34',
    title: '함양 상림공원 이웃 봄동',
    pricePer100g: 1030,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.8,
    participantsCount: 6,
    image: BOMDONG_IMAGES_2[0],
    images: BOMDONG_IMAGES_2,
    timeRemaining: '21:40:00 남음',
    timeInSeconds: 78000,
  },
  {
    id: '35',
    title: '거창 덕유산 신선 봄동',
    pricePer100g: 1110,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 6.0,
    participantsCount: 12,
    image: BOMDONG_IMAGES_3[0],
    images: BOMDONG_IMAGES_3,
    timeRemaining: '09:20:00 남음',
    timeInSeconds: 33600,
  },
];

export const ITEMS_PER_PAGE = 10;

export function useProducts(
  initialSearchQuery?: string,
  initialGroupPurchaseOnly?: boolean,
  initialSortOption?: SortOption,
  maxItems?: number,
  customProducts?: IProduct[]
) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [sortOption, setSortOption] = useState<SortOption>(initialSortOption || 'none');
  const [isGroupPurchaseOnly, setIsGroupPurchaseOnly] = useState(initialGroupPurchaseOnly || false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // 필터링 및 정렬 처리
  const filteredAndSortedProducts = useMemo(() => {
    let result = customProducts ? [...customProducts] : [...MOCK_PRODUCTS];

    // 1. 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(query));
    }

    // 2. 공구 여부 필터
    if (isGroupPurchaseOnly) {
      result = result.filter((p) => p.isGroupPurchase);
    }

    // 3. 정렬 필터
    if (sortOption === 'distance') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortOption === 'price') {
      result.sort((a, b) => a.pricePer100g - b.pricePer100g);
    } else if (sortOption === 'participants') {
      result.sort((a, b) => b.participantsCount - a.participantsCount);
    } else if (sortOption === 'none') {
      // 기본 정렬: 공구 시간이 얼마 남지 않은 순서(임박순)로 정렬
      result.sort((a, b) => {
        const aSec = a.timeInSeconds ?? 999999;
        const bSec = b.timeInSeconds ?? 999999;
        return aSec - bSec;
      });
    }

    // If caller requested a maximum number of items (e.g., show top 100), slice here
    if (typeof maxItems === 'number' && maxItems > 0) {
      return result.slice(0, maxItems);
    }

    return result;
  }, [searchQuery, sortOption, isGroupPurchaseOnly]);

  // 페이지네이션 처리
  const totalItems = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  // 현재 페이지에 보여질 상품들
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  // 필터나 검색어가 바뀔 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, isGroupPurchaseOnly]);

  // 페이지 변경 시 부드러운 로딩 효과 적용
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => {
      setIsLoading(false);
    }, 200); // 200ms 로딩 스피너 연출
  };

  return {
    products: currentProducts,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    isGroupPurchaseOnly,
    setIsGroupPurchaseOnly,
    currentPage,
    totalPages,
    isLoading,
    handlePageChange,
    totalItems,
  };
}
