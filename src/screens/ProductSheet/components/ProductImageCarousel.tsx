import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import FastImage from '@d11/react-native-fast-image';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface ProductImageCarouselProps {
  images: string[];
  width: number;
  height: number;
}

export function ProductImageCarousel({
  images,
  width,
  height,
}: ProductImageCarouselProps) {
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <BottomSheetScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <View key={`${uri}-${i}`} style={{ width, height }}>
            <FastImage
              source={{ uri }}
              style={StyleSheet.absoluteFillObject}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        ))}
      </BottomSheetScrollView>

      <View style={styles.dots} pointerEvents="none">
        {images.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  dots: {
    position: 'absolute',
    bottom: SPACING.sm,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
    opacity: 0.5,
  },
  dotActive: { opacity: 1 },
});
