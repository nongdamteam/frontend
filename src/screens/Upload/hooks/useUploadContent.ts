import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadPayload } from '@/@types/upload';
import { uploadContent } from '@/services/api/uploadApi';
import { queryKeys } from '@/services/queryKeys';

/**
 * 콘텐츠 업로드 mutation.
 * 성공 시 피드 query 무효화 → 다시 호출하면 새 콘텐츠 반영 (실제 API 도입 후 의미 있음).
 */
export function useUploadContent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UploadPayload) => uploadContent(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.feed });
    },
  });
}
