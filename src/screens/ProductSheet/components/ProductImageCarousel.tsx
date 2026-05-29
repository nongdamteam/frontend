import { useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import FastImage from '@d11/react-native-fast-image';
import { MediaSource } from '@/@types/feed';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface ProductImageCarouselProps {
  images: MediaSource[];
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
        {images.map((src, i) => (
          <View key={i} style={{ width, height }}>
            {typeof src === 'number' ? (
              <Image
                source={src}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <FastImage
                source={{ uri: src }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
          </View>
        ))}
      </BottomSheetScrollView>

      {images.length > 1 ? (
        <View style={styles.dots} pointerEvents="none">
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
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
