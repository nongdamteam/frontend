import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // 상세 화면 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  // 캐러셀
  carouselContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
    backgroundColor: '#F9F9F9',
  },
  carouselImage: {
    width: 390, // 화면 너비는 기본 기기 해상도를 감안하되 scale로 유연하게 처리
    height: '100%',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4,
  },
  activeIndicatorDot: {
    backgroundColor: COLORS.badgeText, // 골드/황토색 인디케이터 (두 번째 이미지 참고)
    width: 16, // 활성화 시 넓어짐
  },
  // 정보 뷰
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.badgeText,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  pricePrefix: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  priceText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  // 초록색 가격 변동 비교 상자
  comparisonBox: {
    backgroundColor: '#EBF6EB', // 연한 연두색 배경
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 2,
    borderWidth: 0.5,
    borderColor: '#C7E2C5',
  },
  comparisonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E5A27', // 녹색 텍스트
  },
  // 탭바
  tabHeaderContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#F0F0F0',
    backgroundColor: COLORS.white,
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#222222', // 심플하고 세련된 블랙 언더라인
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  // 탭 콘텐츠
  tabContentContainer: {
    padding: 20,
    minHeight: 280,
    backgroundColor: COLORS.white,
  },
  // 상세 탭 스타일
  descText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  // 리뷰 탭 스타일
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FAF6F4',
    padding: 12,
    borderRadius: 8,
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    marginRight: 8,
  },
  ratingStar: {
    fontSize: 18,
    color: '#FFB300',
    marginRight: 4,
  },
  ratingCountText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 'auto',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingVertical: 12,
  },
  reviewUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reviewDate: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  // 문의 탭 스타일
  inquiryNotice: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  inquiryNoticeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  inquiryNoticeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  inquiryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  inquiryQ: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  inquiryA: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: '#FAF6F4',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  // 하단 구매 바
  bottomPurchaseBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    marginRight: 12,
  },
  cartEmoji: {
    fontSize: 20,
  },
  buyButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#C7E2C5', // 시안과 동일한 옅은 민트/연두색
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E5A27', // 시안과 동일한 어두운 녹색 글씨
  },
});
