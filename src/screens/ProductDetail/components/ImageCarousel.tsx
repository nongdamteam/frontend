import React, { useState } from 'react';
import { View, Image, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { styles } from '../styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CAROUSEL_IMAGES = [
  require('@/assets/images/bomdong_fresh.png'),
  require('@/assets/images/bomdong_fresh.png'),
  require('@/assets/images/bomdong_fresh.png'),
  require('@/assets/images/bomdong_fresh.png'),
];

interface ImageCarouselProps {
  images?: any[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images && images.length > 0 ? images : CAROUSEL_IMAGES;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.carouselContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {displayImages.map((img, index) => (
          <Image
            key={`carousel-${index}`}
            source={typeof img === 'string' ? { uri: img } : img}
            style={[styles.carouselImage, { width: SCREEN_WIDTH }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {/* 점 인디케이터 */}
      <View style={styles.indicatorContainer}>
        {displayImages.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.indicatorDot,
              activeIndex === index && styles.activeIndicatorDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}
export default ImageCarousel;
