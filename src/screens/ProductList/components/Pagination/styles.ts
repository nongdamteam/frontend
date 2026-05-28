import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.white,
  },
  activePageButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pageText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activePageText: {
    color: COLORS.white,
  },
  arrowButton: {
    paddingHorizontal: 8,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.white,
  },
  disabledArrowButton: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});
