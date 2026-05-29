import { useEffect } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FeedTag } from '@/@types/feed';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { formatPrice } from '@/utils/format';

interface VideoTagStripProps {
  tags: FeedTag[];
  visible: boolean;
  onTagPress: (tag: FeedTag) => void;
  /** 사이드 액션/탭바와 안 겹치도록 하단 여백 */
  bottomOffset?: number;
}

/**
 * 영상 콘텐츠가 일시정지됐을 때 화면 하단에서 페이드 인되는 상품 strip.
 * - 카드를 가로로 스크롤
 * - 위쪽은 그라데이션으로 영상과 자연스럽게 연결
 */
export function VideoTagStrip({
  tags,
  visible,
  onTagPress,
  bottomOffset = 0,
}: VideoTagStripProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 220 });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (tags.length === 0) return null;

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[
        styles.container,
        { bottom: bottomOffset },
        animatedStyle,
      ]}
    >
      <View style={styles.titleRow} pointerEvents="none">
        <Icon name="bag-handle-outline" size={14} color={COLORS.white} />
        <Typography variant="captionStrong" color="white">
          이 영상에 태그된 상품 {tags.length}
        </Typography>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroller}
      >
        {tags.map(tag => (
          <Pressable
            key={tag.id}
            onPress={() => onTagPress(tag)}
            style={({ pressed }) => [
              styles.card,
              pressed && { opacity: 0.85 },
            ]}
          >
            {tag.thumbnailUrl ? (
              typeof tag.thumbnailUrl === 'number' ? (
                <Image source={tag.thumbnailUrl} style={styles.thumb} />
              ) : (
                <FastImage
                  source={{ uri: tag.thumbnailUrl }}
                  style={styles.thumb}
                />
              )
            ) : (
              <View style={[styles.thumb, styles.thumbPlaceholder]} />
            )}

            <View style={styles.info}>
              <Typography
                variant="captionStrong"
                color="textPrimary"
                numberOfLines={1}
              >
                {tag.label}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                평균 {formatPrice(tag.averagePrice)}
              </Typography>
            </View>

            <View style={styles.buyBtn}>
              <Icon name="add" size={18} color={COLORS.textPrimary} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.md,
    // 위쪽 페이드 — 영상과 자연스럽게 연결
    backgroundColor: COLORS.overlayDim,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  scroller: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  card: {
    width: 220,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
  },
  thumbPlaceholder: {},
  info: { flex: 1, gap: 2 },
  buyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
