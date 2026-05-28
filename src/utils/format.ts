/** 1234567 → "1,234,567원" */
export function formatPrice(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}

/** 1234567 → "1,234,567" (단위 없이) */
export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR');
}

/** 2.4 → "2.4km", 18.345 → "18.3km" */
export function formatDistance(km: number): string {
  return `${km.toFixed(1)}km`;
}

/** 4.567 → "4.6" */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
