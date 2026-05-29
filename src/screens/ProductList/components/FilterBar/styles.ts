import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  activeFilterButton: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  arrowIcon: {
    fontSize: 8,
    marginLeft: 4,
    color: COLORS.textLight,
  },
  activeArrowIcon: {
    color: COLORS.primary,
  },
  // 공구 여부 토글용 뱃지 스타일
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingRight: 4,
  },
  toggleText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 6,
    fontWeight: '500',
  },
  switchBase: {
    width: 36,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: COLORS.primary,
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
});
