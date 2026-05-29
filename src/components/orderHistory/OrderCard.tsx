import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageSourcePropType,
} from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../../styles/theme';
import { COLORS } from '../../theme/colors';
import OrderItemRow, { OrderItem } from './OrderItemRow';

export interface OrderGroup {
  orderId: string;
  orderDate: string;
  farmName: string;
  deliveryType: 'early_morning' | 'normal';
  status: 'completed' | 'shipping' | 'success';
  items: OrderItem[];
  totalPrice: number;
  deliveryFee: number;
}

interface OrderCardProps {
  group: OrderGroup;
  onReorder: (itemTitle: string) => void;
  onWriteReview: (itemTitle: string) => void;
}

function getStatusLabel(status: OrderGroup['status']) {
  switch (status) {
    case 'shipping':
      return '배송중';
    case 'completed':
      return '배송완료';
    case 'success':
      return '공구성공';
    default:
      return '';
  }
}

function getStatusBadgeStyle(status: OrderGroup['status']) {
  switch (status) {
    case 'shipping':
      return [styles.statusBadge, styles.shippingBg];
    case 'completed':
      return [styles.statusBadge, styles.completedBg];
    case 'success':
      return [styles.statusBadge, styles.successBg];
    default:
      return [styles.statusBadge];
  }
}

function getStatusTextStyle(status: OrderGroup['status']) {
  switch (status) {
    case 'shipping':
      return styles.shippingText;
    case 'completed':
      return styles.completedText;
    case 'success':
      return styles.successText;
    default:
      return styles.statusText;
  }
}

export default function OrderCard({ group, onReorder, onWriteReview }: OrderCardProps) {
  return (
    <View style={styles.orderCard}>
      {/* Card Header (Date & Status) */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderDate}>{group.orderDate}</Text>
          <Text style={styles.orderId}>주문번호 {group.orderId}</Text>
        </View>
        <View style={getStatusBadgeStyle(group.status)}>
          <Text style={getStatusTextStyle(group.status)}>{getStatusLabel(group.status)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Farm Name Info */}
      <View style={styles.farmRow}>
        <Text style={styles.farmName}>{group.farmName}</Text>
        <View style={[
          styles.deliveryBadge,
          group.deliveryType === 'early_morning' ? styles.earlyDeliveryBg : styles.normalDeliveryBg,
        ]}>
          <Text style={[
            styles.deliveryBadgeText,
            group.deliveryType === 'early_morning' ? styles.earlyDeliveryText : styles.normalDeliveryText,
          ]}>
            {group.deliveryType === 'early_morning' ? '새벽배송' : '일반배송'}
          </Text>
        </View>
      </View>

      {/* Items List */}
      {group.items.map(item => (
        <OrderItemRow
          key={item.id}
          item={item}
          showReviewButton={group.status === 'completed'}
          onReorder={onReorder}
          onWriteReview={onWriteReview}
        />
      ))}

      <View style={styles.cardDivider} />

      {/* Total Payment Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>총 결제금액</Text>
        <Text style={styles.totalPrice}>
          {group.totalPrice.toLocaleString()}원
          <Text style={styles.deliveryFeeNote}>
            {group.deliveryFee > 0
              ? ` (배송비 ${group.deliveryFee.toLocaleString()}원 포함)`
              : ' (무료배송)'}
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderCard: {
    ...shadow.soft,
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  orderDate: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
  },
  orderId: {
    ...typography.caption,
    color: colors.placeholderDark,
    marginTop: 2,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: radius.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  shippingBg: {
    backgroundColor: '#E3F2FD',
  },
  completedBg: {
    backgroundColor: '#E8F5E9',
  },
  successBg: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    ...typography.badge,
    fontWeight: '800',
  },
  shippingText: {
    ...typography.badge,
    color: '#1976D2',
    fontWeight: '800',
  },
  completedText: {
    ...typography.badge,
    color: '#388E3C',
    fontWeight: '800',
  },
  successText: {
    ...typography.badge,
    color: '#F57C00',
    fontWeight: '800',
  },
  divider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: spacing.sm,
  },
  farmRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  farmName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  deliveryBadge: {
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  earlyDeliveryBg: {
    backgroundColor: '#FFF0F1',
  },
  normalDeliveryBg: {
    backgroundColor: '#F2F2F2',
  },
  deliveryBadgeText: {
    ...typography.badge,
    fontSize: 9,
    fontWeight: '700',
  },
  earlyDeliveryText: {
    color: COLORS.primary,
  },
  normalDeliveryText: {
    color: colors.mutedText,
  },
  cardDivider: {
    backgroundColor: colors.softSurface,
    height: 1,
    marginVertical: spacing.md,
  },
  cardFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.body,
    color: colors.mutedText,
    fontWeight: '700',
  },
  totalPrice: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
  },
  deliveryFeeNote: {
    fontSize: 11,
    color: colors.placeholderDark,
    fontWeight: '600',
  },
});
