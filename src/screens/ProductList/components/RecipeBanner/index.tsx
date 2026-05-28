import React from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { RecipeBannerProps } from './types';

export function RecipeBanner({ onPressCard }: RecipeBannerProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/recipe_banner.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.imageOverlay} />
        
        {/* 핀 포인트 */}
        <View style={styles.pinPoint} />
        
        {/* 꺾인 지시선 */}
        <View style={styles.lineVertical} />
        <View style={styles.lineHorizontal} />
        
        {/* 툴팁 카드 */}
        <TouchableOpacity
          style={styles.tooltipCard}
          onPress={onPressCard}
          activeOpacity={0.9}
        >
          <Image
            source={require('@/assets/images/bomdong_fresh.png')}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>봄동 300g</Text>
            <Text style={styles.price}>평균 1,000원</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}
export default RecipeBanner;
