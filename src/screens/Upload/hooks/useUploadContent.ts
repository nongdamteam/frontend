import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedItem } from '@/@types/feed';
import { UploadPayload } from '@/@types/upload';
import { uploadContent } from '@/services/api/uploadApi';
import { queryKeys } from '@/services/queryKeys';
import { payloadToFeedItem } from '../utils/payloadToFeedItem';

/**
 * 콘텐츠 업로드 mutation.
 * 성공 시 React Query 캐시의 피드 최상단에 새 콘텐츠를 추가한다.
 * - 메모리에만 존재 → 앱 재시작하면 사라짐 (mock 단계 한정)
 * - 실제 서버 도입 시 invalidate로 교체.
 */
export function useUploadContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadPayload) => uploadContent(payload),
    onSuccess: (result, payload) => {
      const newItem = payloadToFeedItem(payload, result.contentId);
      qc.setQueryData<FeedItem[]>(queryKeys.feed, prev => {
        if (!prev) return [newItem];
        // 중복 방지 (혹시 같은 contentId 들어오면 교체)
        const filtered = prev.filter(p => p.id !== newItem.id);
        return [newItem, ...filtered];
      });
    },
  });
}
