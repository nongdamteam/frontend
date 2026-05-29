import { UploadDraft, UploadPayload } from '@/@types/upload';

/**
 * UploadDraft (UI 상태) → UploadPayload (서버 전송 형태) 변환.
 * - 미디어/위치 미지정 태그가 있으면 throw (호출 전에 canSubmit 체크 필수)
 * - position이 null인 태그는 필터링됨
 */
export function buildUploadPayload(draft: UploadDraft): UploadPayload {
  if (!draft.media) {
    throw new Error('미디어가 선택되지 않았습니다.');
  }

  const isVideo = draft.media.type === 'video';
  // 영상: 모든 태그 포함 (좌표 없음)
  // 이미지: 위치 지정된 태그만 포함
  const validTags = isVideo
    ? draft.tags
    : draft.tags.filter(t => t.position != null);

  return {
    mediaType: draft.media.type,
    mediaUri: draft.media.uri,
    caption: draft.caption.trim(),
    tags: validTags.map(t => ({
      keyword: t.keyword,
      label: t.label,
      averagePrice: t.averagePrice,
      thumbnailUrl: t.thumbnailUrl,
      x: t.position?.x ?? 0,
      y: t.position?.y ?? 0,
    })),
    privacy: draft.privacy,
  };
}
