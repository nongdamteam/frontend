import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../styles/theme';
import { COLORS } from '../theme/colors';
import { cartImages } from '../data/cartImages';
import { FarmGroupCard } from '../components/cart/FarmGroupCard';

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

const initialItems: CartItem[] = [
  {
    id: 'nei_300g',
    farmId: 'cheorwon',
    title: '철원 냉이 300g',
    option: '옵션: 300g · 노지 봄나물 · 산지직송',
    recipeSource: '냉이 된장국 레시피에서 추가됨',
    unitPrice: 5900,
    quantity: 2,
    checked: true,
    duplicateWarning: {
      message: '중복 농산물: 봄나물 비빔밥에도 담김',
      show: true,
    },
    image: cartImages.products.nei,
  },
  {
    id: 'rice_2kg',
    farmId: 'cheorwon',
    title: '철원 오대쌀 2kg',
    option: '옵션: 2kg · 2026년 햅쌀 · 농장 도정',
    recipeSource: '냉이 된장국 한상에서 추가됨',
    unitPrice: 9800,
    quantity: 1,
    checked: true,
    image: cartImages.products.rice,
  },
  {
    id: 'mushroom_200g',
    farmId: 'cheorwon',
    title: '영양 생표고버섯 200g',
    option: '옵션: 200g · 무농약 · 당일 선별',
    recipeSource: '버섯 솥밥 레시피에서 추가됨',
    unitPrice: 6300,
    quantity: 1,
    checked: true,
    image: cartImages.products.mushroom,
  },
  {
    id: 'bomdong_1',
    farmId: 'haenam',
    title: '해남 봄동 1포기',
    option: '옵션: 1포기 · 겉절이용 · 당일 수확',
    recipeSource: '봄동 겉절이 레시피에서 추가됨',
    unitPrice: 4500,
    originalUnitPrice: 4200,
    quantity: 1,
    checked: true,
    priceChangedNote: '수확량 감소로 담을 때보다 300원 올랐습니다.',
    image: cartImages.products.bomdong,
  },
  {
    id: 'sebal_200g',
    farmId: 'haenam',
    title: '해남 세발나물 200g',
    option: '옵션: 200g · 갯벌 노지재배 · 냉장',
    recipeSource: '봄나물 비빔밥에서 추가됨',
    unitPrice: 2900,
    quantity: 1,
    checked: false,
    isSoldOut: true,
    image: cartImages.products.sebal,
  },
];

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [farms, setFarms] = useState<Farm[]>(initialFarms);

  const BackIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M15 19L8 12L15 5" stroke={colors.mutedText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );

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

  const handleToggleItem = (itemId: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId && !item.isSoldOut) {
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );
  };

  const handleToggleFarm = (farmId: string, currentAllChecked: boolean) => {
    setItems(prev =>
      prev.map(item => {
        if (item.farmId === farmId && !item.isSoldOut) {
          return { ...item, checked: !currentAllChecked };
        }
        return item;
      })
    );
  };

  const handleToggleAll = () => {
    const nextState = !isAllChecked;
    setItems(prev =>
      prev.map(item => {
        if (!item.isSoldOut) {
          return { ...item, checked: nextState };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
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
            setItems(prev => prev.filter(item => !item.checked || item.isSoldOut));
          },
        },
      ]
    );
  };

  const handleUpdateQuantity = (itemId: string, increment: number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const nextQty = Math.max(1, item.quantity + increment);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const handleMergeQuantity = (itemId: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
            duplicateWarning: undefined,
          };
        }
        return item;
      })
    );
    Alert.alert('알림', '동일한 상품의 수량이 비빔밥 재료분까지 합쳐졌습니다.');
  };

  const handleSeparatePurchase = (itemId: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            duplicateWarning: undefined,
          };
        }
        return item;
      })
    );
  };

  const handleCheckout = () => {
    if (checkedItemsCount === 0) {
      Alert.alert('알림', '결제할 상품을 선택해주세요.');
      return;
    }
    Alert.alert('주문 완료', `총 ${checkedItemsCount}개의 상품 ${grandTotal.toLocaleString()}원 결제가 진행됩니다.`);
  };

  const formatPrice = (price: number) => `${price.toLocaleString()}원`;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>장바구니</Text>
        <TouchableOpacity style={styles.orderHistoryButton}>
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
              <Text style={styles.locationAddress}>서울 강남구 테헤란로 · 산지직송 가능</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.changeLocationButton}>
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

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>품절/미선택 제외</Text>
            <Text style={styles.summaryValue}>{totalExcludeCount}개</Text>
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
    backgroundColor: colors.background,
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
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
  },
  orderHistoryButton: {
    paddingVertical: spacing.xs,
  },
  orderHistoryText: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
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
