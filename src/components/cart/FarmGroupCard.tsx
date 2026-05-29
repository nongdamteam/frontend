import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../../styles/theme';
import { COLORS } from '../../theme/colors';
import { CartItem, CartItemRow } from './CartItemRow';

export interface FarmCalculations {
  id: string;
  name: string;
  deliveryType: 'early_morning' | 'normal';
  deliveryFeePolicy: string;
  baseDeliveryFee: number;
  freeDeliveryThreshold?: number;
  items: CartItem[];
  checkedCount: number;
  itemTotal: number;
  deliveryFee: number;
  allFarmActiveChecked: boolean;
  activeCount: number;
}

interface FarmGroupCardProps {
  farmCalc: FarmCalculations;
  onToggleFarm: (farmId: string, currentAllChecked: boolean) => void;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, increment: number) => void;
  onMergeQuantity: (itemId: string) => void;
  onSeparatePurchase: (itemId: string) => void;
}

const CheckIcon = ({ checked }: { checked: boolean }) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="5"
        fill={checked ? COLORS.primary : 'none'}
        stroke={checked ? COLORS.primary : colors.placeholderDark}
        strokeWidth="2"
      />
      {checked && (
        <Path
          d="M7 12L10.5 15.5L17 8.5"
          stroke={colors.surface}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
};

export const FarmGroupCard: React.FC<FarmGroupCardProps> = ({
  farmCalc,
  onToggleFarm,
  onToggleItem,
  onDeleteItem,
  onUpdateQuantity,
  onMergeQuantity,
  onSeparatePurchase,
}) => {
  const formatPrice = (price: number) => `${price.toLocaleString()}원`;

  return (
    <View style={styles.farmCard}>
      {/* Farm Header */}
      <View style={styles.farmHeader}>
        <Pressable
          style={styles.farmCheckWrapper}
          onPress={() => onToggleFarm(farmCalc.id, farmCalc.allFarmActiveChecked)}
        >
          <CheckIcon checked={farmCalc.allFarmActiveChecked} />
          <Text style={styles.farmName}>{farmCalc.name}</Text>
        </Pressable>
        <View
          style={[
            styles.deliveryBadge,
            farmCalc.deliveryType === 'early_morning'
              ? styles.earlyDeliveryBg
              : styles.normalDeliveryBg,
          ]}
        >
          <Text
            style={[
              styles.deliveryBadgeText,
              farmCalc.deliveryType === 'early_morning'
                ? styles.earlyDeliveryText
                : styles.normalDeliveryText,
            ]}
          >
            {farmCalc.deliveryType === 'early_morning' ? '새벽배송' : '일반배송'}
          </Text>
        </View>
      </View>
      <Text style={styles.farmPolicy}>{farmCalc.deliveryFeePolicy}</Text>

      <View style={styles.divider} />

      {/* Farm Items List */}
      {farmCalc.items.map(item => (
        <CartItemRow
          key={item.id}
          item={item}
          onToggleItem={onToggleItem}
          onDeleteItem={onDeleteItem}
          onUpdateQuantity={onUpdateQuantity}
          onMergeQuantity={onMergeQuantity}
          onSeparatePurchase={onSeparatePurchase}
        />
      ))}

      {/* Farm Footer Subtotal */}
      <View style={styles.farmFooter}>
        <Text style={styles.farmFooterText}>
          농장 배송비 {formatPrice(farmCalc.deliveryFee)} · 선택 산지상품 {farmCalc.checkedCount}개
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  farmCard: {
    ...shadow.soft,
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  farmHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  farmCheckWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  farmName: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
  },
  deliveryBadge: {
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  earlyDeliveryBg: {
    backgroundColor: '#FFF0F1',
  },
  normalDeliveryBg: {
    backgroundColor: '#F2F2F2',
  },
  deliveryBadgeText: {
    ...typography.badge,
    fontSize: 10,
  },
  earlyDeliveryText: {
    color: COLORS.primary,
  },
  normalDeliveryText: {
    color: colors.mutedText,
  },
  farmPolicy: {
    ...typography.caption,
    color: colors.mutedText,
    marginLeft: 28,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  divider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginBottom: spacing.lg,
  },
  farmFooter: {
    alignItems: 'center',
    backgroundColor: colors.softSurface,
    borderRadius: radius.sm,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  farmFooterText: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '700',
  },
});
