import { FeedItem } from '@/@types/feed';
import feedMock from '@/assets/mock/feed.json';
import { mockResolve } from './client';

/**
 * 피드 목록 조회.
 * TODO: 실제 API 연동 시 apiClient.get('/feed') 형태로 교체.
 */
export function fetchFeed(): Promise<FeedItem[]> {
  return mockResolve(feedMock as FeedItem[]);
}
