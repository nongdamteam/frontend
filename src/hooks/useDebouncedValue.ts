import { useEffect, useState } from 'react';

/**
 * 입력값이 일정 시간 동안 변하지 않으면 그 값을 반환.
 * 검색 입력처럼 매 키 입력마다 API 호출하기 싫을 때 사용.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
