import axios from 'axios';

/**
 * 공통 axios 인스턴스.
 * 현재는 mock 데이터 사용 중이라 baseURL은 임시값.
 * 실제 API 연동 시 환경 변수 또는 설정 파일에서 주입.
 */
export const apiClient = axios.create({
  baseURL: 'https://api.placeholder.local',
  timeout: 10000,
});

/** 목업 응답을 비동기로 흉내 내는 헬퍼 (네트워크 지연 시뮬레이션) */
export function mockResolve<T>(data: T, delay = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
}
