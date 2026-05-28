import { FeedItem } from '@/@types/feed';
import { FEED_MOCK } from '@/assets/mock/feed';
import { mockResolve } from './client';

/**
 * 피드 목록 조회.
 * TODO: 실제 API 연동 시 apiClient.get('/feed') 형태로 교체.
 */
export function fetchFeed(): Promise<FeedItem[]> {
  return mockResolve(FEED_MOCK);
}
