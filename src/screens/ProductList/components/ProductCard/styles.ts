import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 6,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.badgeText,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pricePrefix: {
    fontSize: 11,
    color: COLORS.textLight,
    marginRight: 2,
  },
  priceText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
    paddingTop: 4,
  },
  metaText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  bullet: {
    fontSize: 10,
    color: COLORS.textLight,
    marginHorizontal: 4,
  },
});
