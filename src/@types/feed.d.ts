export type MediaType = 'video' | 'image';

/**
 * 콘텐츠 위에 표시되는 상품 태그.
 * x, y는 콘텐츠 영역 기준 0~1 비율 좌표 (좌상단 0,0).
 */
export interface FeedTag {
  id: string;
  /** 상품 검색 키워드 (예: '봄동', '참기름') */
  keyword: string;
  /** 라벨에 표시할 대표 상품명 (예: '봄동 300g') */
  label: string;
  /** 라벨에 표시할 평균 가격 (원 단위) */
  averagePrice: number;
  /** 라벨 썸네일 이미지 URL (옵션) */
  thumbnailUrl?: string;
  x: number;
  y: number;
}

export interface FeedItem {
  id: string;
  type: MediaType;
  /** 영상 또는 이미지 URL */
  mediaUrl: string;
  /** 영상의 경우 포스터/썸네일 (선택) */
  posterUrl?: string;
  /** 작성자/농장 이름 */
  authorName: string;
  /** 본문 캡션 */
  caption?: string;
  /** 좋아요 / 댓글 수 (사이드 액션용) */
  likeCount: number;
  commentCount: number;
  /** 콘텐츠 위 태그 목록 */
  tags: FeedTag[];
}
