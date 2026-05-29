import { FeedItem, FeedTag } from '@/@types/feed';
import { UploadPayload } from '@/@types/upload';

/**
 * 업로드 성공한 payload를 피드에 즉시 prepend 가능한 FeedItem 형태로 변환.
 * - id는 contentId 그대로 사용
 * - 좋아요/댓글 카운트는 0으로 시작
 * - mediaUrl은 로컬 file:// URI 그대로 (메모리에만 존재)
 */
export function payloadToFeedItem(
  payload: UploadPayload,
  contentId: string,
  authorName = '나',
): FeedItem {
  const tags: FeedTag[] = payload.tags.map((t, idx) => ({
    id: `${contentId}_tag_${idx}`,
    keyword: t.keyword,
    label: t.label,
    averagePrice: t.averagePrice,
    x: t.x,
    y: t.y,
  }));

  return {
    id: contentId,
    type: payload.mediaType,
    mediaUrl: payload.mediaUri,
    authorName,
    caption: payload.caption,
    likeCount: 0,
    commentCount: 0,
    tags,
  };
}
