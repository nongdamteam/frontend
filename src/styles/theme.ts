import {StyleSheet} from 'react-native';

export const colors = {
  background: '#F8F8F6',
  surface: '#FFFFFF',
  text: '#111111',
  subtleText: '#3E3E3E',
  mutedText: '#6F6F6F',
  border: '#D8A36D',
  softBorder: '#EFE6DA',
  primary: '#A9DEB4',
  primaryDark: '#2F6F3E',
  badge: '#FFE2A3',
  timerBadge: '#F4AAA6',
  successBadge: '#DFF3E3',
  warningBadge: '#FFF3D8',
  softSurface: '#FAFAF8',
  placeholder: '#D9D9D9',
  placeholderDark: '#CFCFCF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
};

export const shadow = {
  soft: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
};

export const typography = StyleSheet.create({
  brand: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
  },
  headline: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 32,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 25,
  },
  body: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 22,
  },
  caption: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 17,
  },
  badge: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 15,
  },
});

export const card = StyleSheet.create({
  product: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    minHeight: 104,
    padding: spacing.md,
  },
});
