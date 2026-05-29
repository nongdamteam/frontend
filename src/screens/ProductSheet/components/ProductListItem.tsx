import { Image, Pressable, StyleSheet, View } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { ProductListItem as ProductListItemType } from '@/@types/product';
import { Chip } from '@/components/common/Chip';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { formatPrice } from '@/utils/format';

interface ProductListItemProps {
  product: ProductListItemType;
  onPress: (id: string) => void;
}

export function ProductListItem({ product, onPress }: ProductListItemProps) {
  return (
    <Pressable
      onPress={() => onPress(product.id)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
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

      <View style={styles.content}>
        <Typography variant="bodyStrong" color="textPrimary" numberOfLines={2}>
          {product.name}
        </Typography>

        <View style={styles.badges}>
          {product.badges.map(badge => (
            <Chip key={badge.id} label={badge.label} />
          ))}
        </View>

        <Typography variant="bodyStrong" color="textPrimary">
          {product.unit}당 {formatPrice(product.pricePerUnit)}
        </Typography>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  thumbPlaceholder: {},
  content: {
    flex: 1,
    gap: SPACING.xs,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
});
