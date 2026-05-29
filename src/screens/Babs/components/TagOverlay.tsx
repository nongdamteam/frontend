import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FastImage from '@d11/react-native-fast-image';
import { FeedTag } from '@/@types/feed';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SHADOW, SPACING } from '@/constants/layout';
import { formatPrice } from '@/utils/format';

interface TagOverlayProps {
  tags: FeedTag[];
  visible: boolean;
  /** 콘텐츠 영역의 실측 크기 (좌표 → px 변환에 사용) */
  containerWidth: number;
  containerHeight: number;
  onTagPress: (tag: FeedTag) => void;
}

export function TagOverlay({
  tags,
  visible,
  containerWidth,
  containerHeight,
  onTagPress,
}: TagOverlayProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 220 });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[StyleSheet.absoluteFill, animatedStyle]}
    >
      {tags.map(tag => {
        const left = tag.x * containerWidth;
        const top = tag.y * containerHeight;
        const placeRight = tag.x < 0.5;

        return (
          <View
            key={tag.id}
            style={[styles.tagWrap, { left, top }]}
            pointerEvents="box-none"
          >
            <Pressable onPress={() => onTagPress(tag)} style={styles.pressable}>
              <View style={styles.pin} />
              <View
                style={[
                  styles.connector,
                  placeRight ? styles.connectorRight : styles.connectorLeft,
                ]}
              />
              <View
                style={[
                  styles.label,
                  placeRight ? styles.labelRight : styles.labelLeft,
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
                <View style={styles.labelText}>
                  <Typography variant="captionStrong" color="textPrimary">
                    {tag.label}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    평균 {formatPrice(tag.averagePrice)}
                  </Typography>
                </View>
              </View>
            </Pressable>
          </View>
        );
      })}
    </Animated.View>
  );
}

const PIN_SIZE = 12;
const CONNECTOR_WIDTH = 28;

const styles = StyleSheet.create({
  tagWrap: {
    position: 'absolute',
    // 핀이 좌표 중심에 오도록 보정
    marginLeft: -PIN_SIZE / 2,
    marginTop: -PIN_SIZE / 2,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pin: {
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    backgroundColor: COLORS.tagPin,
    borderWidth: 2,
    borderColor: COLORS.white,
    ...SHADOW.card,
  },
  connector: {
    position: 'absolute',
    top: PIN_SIZE / 2 - 0.5,
    width: CONNECTOR_WIDTH,
    height: 1,
    backgroundColor: COLORS.white,
  },
  connectorRight: { left: PIN_SIZE },
  connectorLeft: { right: PIN_SIZE },
  label: {
    position: 'absolute',
    top: -SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.tagLabelBg,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
  },
  labelRight: { left: PIN_SIZE + CONNECTOR_WIDTH },
  labelLeft: { right: PIN_SIZE + CONNECTOR_WIDTH },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  thumbPlaceholder: { backgroundColor: COLORS.surfaceMuted },
  labelText: { paddingRight: SPACING.xs },
});
