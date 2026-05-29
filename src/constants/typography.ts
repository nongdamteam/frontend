import { TextStyle } from 'react-native';

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const TYPOGRAPHY = {
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: FONT_WEIGHT.bold,
  },
  heading2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: FONT_WEIGHT.semibold,
  },
  heading3: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: FONT_WEIGHT.semibold,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: FONT_WEIGHT.regular,
  },
  bodyStrong: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: FONT_WEIGHT.semibold,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FONT_WEIGHT.regular,
  },
  captionStrong: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: FONT_WEIGHT.semibold,
  },
  priceLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: FONT_WEIGHT.bold,
  },
  priceSmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: FONT_WEIGHT.semibold,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: FONT_WEIGHT.semibold,
  },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof TYPOGRAPHY;
