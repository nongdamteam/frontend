import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -1,
  },
  headerEmoji: {
    fontSize: 22,
    marginLeft: 4,
  },
  headerFilterIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  // 모드 테스트 스위치 스타일 (상단에 프리미엄 탭 형태로 배치)
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    padding: 3,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeModeTab: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeModeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // 스크롤 리스트
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    // BottomNavBar 높이 및 Safe Area 대응을 위한 하단 패딩 확보
    paddingBottom: 110, 
  },
  listHeader: {
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  // 로더 오버레이
  loadingOverlay: {
    position: 'absolute',
    top: 250,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F3F5',
    marginRight: 10,
  },
  backArrow: {
    fontSize: 20,
    color: COLORS.text || '#343A40',
    fontWeight: '700',
  },
  searchBarWrapper: {
    flex: 1,
  },
});
