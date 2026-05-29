import { UploadPayload } from '@/@types/upload';
import { mockResolve } from './client';

export interface UploadResult {
  contentId: string;
}

/**
 * 콘텐츠 업로드.
 * 현재는 mock — 800ms 대기 후 가짜 contentId 반환.
 * TODO: 실제 연동 시 FormData 생성 + apiClient.post('/contents', formData).
 */
export function uploadContent(payload: UploadPayload): Promise<UploadResult> {
  console.log('[uploadContent] payload:', payload);
  return mockResolve(
    { contentId: `c_${Date.now().toString(36)}` },
    800,
  );
}
