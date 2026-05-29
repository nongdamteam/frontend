import { MediaType } from './feed';

/**
 * 업로드 플로우의 현재 단계.
 * - media: 1단계 (미디어 선택)
 * - detail: 2단계 (캡션/태그/공개설정)
 * - position: 4단계 (태그 위치 지정)
 *   (3단계는 detail 위에 띄우는 검색 모달이라 별도 step 아님)
 */
export type UploadStep = 'media' | 'detail' | 'position';

/**
 * 사용자가 갤러리/촬영으로 선택한 미디어.
 */
export interface SelectedMedia {
  type: MediaType;
  /** 로컬 파일 URI (file://) */
  uri: string;
  /** 원본 크기 (좌표 비율 계산용) */
  width: number;
  height: number;
  /** 영상의 경우 길이(ms) */
  durationMs?: number;
}

/**
 * 좌표 (콘텐츠 영역 기준 0~1 비율).
 * FeedTag.x, y 와 동일한 단위.
 */
export interface TagPosition {
  x: number;
  y: number;
}

/**
 * 업로드 준비 중인 태그.
 * - 검색 모달에서 상품을 선택하면 position: null 상태로 추가됨
 * - 사용자가 캔버스에서 위치를 찍으면 position 채워짐
 */
export interface PendingTag {
  /** 임시 식별자 (uuid) */
  id: string;
  /** 검색 키워드 (FeedTag.keyword 와 매칭) */
  keyword: string;
  /** 라벨에 표시할 상품명 */
  label: string;
  /** 라벨 썸네일 (검색 결과에서 가져옴) */
  thumbnailUrl?: string;
  /** 평균 가격 (라벨 표시용) */
  averagePrice: number;
  /** 위치 미지정 시 null */
  position: TagPosition | null;
}

/**
 * 공개 설정.
 */
export interface UploadPrivacy {
  /** 공개 여부 (false면 비공개) */
  isPublic: boolean;
  /** 댓글 허용 여부 */
  allowComments: boolean;
  /** 좋아요 수 숨김 여부 */
  hideLikes: boolean;
}

/**
 * 업로드 임시 저장 데이터 (시트 라이프사이클 동안만 유지).
 */
export interface UploadDraft {
  media: SelectedMedia | null;
  caption: string;
  tags: PendingTag[];
  privacy: UploadPrivacy;
}

/**
 * 실제 서버로 전송할 payload.
 * (이번 PR에선 mock 핸들러만 받지만 미리 정의)
 */
export interface UploadPayload {
  mediaType: MediaType;
  mediaUri: string;
  caption: string;
  tags: Array<{
    keyword: string;
    label: string;
    averagePrice: number;
    x: number;
    y: number;
  }>;
  privacy: UploadPrivacy;
}

/**
 * 갤러리 미디어 항목 (GalleryGrid 에서 표시용).
 */
export interface GalleryItem {
  id: string;
  type: MediaType;
  uri: string;
  thumbnailUri: string;
  width: number;
  height: number;
  durationMs?: number;
}

/**
 * 최근 검색 키워드.
 */
export interface RecentSearch {
  keyword: string;
  searchedAt: number;
}
