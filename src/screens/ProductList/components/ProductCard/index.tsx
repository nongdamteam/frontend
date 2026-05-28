import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { ProductCardProps } from './types';

export function ProductCard({ product, onPress }: ProductCardProps) {
  // 가격 포맷 (예: 1,000)
  const formattedPrice = product.pricePer100g.toLocaleString();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={product.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          
          <View style={styles.badgeRow}>
            {product.tags.map((tag, idx) => (
              <View key={`${product.id}-tag-${idx}`} style={styles.badge}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <View style={styles.priceRow}>
            <Text style={styles.pricePrefix}>100g당</Text>
            <Text style={styles.priceText}>{formattedPrice}원</Text>
          </View>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>📍 내 위치에서 {product.distance}km</Text>
            {product.isGroupPurchase && (
              <>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.metaText}>👥 {product.participantsCount}명 참여중</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
export default ProductCard;
