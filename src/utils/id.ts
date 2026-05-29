/**
 * 짧은 유니크 ID 생성 (uuid 미사용 — 로컬 임시 식별자 용도).
 * 충돌 가능성은 낮으며, draft 라이프사이클 동안만 유효.
 */
export function createTempId(prefix = 'tmp'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
