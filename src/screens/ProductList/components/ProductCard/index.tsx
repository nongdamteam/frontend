import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { ProductCardProps } from './types';

export function ProductCard({ product, onPress, rank }: ProductCardProps) {
  // 가격 포맷 (예: 1,000)
  const formattedPrice = product.pricePer100g.toLocaleString();

  const getRankBadgeStyle = (num: number) => {
    switch (num) {
      case 1:
        return { backgroundColor: '#FCC419' }; // 금메달
      case 2:
        return { backgroundColor: '#A8AEC0' }; // 은메달
      case 3:
        return { backgroundColor: '#D0B8A0' }; // 동메달
      default:
        return { backgroundColor: '#ADB5BD' }; // 4~10위
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={typeof product.image === 'string' ? { uri: product.image } : product.image}
          style={styles.image}
          resizeMode="cover"
        />
        {rank !== undefined && (
          <View style={[styles.rankBadge, getRankBadgeStyle(rank)]}>
            <Text style={styles.rankBadgeText}>{rank}위</Text>
          </View>
        )}
        {product.isGroupPurchase && product.timeRemaining && (
          <View style={styles.timeBadge}>
            <Text style={styles.timeBadgeText}>{product.timeRemaining}</Text>
          </View>
        )}
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
