import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../styles/theme';
import { COLORS } from '../theme/colors';
import { FarmGroupCard } from '../components/cart/FarmGroupCard';
import OrderHistoryScreen from './OrderHistoryScreen';
import DeliveryAddressScreen, { DeliveryAddress } from './DeliveryAddressScreen';
import PaymentScreen from './PaymentScreen';
import { cartService } from '@/services/cartService';

interface CartItem {
  id: string;
  farmId: string;
  title: string;
  option: string;
  recipeSource?: string;
  unitPrice: number;
  originalUnitPrice?: number;
  quantity: number;
  checked: boolean;
  isSoldOut?: boolean;
  priceChangedNote?: string;
  duplicateWarning?: {
    message: string;
    show: boolean;
  };
  image?: ImageSourcePropType | string;
}

interface Farm {
  id: string;
  name: string;
  deliveryType: 'early_morning' | 'normal';
  deliveryFeePolicy: string;
  baseDeliveryFee: number;
  freeDeliveryThreshold?: number;
}

// Initial Data
const initialFarms: Farm[] = [
  {
    id: 'cheorwon',
    name: '철원 들녘농장',
    deliveryType: 'early_morning',
    deliveryFeePolicy: '3개 산지상품 · 30,000원 이상 무료배송',
    baseDeliveryFee: 3000,
    freeDeliveryThreshold: 30000,
  },
  {
    id: 'haenam',
    name: '해남 땅끝농장',
    deliveryType: 'normal',
    deliveryFeePolicy: '2개 산지상품 · 산지묶음배송',
    baseDeliveryFee: 3500,
  },
];

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>(cartService.getCartItems());
  const [farms] = useState<Farm[]>(initialFarms);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showAddressScreen, setShowAddressScreen] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    id: 'addr-1',
    label: '집',
    address: '서울 강남구 테헤란로 152',
    detail: '강남파이낸스센터 10층',
    isEarlyMorning: true,
  });

  useEffect(() => {
    if (cartService.getShouldShowOrderHistory()) {
      setShowOrderHistory(true);
      cartService.setShouldShowOrderHistory(false);
    }

    const unsubscribe = cartService.subscribe(() => {
      setItems(cartService.getCartItems());
    });
    return unsubscribe;
  }, []);

  const LocationIcon = () => (
    <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill={COLORS.primary} />
    </Svg>
  );

  const CheckIcon = ({ checked, disabled }: { checked: boolean; disabled?: boolean }) => {
    const activeColor = disabled ? colors.placeholder : COLORS.primary;
    return (
      <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Rect
          x="1"
          y="1"
          width="22"
          height="22"
          rx="5"
          fill={checked ? activeColor : 'none'}
          stroke={checked ? activeColor : colors.placeholderDark}
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



  const activeItems = useMemo(() => items.filter(item => !item.isSoldOut), [items]);
  const checkedItemsCount = useMemo(() => activeItems.filter(item => item.checked).length, [activeItems]);
  const isAllChecked = useMemo(() => activeItems.length > 0 && checkedItemsCount === activeItems.length, [activeItems, checkedItemsCount]);

  const farmCalculations = useMemo(() => {
    return farms.map(farm => {
      const farmItems = items.filter(item => item.farmId === farm.id);
      const farmActiveItems = farmItems.filter(item => !item.isSoldOut);
      const farmCheckedItems = farmActiveItems.filter(item => item.checked);
      
      const itemTotal = farmCheckedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      
      let deliveryFee = 0;
      if (farmCheckedItems.length > 0) {
        if (farm.freeDeliveryThreshold !== undefined && itemTotal >= farm.freeDeliveryThreshold) {
          deliveryFee = 0;
        } else {
          deliveryFee = farm.baseDeliveryFee;
        }
      }

      const allFarmActiveChecked = farmActiveItems.length > 0 && farmCheckedItems.length === farmActiveItems.length;

      return {
        ...farm,
        items: farmItems,
        checkedCount: farmCheckedItems.length,
        itemTotal,
        deliveryFee,
        allFarmActiveChecked,
        activeCount: farmActiveItems.length,
      };
    });
  }, [items, farms]);

  const totalProductPrice = useMemo(() => farmCalculations.reduce((sum, f) => sum + f.itemTotal, 0), [farmCalculations]);
  const totalDeliveryFee = useMemo(() => farmCalculations.reduce((sum, f) => sum + f.deliveryFee, 0), [farmCalculations]);
  const totalExcludeCount = useMemo(() => items.filter(item => item.isSoldOut || !item.checked).length, [items]);
  const grandTotal = useMemo(() => totalProductPrice + totalDeliveryFee, [totalProductPrice, totalDeliveryFee]);
  const paymentItems = useMemo(
    () => activeItems.filter(item => item.checked),
    [activeItems],
  );

  const handleToggleItem = (itemId: string) => {
    const updated = items.map(item => {
      if (item.id === itemId && !item.isSoldOut) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    cartService.setCartItems(updated);
  };

  const handleToggleFarm = (farmId: string, currentAllChecked: boolean) => {
    const updated = items.map(item => {
      if (item.farmId === farmId && !item.isSoldOut) {
        return { ...item, checked: !currentAllChecked };
      }
      return item;
    });
    cartService.setCartItems(updated);
  };

  const handleToggleAll = () => {
    const nextState = !isAllChecked;
    const updated = items.map(item => {
      if (!item.isSoldOut) {
        return { ...item, checked: nextState };
      }
      return item;
    });
    cartService.setCartItems(updated);
  };

  const handleDeleteItem = (itemId: string) => {
    const updated = items.filter(item => item.id !== itemId);
    cartService.setCartItems(updated);
  };

  const handleDeleteSelected = () => {
    const hasSelected = items.some(item => item.checked && !item.isSoldOut);
    if (!hasSelected) {
      Alert.alert('알림', '선택된 상품이 없습니다.');
      return;
    }
    Alert.alert(
      '선택 상품 삭제',
      '선택한 상품을 장바구니에서 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const updated = items.filter(item => !item.checked || item.isSoldOut);
            cartService.setCartItems(updated);
          },
        },
      ]
    );
  };

  const handleUpdateQuantity = (itemId: string, increment: number) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        const nextQty = Math.max(1, item.quantity + increment);
        return { ...item, quantity: nextQty };
      }
      return item;
    });
    cartService.setCartItems(updated);
  };

  const handleMergeQuantity = (itemId: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity: item.quantity + 1,
          duplicateWarning: undefined,
        };
      }
      return item;
    });
    cartService.setCartItems(updated);
    Alert.alert('알림', '동일한 상품의 수량이 비빔밥 재료분까지 합쳐졌습니다.');
  };

  const handleSeparatePurchase = (itemId: string) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          duplicateWarning: undefined,
        };
      }
      return item;
    });
    cartService.setCartItems(updated);
  };

  const handleCheckout = () => {
    if (checkedItemsCount === 0) {
      Alert.alert('알림', '결제할 상품을 선택해주세요.');
      return;
    }
    setShowPaymentScreen(true);
  };

  const handlePaymentComplete = () => {
    cartService.checkoutCheckedItems();
    setShowPaymentScreen(false);
    setShowOrderHistory(true);
  };

  const formatPrice = (price: number) => `${price.toLocaleString()}원`;

  if (showOrderHistory) {
    return <OrderHistoryScreen onBack={() => setShowOrderHistory(false)} />;
  }

  if (showAddressScreen) {
    return (
      <DeliveryAddressScreen
        currentAddressId={deliveryAddress.id}
        onBack={() => setShowAddressScreen(false)}
        onSelect={(addr) => {
          setDeliveryAddress(addr);
          setShowAddressScreen(false);
        }}
      />
    );
  }

  if (showPaymentScreen) {
    return (
      <PaymentScreen
        deliveryAddress={deliveryAddress}
        excludedItemCount={totalExcludeCount}
        items={paymentItems}
        onBack={() => setShowPaymentScreen(false)}
        onPaymentComplete={handlePaymentComplete}
        productTotal={totalProductPrice}
        selectedItemCount={checkedItemsCount}
        totalAmount={grandTotal}
        totalDeliveryFee={totalDeliveryFee}
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <Text style={styles.headerTitle}>장바구니</Text>
        <TouchableOpacity style={styles.orderHistoryButton} onPress={() => setShowOrderHistory(true)}>
          <Text style={styles.orderHistoryText}>주문내역</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Delivery Location Section */}
        <View style={styles.locationContainer}>
          <View style={styles.locationInfo}>
            <LocationIcon />
            <View style={styles.locationTextWrapper}>
              <Text style={styles.locationLabel}>배송지</Text>
              <Text style={styles.locationAddress}>
                {deliveryAddress.address}{deliveryAddress.isEarlyMorning ? ' · 새벽배송 가능' : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.changeLocationButton} onPress={() => setShowAddressScreen(true)}>
            <Text style={styles.changeLocationText}>변경</Text>
          </TouchableOpacity>
        </View>

        {/* Global Select Control Bar */}
        <View style={styles.controlBar}>
          <Pressable style={styles.selectAllWrapper} onPress={handleToggleAll}>
            <CheckIcon checked={isAllChecked} />
            <Text style={styles.selectAllText}>
              전체 선택 {checkedItemsCount}/{activeItems.length}
            </Text>
          </Pressable>
          <TouchableOpacity onPress={handleDeleteSelected}>
            <Text style={styles.deleteSelectedText}>선택 삭제</Text>
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            레시피 재료 중 농장 산지상품만 추려 담았습니다.
          </Text>
          <View style={styles.duplicateBadge}>
            <Text style={styles.duplicateBadgeText}>중복 농산물 1건</Text>
          </View>
        </View>

        {/* Farm Groups */}
        {farmCalculations.map(farmCalc => {
          if (farmCalc.items.length === 0) return null;

          return (
            <FarmGroupCard
              key={farmCalc.id}
              farmCalc={farmCalc}
              onToggleFarm={handleToggleFarm}
              onToggleItem={handleToggleItem}
              onDeleteItem={handleDeleteItem}
              onUpdateQuantity={handleUpdateQuantity}
              onMergeQuantity={handleMergeQuantity}
              onSeparatePurchase={handleSeparatePurchase}
            />
          );
        })}

        {/* Payment 예정 금액 Block */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeader}>결제 예정 금액</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>선택 산지상품 금액</Text>
            <Text style={styles.summaryValue}>{formatPrice(totalProductPrice)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>배송비</Text>
            <Text style={styles.summaryValue}>+{formatPrice(totalDeliveryFee)}</Text>
          </View>


          <View style={styles.summaryDivider} />

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>총 결제 금액</Text>
            <Text style={styles.grandTotalValue}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View style={styles.bottomBarContainer}>
        <Text style={styles.bottomBarSummary}>
          선택 산지상품 {checkedItemsCount}개 · 배송비 포함 {formatPrice(grandTotal)}
        </Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>선택 상품 결제하기</Text>
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
  headerSide: {
    flex: 1,
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
  },
  orderHistoryButton: {
    flex: 1,
    alignItems: 'flex-end',
    paddingVertical: spacing.xs,
  },
  orderHistoryText: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  
  // Delivery Location Section
  locationContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  locationInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: spacing.sm,
  },
  locationTextWrapper: {
    flex: 1,
  },
  locationLabel: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '700',
  },
  locationAddress: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  changeLocationButton: {
    borderColor: COLORS.border,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  changeLocationText: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '700',
  },

  // Control Bar Section
  controlBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  selectAllWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  selectAllText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  deleteSelectedText: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '600',
  },

  // Info Banner
  infoBanner: {
    alignItems: 'center',
    backgroundColor: colors.softSurface, // Cool premium neutral soft gray/white background
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  infoBannerText: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '600',
    flex: 1,
  },
  duplicateBadge: {
    marginLeft: spacing.sm,
  },
  duplicateBadgeText: {
    ...typography.caption,
    color: COLORS.primary,
    fontWeight: '800',
  },



  // Summary Card Block
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  summaryHeader: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.mutedText,
    fontWeight: '500',
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  summaryDivider: {
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
    fontWeight: '800',
  },
  grandTotalValue: {
    ...typography.headline,
    color: COLORS.primary,
    fontWeight: '900',
  },

  // Sticky Bottom Action Bar
  bottomBarContainer: {
    ...shadow.soft,
    backgroundColor: colors.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1.5,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  bottomBarSummary: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: radius.sm,
    height: 52,
    justifyContent: 'center',
  },
  checkoutButtonText: {
    ...typography.title,
    color: colors.surface,
    fontWeight: '800',
    textAlign: 'center',
  },
});
