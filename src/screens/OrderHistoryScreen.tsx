import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageSourcePropType,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, spacing, typography } from '../styles/theme';
import { COLORS } from '../theme/colors';
import { cartImages } from '../data/cartImages';
import OrderCard, { OrderGroup } from '../components/orderHistory/OrderCard';
import FilterBottomSheet from '../components/orderHistory/FilterBottomSheet';
import BackButton from '../components/common/BackButton';

const mockOrders: OrderGroup[] = [
  {
    orderId: 'ORD-20260528-084',
    orderDate: '2026.05.28',
    farmName: '철원 들녘농장',
    deliveryType: 'early_morning',
    status: 'shipping',
    totalPrice: 21600,
    deliveryFee: 3000,
    items: [
      {
        id: 'nei_300g',
        title: '철원 냉이 300g',
        option: '옵션: 300g · 노지 봄나물 · 산지직송',
        quantity: 2,
        price: 5900,
        image: cartImages.products.nei,
      },
      {
        id: 'mushroom_200g',
        title: '영양 생표고버섯 200g',
        option: '옵션: 200g · 무농약 · 당일 선별',
        quantity: 1,
        price: 6300,
        image: cartImages.products.mushroom,
      },
    ],
  },
  {
    orderId: 'ORD-20260515-021',
    orderDate: '2026.05.15',
    farmName: '해남 땅끝농장',
    deliveryType: 'normal',
    status: 'completed',
    totalPrice: 12500,
    deliveryFee: 3500,
    items: [
      {
        id: 'bomdong_1',
        title: '해남 봄동 1포기',
        option: '옵션: 1포기 · 겉절이용 · 당일 수확',
        quantity: 2,
        price: 4500,
        image: cartImages.products.bomdong,
      },
    ],
  },
  {
    orderId: 'ORD-20260410-092',
    orderDate: '2026.04.10',
    farmName: '철원 들녘농장',
    deliveryType: 'early_morning',
    status: 'success',
    totalPrice: 9800,
    deliveryFee: 0,
    items: [
      {
        id: 'rice_2kg',
        title: '철원 오대쌀 2kg',
        option: '옵션: 2kg · 2026년 햅쌀 · 농장 도정',
        quantity: 1,
        price: 9800,
        image: cartImages.products.rice,
      },
    ],
  },
  {
    orderId: 'ORD-20260218-042',
    orderDate: '2026.02.18',
    farmName: '해남 땅끝농장',
    deliveryType: 'normal',
    status: 'completed',
    totalPrice: 5800,
    deliveryFee: 3500,
    items: [
      {
        id: 'sebal_200g',
        title: '해남 세발나물 200g',
        option: '옵션: 200g · 갯벌 노지재배 · 냉장',
        quantity: 2,
        price: 2900,
        image: cartImages.products.sebal,
      },
    ],
  },
  {
    orderId: 'ORD-20251105-015',
    orderDate: '2025.11.05',
    farmName: '철원 들녘농장',
    deliveryType: 'early_morning',
    status: 'completed',
    totalPrice: 12700,
    deliveryFee: 3000,
    items: [
      {
        id: 'mushroom_200g_2',
        title: '영양 생표고버섯 200g',
        option: '옵션: 200g · 무농약 · 당일 선별',
        quantity: 2,
        price: 6350,
        image: cartImages.products.mushroom,
      },
    ],
  },
];


const FilterIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={COLORS.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type FilterType = 'all' | '1month' | '3months' | '6months' | 'custom';

export default function OrderHistoryScreen({ onBack }: { onBack: () => void }) {
  // 실제 적용 필터 상태
  const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');
  const [startY, setStartY] = React.useState(2026);
  const [startM, setStartM] = React.useState(1);
  const [startD, setStartD] = React.useState(1);
  const [endY, setEndY] = React.useState(2026);
  const [endM, setEndM] = React.useState(5);
  const [endD, setEndD] = React.useState(29);

  // 모달 제어 상태
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [isModalRendering, setIsModalRendering] = React.useState(false);

  // 애니메이션 제어 값
  const animValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (showFilterModal) {
      setIsModalRendering(true);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsModalRendering(false);
      });
    }
  }, [showFilterModal]);

  // 모달 내부 임시 필터 상태
  const [tempFilter, setTempFilter] = React.useState<FilterType>('all');
  const [tempStartY, setTempStartY] = React.useState(2026);
  const [tempStartM, setTempStartM] = React.useState(1);
  const [tempStartD, setTempStartD] = React.useState(1);
  const [tempEndY, setTempEndY] = React.useState(2026);
  const [tempEndM, setTempEndM] = React.useState(5);
  const [tempEndD, setTempEndD] = React.useState(29);

  // 모달 내부 달력 모드 ('start' | 'end' | null)
  const [tempDatePicker, setTempDatePicker] = React.useState<'start' | 'end' | null>(null);

  // 달력 탐색 연월 상태
  const [calY, setCalY] = React.useState(2026);
  const [calM, setCalM] = React.useState(5);

  const filteredOrders = React.useMemo(() => {
    const now = new Date(2026, 4, 29);

    return mockOrders.filter(order => {
      const parts = order.orderDate.split('.');
      const orderDateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const diffTime = Math.abs(now.getTime() - orderDateObj.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (activeFilter === '1month') {
        return diffDays <= 30;
      } else if (activeFilter === '3months') {
        return diffDays <= 90;
      } else if (activeFilter === '6months') {
        return diffDays <= 180;
      } else if (activeFilter === 'custom') {
        const startLimit = new Date(startY, startM - 1, startD);
        const endLimit = new Date(endY, endM - 1, endD);
        return orderDateObj >= startLimit && orderDateObj <= endLimit;
      }
      return true;
    });
  }, [activeFilter, startY, startM, startD, endY, endM, endD]);

  const handleToggleDatePicker = (type: 'start' | 'end') => {
    if (tempDatePicker === type) {
      setTempDatePicker(null);
    } else {
      setTempDatePicker(type);
      if (type === 'start') {
        setCalY(tempStartY);
        setCalM(tempStartM);
      } else {
        setCalY(tempEndY);
        setCalM(tempEndM);
      }
    }
  };

  const handlePrevMonth = () => {
    setCalM(prev => {
      if (prev === 1) {
        setCalY(y => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCalM(prev => {
      if (prev === 12) {
        setCalY(y => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };

  const handleSelectDay = (day: number) => {
    if (tempDatePicker === 'start') {
      setTempStartY(calY);
      setTempStartM(calM);
      setTempStartD(day);
      setTempDatePicker('end');
      setCalY(tempEndY);
      setCalM(tempEndM);
    } else if (tempDatePicker === 'end') {
      setTempEndY(calY);
      setTempEndM(calM);
      setTempEndD(day);
      setTempDatePicker(null);
    }
  };

  const handleApplyFilter = () => {
    const startDate = new Date(tempStartY, tempStartM - 1, tempStartD);
    const endDate = new Date(tempEndY, tempEndM - 1, tempEndD);

    if (tempFilter === 'custom' && startDate > endDate) {
      Alert.alert('날짜 설정 오류', '시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    setActiveFilter(tempFilter);
    setStartY(tempStartY);
    setStartM(tempStartM);
    setStartD(tempStartD);
    setEndY(tempEndY);
    setEndM(tempEndM);
    setEndD(tempEndD);
    setShowFilterModal(false);
  };

  const generateMonthDays = React.useMemo(() => {
    const firstDayIndex = new Date(calY, calM - 1, 1).getDay();
    const totalDays = new Date(calY, calM, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(d);
    }
    return days;
  }, [calY, calM]);

  const handleReorder = (itemTitle: string) => {
    Alert.alert('장바구니 담기', `"${itemTitle}" 상품을 장바구니에 다시 담았습니다.`);
  };

  const handleWriteReview = (itemTitle: string) => {
    Alert.alert('리뷰 작성', `"${itemTitle}" 상품의 소중한 의견을 작성해 주세요.`);
  };

  const getFilterLabelText = () => {
    if (activeFilter === 'all') return '전체 기간';
    if (activeFilter === '1month') return '최근 1개월';
    if (activeFilter === '3months') return '최근 3개월';
    if (activeFilter === '6months') return '최근 6개월';
    if (activeFilter === 'custom') {
      return `${startY}.${String(startM).padStart(2, '0')}.${String(startD).padStart(2, '0')} ~ ${endY}.${String(endM).padStart(2, '0')}.${String(endD).padStart(2, '0')}`;
    }
    return '전체';
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>주문내역</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 심플 필터 정보 바 (우측 정렬 가변 텍스트 드롭다운 버튼) */}
      <View style={styles.filterInfoBar}>
        <TouchableOpacity
          style={styles.filterTriggerButton}
          onPress={() => {
            // 모달 오픈 전 임시 상태를 기존 실제 필터 상태로 동기화
            setTempFilter(activeFilter);
            setTempStartY(startY);
            setTempStartM(startM);
            setTempStartD(startD);
            setTempEndY(endY);
            setTempEndM(endM);
            setTempEndD(endD);
            setTempDatePicker(activeFilter === 'custom' ? 'start' : null);
            setCalY(activeFilter === 'custom' ? startY : 2026);
            setCalM(activeFilter === 'custom' ? startM : 5);
            setShowFilterModal(true);
          }}
        >
          <Text style={styles.filterTriggerValueText}>{getFilterLabelText()}</Text>
          <ChevronDownIcon />
        </TouchableOpacity>
      </View>

      {/* 기간 필터 바텀 시트 */}
      <FilterBottomSheet
        visible={isModalRendering}
        animValue={animValue}
        tempFilter={tempFilter}
        tempStartY={tempStartY}
        tempStartM={tempStartM}
        tempStartD={tempStartD}
        tempEndY={tempEndY}
        tempEndM={tempEndM}
        tempEndD={tempEndD}
        tempDatePicker={tempDatePicker}
        calY={calY}
        calM={calM}
        generateMonthDays={generateMonthDays}
        onClose={() => setShowFilterModal(false)}
        onSetTempFilter={setTempFilter}
        onSetTempDatePicker={setTempDatePicker}
        onToggleDatePicker={handleToggleDatePicker}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onSelectDay={handleSelectDay}
        onApply={handleApplyFilter}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>선택한 기간 내 구매한 내역이 없습니다.</Text>
          </View>
        ) : (
          filteredOrders.map(group => (
            <OrderCard
              key={group.orderId}
              group={group}
              onReorder={handleReorder}
              onWriteReview={handleWriteReview}
            />
          ))
        )}
      </ScrollView>
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
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    ...typography.body,
    color: colors.mutedText,
    fontWeight: '600',
  },
  filterInfoBar: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 0,
  },
  filterTriggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  filterTriggerValueText: {
    ...typography.caption,
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 13,
  },
});
