import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Chip } from '@/components/common/Chip';
import { IconButton } from '@/components/common/IconButton';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SCREEN, SPACING } from '@/constants/layout';
import { formatPrice } from '@/utils/format';
import { useProductDetail } from '../hooks/useProductDetail';
import { useProductSheet } from '../context/ProductSheetContext';
import { ProductImageCarousel } from './ProductImageCarousel';

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { data, isLoading, isError } = useProductDetail(productId);
  const { popToList } = useProductSheet();

  const carouselSize = SCREEN.width - SPACING.lg * 2;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Typography variant="body" color="textMuted">
          상품 정보를 불러오지 못했어요.
        </Typography>
        <View style={{ height: SPACING.md }} />
        <Pressable onPress={popToList}>
          <Typography variant="bodyStrong" color="primary">
            목록으로 돌아가기
          </Typography>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BottomSheetScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.carouselWrap}>
          <ProductImageCarousel
            images={data.images}
            width={carouselSize}
            height={carouselSize}
          />

          {/* 좌상단 뒤로가기 */}
          <View style={styles.backButton}>
            <IconButton
              name="chevron-back"
              size={24}
              color="textPrimary"
              onPress={popToList}
              accessibilityLabel="목록으로"
            />
          </View>

          {/* 우상단 상세정보 칩 (스크린샷 참고) */}
          <View style={styles.topRightChip}>
            <Chip label="상세정보" />
          </View>
        </View>

        <View style={styles.info}>
          <Typography variant="heading2" color="textPrimary">
            {data.name}
          </Typography>

          <View style={styles.badges}>
            {data.badges.map(badge => (
              <Chip key={badge.id} label={badge.label} />
            ))}
          </View>

          <Typography variant="priceLarge" color="textPrimary">
            {data.unit}당 {formatPrice(data.pricePerUnit)}
          </Typography>

          {data.priceHistoryNote ? (
            <Typography variant="caption" color="textSecondary">
              {data.priceHistoryNote}
            </Typography>
          ) : null}
        </View>
      </BottomSheetScrollView>

      {/* 하단 고정 액션 바 */}
      <View style={styles.actionBar}>
        <Pressable style={styles.cartIcon} accessibilityLabel="장바구니">
          <IconButton
            name="bag-handle-outline"
            size={26}
            color="textPrimary"
          />
        </Pressable>
        <Pressable style={({ pressed }) => [
          styles.buyButton,
          pressed && { backgroundColor: COLORS.primaryPressed },
        ]}>
          <Typography variant="buttonLabel" color="textOnPrimary">
            구매하기
          </Typography>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl * 3,
  },
  carouselWrap: { position: 'relative' },
  backButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    padding: SPACING.xs,
  },
  topRightChip: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
  },
  info: {
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  actionBar: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    bottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cartIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButton: {
    flex: 1,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
