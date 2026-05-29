import { useState, useMemo, useEffect } from 'react';
import { IProduct, SortOption, IFilterState } from '../types';

export const MOCK_PRODUCTS: IProduct[] = [
  {
    id: '1',
    title: '철원 최고의 냉이 농장에서 자란 봄동',
    pricePer100g: 1000,
    tags: ['공구 진행중', '최소 500g', 'GAP 인증'],
    isGroupPurchase: true,
    distance: 0.8,
    participantsCount: 25,
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    title: '유기농 스마트팜 봄동',
    pricePer100g: 1200,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 1.5,
    participantsCount: 8,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    title: '충남 서산 황토 봄동',
    pricePer100g: 1100,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.3,
    participantsCount: 12,
    image: 'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    title: '신선한 홍성 봄동',
    pricePer100g: 980,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 3.1,
    participantsCount: 5,
    image: 'https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    title: '산지직송 무농약 해남 봄동',
    pricePer100g: 850,
    tags: ['공구 예정', '최소 1kg'],
    isGroupPurchase: false,
    distance: 4.5,
    participantsCount: 0,
    image: 'https://images.unsplash.com/photo-1628773822503-930a8589c09c?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '6',
    title: '경북 칠곡 봄동 (당도 보장)',
    pricePer100g: 1300,
    tags: ['공구 진행중', '최소 300g', '친환경'],
    isGroupPurchase: true,
    distance: 1.2,
    participantsCount: 19,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '7',
    title: '강원 횡성 맑은골 봄동',
    pricePer100g: 1050,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 5.2,
    participantsCount: 3,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '8',
    title: '나주 평야 달콤 봄동',
    pricePer100g: 950,
    tags: ['공구 마감', '최소 1kg'],
    isGroupPurchase: false,
    distance: 3.8,
    participantsCount: 30,
    image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '9',
    title: '청주 시설재배 꿀봄동',
    pricePer100g: 1150,
    tags: ['공구 진행중', '최소 400g'],
    isGroupPurchase: true,
    distance: 0.5,
    participantsCount: 14,
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '10',
    title: '제주도 구좌읍 노지 봄동',
    pricePer100g: 1400,
    tags: ['공구 진행중', '최소 1kg', '제주산'],
    isGroupPurchase: true,
    distance: 8.4,
    participantsCount: 22,
    image: 'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=500&auto=format&fit=crop&q=80',
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
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '12',
    title: '여주 도자기마을 근처 봄동',
    pricePer100g: 1080,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.7,
    participantsCount: 7,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '13',
    title: '김제 지평선 아삭 봄동',
    pricePer100g: 900,
    tags: ['공구 예정', '최소 800g'],
    isGroupPurchase: false,
    distance: 4.2,
    participantsCount: 0,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '14',
    title: '부안 바닷바람 맞은 봄동',
    pricePer100g: 1250,
    tags: ['공구 진행중', '최소 500g', '해풍재배'],
    isGroupPurchase: true,
    distance: 3.5,
    participantsCount: 16,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '15',
    title: '밀양 햇살 가득 봄동',
    pricePer100g: 1020,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 1.9,
    participantsCount: 4,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '16',
    title: '성주 참외밭 옆 봄동',
    pricePer100g: 1120,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.1,
    participantsCount: 9,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '17',
    title: '진도 신선 울돌목 봄동',
    pricePer100g: 920,
    tags: ['공구 진행중', '최소 600g'],
    isGroupPurchase: true,
    distance: 7.2,
    participantsCount: 13,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '18',
    title: '순천만 유기농 벌판 봄동',
    pricePer100g: 1350,
    tags: ['공구 진행중', '최소 300g'],
    isGroupPurchase: true,
    distance: 0.9,
    participantsCount: 20,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '19',
    title: '영광 굴비마을 봄동 야채',
    pricePer100g: 880,
    tags: ['공구 예정'],
    isGroupPurchase: false,
    distance: 5.8,
    participantsCount: 0,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '20',
    title: '고창 선운산 자락 봄동',
    pricePer100g: 1070,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 4.8,
    participantsCount: 6,
    image: require('@/assets/images/bomdong_fresh.png'),
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
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '22',
    title: '광양 평화로운 농원 봄동',
    pricePer100g: 1180,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 1.8,
    participantsCount: 5,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '23',
    title: '보성 녹차밭 기운 봄동',
    pricePer100g: 1220,
    tags: ['공구 진행중', '최소 400g'],
    isGroupPurchase: true,
    distance: 2.5,
    participantsCount: 11,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '24',
    title: '진안 고원 고랭지 봄동',
    pricePer100g: 1290,
    tags: ['공구 예정'],
    isGroupPurchase: false,
    distance: 6.5,
    participantsCount: 0,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '25',
    title: '장흥 버섯마을 촉촉 봄동',
    pricePer100g: 1010,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.0,
    participantsCount: 17,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '26',
    title: '완도 전복바다 해풍 봄동',
    pricePer100g: 1130,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 9.0,
    participantsCount: 14,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '27',
    title: '무안 양파밭 옆 황토 봄동',
    pricePer100g: 940,
    tags: ['공구 진행중', '최소 700g'],
    isGroupPurchase: true,
    distance: 3.9,
    participantsCount: 21,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '28',
    title: '화순 평온한 시골 봄동',
    pricePer100g: 1040,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.4,
    participantsCount: 2,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '29',
    title: '담양 대나무숲 맑은 봄동',
    pricePer100g: 1280,
    tags: ['공구 마감'],
    isGroupPurchase: false,
    distance: 1.3,
    participantsCount: 25,
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '30',
    title: '곡성 장미정원 근처 봄동',
    pricePer100g: 1060,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 4.1,
    participantsCount: 7,
    image: require('@/assets/images/bomdong_fresh.png'),
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
    image: require('@/assets/images/bomdong_fresh.png'),
  },
  {
    id: '32',
    title: '하동 섬진강 모래뜰 봄동',
    pricePer100g: 990,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 5.0,
    participantsCount: 9,
    image: require('../../../assets/images/bomdong_fresh.png'),
  },
  {
    id: '33',
    title: '산청 허브농원 웰빙 봄동',
    pricePer100g: 1240,
    tags: ['공구 예정'],
    isGroupPurchase: false,
    distance: 4.7,
    participantsCount: 0,
    image: require('../../../assets/images/bomdong_fresh.png'),
  },
  {
    id: '34',
    title: '함양 상림공원 이웃 봄동',
    pricePer100g: 1030,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 2.8,
    participantsCount: 6,
    image: require('../../../assets/images/bomdong_fresh.png'),
  },
  {
    id: '35',
    title: '거창 덕유산 신선 봄동',
    pricePer100g: 1110,
    tags: ['공구 진행중', '최소 500g'],
    isGroupPurchase: true,
    distance: 6.0,
    participantsCount: 12,
    image: require('../../../assets/images/bomdong_fresh.png'),
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
