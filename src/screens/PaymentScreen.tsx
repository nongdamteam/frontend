import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '@/components/common/BackButton';
import { COLORS } from '@/theme/colors';
import { colors, radius, shadow, spacing, typography } from '@/styles/theme';
import type { CartItem } from '@/services/cartService';
import type { DeliveryAddress } from './DeliveryAddressScreen';

type PaymentMethod = 'easy' | 'card' | 'transfer' | 'point';

interface PaymentScreenProps {
  deliveryAddress: DeliveryAddress;
  excludedItemCount: number;
  items: CartItem[];
  onBack: () => void;
  onPaymentComplete: () => void;
  productTotal: number;
  selectedItemCount: number;
  totalAmount: number;
  totalDeliveryFee: number;
}

const paymentMethods: Array<{ id: PaymentMethod; label: string }> = [
  { id: 'easy', label: '간편결제' },
  { id: 'card', label: '카드' },
  { id: 'transfer', label: '계좌이체' },
  { id: 'point', label: '포인트' },
];

export default function PaymentScreen({
  deliveryAddress,
  excludedItemCount,
  items,
  onBack,
  onPaymentComplete,
  productTotal,
  selectedItemCount,
  totalAmount,
  totalDeliveryFee,
}: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('easy');
  const [isPaying, setIsPaying] = useState(false);

  const productSummary = useMemo(() => {
    if (items.length === 0) {
      return '선택된 상품 없음';
    }

    if (items.length === 1) {
      return items[0].title;
    }

    return `${items[0].title} 외 ${items.length - 1}개`;
  }, [items]);

  const requestText = deliveryAddress.isEarlyMorning
    ? '산지상품은 보냉백에 놓아주세요'
    : '배송 전 연락 부탁드려요';

  const formatPrice = (price: number) => `${price.toLocaleString()}원`;

  const handlePay = () => {
    if (isPaying || totalAmount <= 0) {
      return;
    }

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      Alert.alert(
        '결제 완료',
        `총 ${selectedItemCount}개의 상품 ${formatPrice(totalAmount)} 결제가 완료되었습니다.`,
        [
          {
            text: '주문내역 보기',
            onPress: onPaymentComplete,
          },
        ],
        { cancelable: false },
      );
    }, 700);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={onBack} color={colors.text} />
        <Text style={styles.headerTitle}>주문/결제</Text>
        <TouchableOpacity style={styles.headerAction} onPress={onBack} activeOpacity={0.75}>
          <Text style={styles.headerActionText}>장바구니</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>배송지</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>받는 사람</Text>
            <Text style={styles.infoValue}>김범스</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>주소</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {deliveryAddress.address}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>배송 요청</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {requestText}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>결제 상품</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>선택 산지상품</Text>
            <Text style={styles.infoValue}>{selectedItemCount}개</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>레시피 산지상품</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {productSummary}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>제외 상품</Text>
            <Text style={styles.infoValue}>
              {excludedItemCount > 0 ? `품절/미선택 ${excludedItemCount}개` : '없음'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>결제 수단</Text>
        <View style={styles.methodGrid}>
          {paymentMethods.map(method => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodButton, isSelected && styles.methodButtonSelected]}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.methodText, isSelected && styles.methodTextSelected]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>최종 결제 금액</Text>
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.infoLabel}>산지상품 금액</Text>
            <Text style={styles.totalValue}>{formatPrice(productTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.infoLabel}>배송비</Text>
            <Text style={styles.totalValue}>{formatPrice(totalDeliveryFee)}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>총 결제</Text>
            <Text style={styles.grandTotalValue}>{formatPrice(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payButton, (isPaying || totalAmount <= 0) && styles.payButtonDisabled]}
          onPress={handlePay}
          activeOpacity={0.85}
          disabled={isPaying || totalAmount <= 0}
        >
          {isPaying ? (
            <View style={styles.payButtonContent}>
              <ActivityIndicator color={colors.surface} size="small" />
              <Text style={styles.payButtonText}>결제 처리 중</Text>
            </View>
          ) : (
            <Text style={styles.payButtonText}>결제하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
    flex: 1,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerAction: {
    alignItems: 'flex-end',
    minWidth: 56,
    paddingVertical: spacing.xs,
  },
  headerActionText: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '700',
  },
  scrollView: {
    backgroundColor: '#F3EEE8',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 104,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '800',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    minHeight: 28,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.mutedText,
    flexShrink: 0,
    fontWeight: '700',
  },
  infoValue: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
    fontWeight: '800',
    textAlign: 'right',
  },
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  methodButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexBasis: '48.5%',
    flexGrow: 1,
    height: 40,
    justifyContent: 'center',
  },
  methodButtonSelected: {
    backgroundColor: '#FFF8F0',
    borderColor: '#C58E52',
  },
  methodText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800',
  },
  methodTextSelected: {
    color: '#B97835',
  },
  totalCard: {
    ...shadow.soft,
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalValue: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '800',
  },
  totalDivider: {
    backgroundColor: COLORS.border,
    height: 1,
    marginVertical: spacing.md,
  },
  grandTotalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grandTotalLabel: {
    ...typography.title,
    color: colors.text,
    fontWeight: '900',
  },
  grandTotalValue: {
    ...typography.headline,
    color: COLORS.primary,
    fontWeight: '900',
  },
  bottomBar: {
    ...shadow.soft,
    backgroundColor: colors.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    position: 'absolute',
    right: 0,
  },
  payButton: {
    alignItems: 'center',
    backgroundColor: '#BF8A50',
    borderRadius: radius.sm,
    height: 48,
    justifyContent: 'center',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  payButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '900',
  },
});
