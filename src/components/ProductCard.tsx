import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {card, colors, radius, shadow, spacing, typography} from '../styles/theme';

export type Product = {
  id: string;
  title: string;
  badges: string[];
  price: string;
  discountNote?: string;
  image?: ImageSourcePropType | string;
};

type ProductCardProps = {
  onPress?: () => void;
  product: Product;
};

const THUMB = 92;
const STATUS_BADGE = '공구 진행중';

function ProductCard({onPress, product}: ProductCardProps) {
  const isActive = product.badges.includes(STATUS_BADGE);
  const infoBadges = product.badges.filter(b => b !== STATUS_BADGE);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.card, pressed && styles.cardPressed]}>
      {/* 썸네일 + 공구 진행중 오버레이 */}
      <View style={styles.thumbnailWrapper}>
        {product.image ? (
          <Image
            resizeMode="cover"
            source={
              typeof product.image === 'string'
                ? {uri: product.image}
                : product.image
            }
            style={styles.thumbnail}
          />
        ) : (
          <View style={styles.thumbnailFallback} />
        )}
        {isActive && (
          <View style={styles.activeOverlay}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>공구 진행중</Text>
          </View>
        )}
      </View>

      {/* 텍스트 콘텐츠 — 노란 배지끼리만 */}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        {infoBadges.length > 0 && (
          <View style={styles.badges}>
            {infoBadges.map(badge => (
              <Text key={badge} style={styles.badge}>
                {badge}
              </Text>
            ))}
          </View>
        )}
        <Text style={styles.price}>{product.price}</Text>
        {product.discountNote && (
          <Text style={styles.discountNote}>{product.discountNote}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...card.product,
    ...shadow.soft,
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: 0,
  },
  cardPressed: {
    opacity: 0.75,
  },

  // 썸네일
  thumbnailWrapper: {
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    height: THUMB,
    width: THUMB,
  },
  thumbnailFallback: {
    backgroundColor: colors.placeholder,
    height: THUMB,
    width: THUMB,
  },

  // 공구 진행중 — 이미지 하단 오버레이
  activeOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(26, 74, 40, 0.82)',
    bottom: 0,
    flexDirection: 'row',
    gap: 4,
    left: 0,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    position: 'absolute',
    right: 0,
  },
  activeDot: {
    backgroundColor: '#A9DEB4',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  activeText: {
    ...typography.badge,
    color: '#FFFFFF',
    fontSize: 10,
  },

  // 콘텐츠
  content: {
    flex: 1,
    gap: spacing.xs,
    justifyContent: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '700',
    lineHeight: 20,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badge: {
    ...typography.badge,
    backgroundColor: colors.badge,
    borderRadius: radius.xs,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  price: {
    ...typography.body,
    color: colors.primaryDark,
    fontWeight: '800',
  },
  discountNote: {
    ...typography.caption,
    color: colors.mutedText,
  },
});

export default ProductCard;
