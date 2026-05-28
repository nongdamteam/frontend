import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

interface PriceComparisonProps {
  currentPrice: number;
}

export function PriceComparison({ currentPrice }: PriceComparisonProps) {
  // 5일 전 가상 평균 가격 계산 (현재가보다 약 25% 비쌈)
  const pastPrice = Math.round((currentPrice * 1.25) / 10) * 10;
  const formattedPastPrice = pastPrice.toLocaleString();

  return (
    <View style={styles.comparisonBox}>
      <Text style={styles.comparisonText}>
        📈 5일 전에는 100g당 {formattedPastPrice}원이었어요!
      </Text>
    </View>
  );
}
export default PriceComparison;
