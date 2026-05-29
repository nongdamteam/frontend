import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ProductSortType } from '@/@types/product';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface SortOption {
  key: ProductSortType;
  label: string;
}

const OPTIONS: SortOption[] = [
  { key: 'distance', label: '거리순' },
  { key: 'priceLow', label: '최저가순' },
  { key: 'priceHigh', label: '최고가순' },
  { key: 'reviewCount', label: '리뷰많은순' },
  { key: 'rating', label: '평점높은순' },
];

interface SortFilterBarProps {
  value: ProductSortType;
  onChange: (next: ProductSortType) => void;
}

export function SortFilterBar({ value, onChange }: SortFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {OPTIONS.map(option => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Typography
              variant="captionStrong"
              color={selected ? 'white' : 'textSecondary'}
            >
              {option.label}
            </Typography>
          </Pressable>
        );
      })}
      <View style={{ width: SPACING.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceMuted,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
  },
});
