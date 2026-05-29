/**
 * ⚠️ 임시 컬러 토큰 (LOCAL).
 * 팀원이 공식 컬러 테마(`@/constants/colors`)를 머지하면,
 * 이 파일을 제거하고 모든 import 경로를 `@/constants/colors`로 일괄 치환하세요.
 */
export const COLORS = {
  background: '#F8F4EC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1ECE2',

  primary: '#A8C99E',
  primaryPressed: '#8FB785',

  accent: '#F9E8B0',
  accentText: '#7A5A1E',

  textPrimary: '#1F1F1F',
  textSecondary: '#5C5C5C',
  textMuted: '#9A9A9A',
  textOnPrimary: '#1F1F1F',

  border: '#E5E0D6',
  divider: '#EFEAE0',

  overlayDim: 'rgba(0, 0, 0, 0.35)',
  overlayStrong: 'rgba(0, 0, 0, 0.55)',

  tagPin: '#FFFFFF',
  tagLabelBg: '#FFFFFF',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof COLORS;
