import { useMemo } from 'react';
import { useUploadContext } from '../context/UploadContext';

/**
 * 업로드 가능 여부 판정 헬퍼.
 * - 미디어가 선택되어 있는지
 * - 모든 태그가 위치 지정 완료됐는지
 */
export function useUploadDraft() {
  const ctx = useUploadContext();

  const derived = useMemo(() => {
    const hasMedia = ctx.draft.media != null;
    const pendingTags = ctx.draft.tags.filter(t => t.position == null);
    const placedTags = ctx.draft.tags.filter(t => t.position != null);

    return {
      hasMedia,
      pendingTags,
      placedTags,
      hasPendingTags: pendingTags.length > 0,
      canProceedToDetail: hasMedia,
      canSubmit: hasMedia && pendingTags.length === 0,
    };
  }, [ctx.draft.media, ctx.draft.tags]);

  return { ...ctx, ...derived };
}
