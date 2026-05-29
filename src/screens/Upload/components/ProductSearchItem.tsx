import { Image, Pressable, StyleSheet, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { ProductListItem } from '@/@types/product';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { formatPrice, formatRating } from '@/utils/format';

interface ProductSearchItemProps {
  product: ProductListItem;
  added: boolean;
  onPress: (product: ProductListItem) => void;
}

export function ProductSearchItem({
  product,
  added,
  onPress,
}: ProductSearchItemProps) {
  return (
    <Pressable
      onPress={() => onPress(product)}
      disabled={added}
      style={({ pressed }) => [
        styles.row,
        pressed && !added && { opacity: 0.7 },
      ]}
    >
      {product.thumbnailUrl ? (
        typeof product.thumbnailUrl === 'number' ? (
          <Image source={product.thumbnailUrl} style={styles.thumb} />
        ) : (
          <FastImage
            source={{ uri: product.thumbnailUrl }}
            style={styles.thumb}
          />
        )
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]} />
      )}

      <View style={styles.info}>
        <Typography variant="bodyStrong" color="textPrimary" numberOfLines={1}>
          {product.name}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {product.unit}당 {formatPrice(product.pricePerUnit)} · ★{' '}
          {formatRating(product.rating)} ({product.reviewCount})
        </Typography>
      </View>

      <View style={[styles.addBtn, added && styles.addBtnDisabled]}>
        <Icon
          name={added ? 'checkmark' : 'add'}
          size={18}
          color={added ? COLORS.textMuted : COLORS.textOnPrimary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
  },
  thumbPlaceholder: {},
  info: { flex: 1, gap: SPACING.xs },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: COLORS.surfaceMuted,
  },
});
