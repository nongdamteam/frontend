import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000', // 이미지 로드 전 대비
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)', // 가독성을 위한 약간의 오버레이
  },
  // 핀 포인트 (흰색 점)
  pinPoint: {
    position: 'absolute',
    left: 70,
    top: 110,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    zIndex: 10,
  },
  // 꺾인 지시선 - 수직부
  lineVertical: {
    position: 'absolute',
    left: 76,
    top: 85,
    width: 2,
    height: 25,
    backgroundColor: '#FFFFFF',
    zIndex: 5,
  },
  // 꺾인 지시선 - 수평부
  lineHorizontal: {
    position: 'absolute',
    left: 76,
    top: 85,
    width: 54,
    height: 2,
    backgroundColor: '#FFFFFF',
    zIndex: 5,
  },
  // 툴팁 카드
  tooltipCard: {
    position: 'absolute',
    left: 130,
    top: 60,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  thumbnail: {
    width: 36,
    height: 36,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  price: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});
