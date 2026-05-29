import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ImageSourcePropType,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../styles/theme';
import { COLORS } from '../theme/colors';
import { cartImages } from '../data/cartImages';

interface OrderItem {
  id: string;
  title: string;
  option: string;
  quantity: number;
  price: number;
  image: ImageSourcePropType | string;
}

interface OrderGroup {
  orderId: string;
  orderDate: string;
  farmName: string;
  deliveryType: 'early_morning' | 'normal';
  status: 'completed' | 'shipping' | 'success'; // completed: 배송완료, shipping: 배송중, success: 공구성공
  items: OrderItem[];
  totalPrice: number;
  deliveryFee: number;
}

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

const BackIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M15 19L8 12L15 5" stroke={colors.mutedText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FilterIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke={COLORS.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={colors.subtleText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={COLORS.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

function imageSource(image: ImageSourcePropType | string) {
  return typeof image === 'string' ? { uri: image } : image;
}

export default function OrderHistoryScreen({ onBack }: { onBack: () => void }) {
  // 실제 적용 필터 상태
  const [activeFilter, setActiveFilter] = React.useState<'1month' | '3months' | '6months' | 'all' | 'custom'>('all');
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

  const dimmedOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  // 모달 내부 임시 필터 상태
  const [tempFilter, setTempFilter] = React.useState<'1month' | '3months' | '6months' | 'all' | 'custom'>('all');
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

  const getStatusLabel = (status: OrderGroup['status']) => {
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
  };

  const getStatusBadgeStyle = (status: OrderGroup['status']) => {
    switch (status) {
      case 'shipping':
        return [styles.statusBadge, styles.shippingBg];
      case 'completed':
        return [styles.statusBadge, styles.completedBg];
      case 'success':
        return [styles.statusBadge, styles.successBg];
      default:
        return styles.statusBadge;
    }
  };

  const getStatusTextStyle = (status: OrderGroup['status']) => {
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
  };

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
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>구매내역</Text>
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

      {/* 고급 플로팅 팝업 모달 */}
      {isModalRendering && (
        <View style={styles.modalOverlay}>
          {/* 반투명 딤드 터치 시 모달 닫기 */}
          <TouchableOpacity
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          >
            <Animated.View style={[styles.modalDimmed, { opacity: dimmedOpacity, flex: 1 }]} />
          </TouchableOpacity>

          <Animated.View style={[styles.modalContent, { transform: [{ translateY }], zIndex: 2 }]}>
            {/* 모달 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>기간 설정</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowFilterModal(false)}>
                <CloseIcon />
              </TouchableOpacity>
            </View>

            {/* 1단계: 퀵 필터 칩 */}
            <View style={styles.quickFilterRow}>
              {(['all', '1month', '3months', '6months'] as const).map(filter => {
                const isActive = tempFilter === filter;
                let label = '';
                if (filter === 'all') label = '전체';
                else if (filter === '1month') label = '1개월';
                else if (filter === '3months') label = '3개월';
                else if (filter === '6months') label = '6개월';

                return (
                  <TouchableOpacity
                    key={filter}
                    style={[styles.quickChip, isActive && styles.activeQuickChip]}
                    onPress={() => {
                      setTempFilter(filter);
                      setTempDatePicker(null);
                    }}
                  >
                    <Text style={[styles.quickChipText, isActive && styles.activeQuickChipText]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* 직접 설정 칩 */}
              <TouchableOpacity
                style={[styles.quickChip, tempFilter === 'custom' && styles.activeQuickChip]}
                onPress={() => {
                  setTempFilter('custom');
                  setTempDatePicker('start');
                  setCalY(tempStartY);
                  setCalM(tempStartM);
                }}
              >
                <Text style={[styles.quickChipText, tempFilter === 'custom' && styles.activeQuickChipText]}>
                  직접 설정
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2단계: 직접 설정 전용 캘린더 영역 */}
            {tempFilter === 'custom' && (
              <View style={styles.modalCalendarSection}>
                {/* 시작일 / 종료일 선택 탭 */}
                <View style={styles.modalDateTabs}>
                  <TouchableOpacity
                    style={[styles.modalDateTab, tempDatePicker === 'start' && styles.activeModalDateTab]}
                    onPress={() => handleToggleDatePicker('start')}
                  >
                    <Text style={styles.modalDateTabLabel}>시작일</Text>
                    <Text style={[styles.modalDateTabValue, tempDatePicker === 'start' && styles.activeModalDateTabValue]}>
                      {`${tempStartY}.${String(tempStartM).padStart(2, '0')}.${String(tempStartD).padStart(2, '0')}`}
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.modalDateTabSpacer}>~</Text>

                  <TouchableOpacity
                    style={[styles.modalDateTab, tempDatePicker === 'end' && styles.activeModalDateTab]}
                    onPress={() => handleToggleDatePicker('end')}
                  >
                    <Text style={styles.modalDateTabLabel}>종료일</Text>
                    <Text style={[styles.modalDateTabValue, tempDatePicker === 'end' && styles.activeModalDateTabValue]}>
                      {`${tempEndY}.${String(tempEndM).padStart(2, '0')}.${String(tempEndD).padStart(2, '0')}`}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 캘린더 판넬 */}
                {tempDatePicker && (
                  <View style={styles.modalCalendarPanel}>
                    <View style={styles.modalCalendarHeader}>
                      <TouchableOpacity style={styles.modalMonthNavBtn} onPress={handlePrevMonth}>
                        <Text style={styles.modalMonthNavText}>‹</Text>
                      </TouchableOpacity>
                      <Text style={styles.modalCalendarTitle}>{`${calY}년 ${calM}월`}</Text>
                      <TouchableOpacity style={styles.modalMonthNavBtn} onPress={handleNextMonth}>
                        <Text style={styles.modalMonthNavText}>›</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalDayLabelsRow}>
                      {['일', '월', '화', '수', '목', '금', '토'].map(label => (
                        <Text key={label} style={styles.modalDayLabelText}>{label}</Text>
                      ))}
                    </View>

                    <View style={styles.modalDaysGrid}>
                      {generateMonthDays.map((day, index) => {
                        if (day === null) {
                          return <View key={`empty-${index}`} style={styles.modalEmptyDayCell} />;
                        }

                        const isSelected =
                          tempDatePicker === 'start'
                            ? (calY === tempStartY && calM === tempStartM && day === tempStartD)
                            : (calY === tempEndY && calM === tempEndM && day === tempEndD);

                        return (
                          <TouchableOpacity
                            key={`day-${day}`}
                            style={[styles.modalDayCell, isSelected && styles.modalSelectedDayCell]}
                            onPress={() => handleSelectDay(day)}
                          >
                            <Text style={[styles.modalDayCellText, isSelected && styles.modalSelectedDayCellText]}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* 적용하기 버튼 */}
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
              <Text style={styles.applyButtonText}>조회 적용하기</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>선택한 기간 내 구매한 내역이 없습니다.</Text>
          </View>
        ) : (
          filteredOrders.map(group => (
            <View key={group.orderId} style={styles.orderCard}>
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
                  group.deliveryType === 'early_morning' ? styles.earlyDeliveryBg : styles.normalDeliveryBg
                ]}>
                  <Text style={[
                    styles.deliveryBadgeText,
                    group.deliveryType === 'early_morning' ? styles.earlyDeliveryText : styles.normalDeliveryText
                  ]}>
                    {group.deliveryType === 'early_morning' ? '새벽배송' : '일반배송'}
                  </Text>
                </View>
              </View>

              {/* Items List */}
              {group.items.map(item => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemMain}>
                    <Image
                      source={imageSource(item.image)}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemOption}>{item.option}</Text>
                      <Text style={styles.itemPrice}>
                        {item.price.toLocaleString()}원 · {item.quantity}개
                      </Text>
                    </View>
                  </View>

                  {/* Actions for each item */}
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.subActionButton}
                      onPress={() => handleReorder(item.title)}
                    >
                      <Text style={styles.subActionText}>다시 담기</Text>
                    </TouchableOpacity>
                    {group.status === 'completed' && (
                      <TouchableOpacity
                        style={[styles.subActionButton, styles.reviewButton]}
                        onPress={() => handleWriteReview(item.title)}
                      >
                        <Text style={[styles.subActionText, styles.reviewButtonText]}>리뷰 작성</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              <View style={styles.cardDivider} />

              {/* Total Payment Footer */}
              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>총 결제금액</Text>
                <Text style={styles.totalPrice}>
                  {group.totalPrice.toLocaleString()}원
                  <Text style={styles.deliveryFeeNote}>
                    {group.deliveryFee > 0 ? ` (배송비 ${group.deliveryFee.toLocaleString()}원 포함)` : ' (무료배송)'}
                  </Text>
                </Text>
              </View>


            </View>
          ))
        )}
      </ScrollView>
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
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
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

  // Card 스타일
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

  // 배송 상태 배지
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

  // 농가 헤더
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

  // 상품 아이템
  itemRow: {
    marginTop: spacing.md,
  },
  itemMain: {
    flexDirection: 'row',
  },
  productImage: {
    backgroundColor: '#FAFAF8',
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 64,
    width: 64,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  itemOption: {
    ...typography.caption,
    color: colors.mutedText,
    marginTop: 2,
    fontWeight: '500',
  },
  itemPrice: {
    ...typography.body,
    color: colors.text,
    marginTop: 4,
    fontWeight: '800',
    fontSize: 13,
  },

  // 아이템별 서브 액션 버튼
  itemActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    paddingLeft: 74,
  },
  subActionButton: {
    borderColor: COLORS.border,
    borderRadius: radius.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  subActionText: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '700',
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reviewButtonText: {
    color: colors.surface,
  },

  cardDivider: {
    backgroundColor: colors.softSurface,
    height: 1,
    marginVertical: spacing.md,
  },

  // 결제 금액 푸터
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

  // 메인 액션 버튼 (배송 조회)
  mainActionButton: {
    borderColor: COLORS.primary,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  mainActionText: {
    ...typography.body,
    color: COLORS.primary,
    fontWeight: '800',
  },

  // 심플 필터 정보 바 스타일
  filterInfoBar: {
    backgroundColor: 'transparent',
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

  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  modalDimmed: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl + 8,
    maxHeight: '85%',
    ...shadow.soft,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
  },
  modalCloseBtn: {
    padding: spacing.xs,
  },

  // 1단계: 퀵 필터 칩 스타일
  quickFilterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  quickChip: {
    flex: 1,
    minWidth: 60,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FAFAF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeQuickChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickChipText: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '800',
  },
  activeQuickChipText: {
    color: colors.surface,
  },

  // 2단계: 직접 설정 영역 스타일
  modalCalendarSection: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F3',
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  modalDateTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  modalDateTab: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activeModalDateTab: {
    borderColor: COLORS.primary,
    backgroundColor: colors.surface,
  },
  modalDateTabLabel: {
    ...typography.caption,
    color: colors.placeholderDark,
    fontWeight: '700',
    fontSize: 10,
    marginBottom: 2,
  },
  modalDateTabValue: {
    ...typography.body,
    color: colors.subtleText,
    fontWeight: '700',
    fontSize: 13,
  },
  activeModalDateTabValue: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  modalDateTabSpacer: {
    ...typography.title,
    color: colors.placeholderDark,
    fontWeight: '700',
  },

  // 캘린더 패널 스타일
  modalCalendarPanel: {
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    ...shadow.soft,
  },
  modalCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalMonthNavBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: '#FAFAF8',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: radius.xs,
  },
  modalMonthNavText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.subtleText,
  },
  modalCalendarTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
  },
  modalDayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xs,
    paddingBottom: 4,
    borderBottomColor: '#F5F5F3',
    borderBottomWidth: 1,
  },
  modalDayLabelText: {
    ...typography.badge,
    color: colors.placeholderDark,
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '700',
  },
  modalDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.xs,
  },
  modalDayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  modalSelectedDayCell: {
    backgroundColor: COLORS.primary,
  },
  modalDayCellText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700',
  },
  modalSelectedDayCellText: {
    color: colors.surface,
  },
  modalEmptyDayCell: {
    width: '14.28%',
    aspectRatio: 1,
  },

  // 모달 하단 확정 적용 버튼
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: radius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  applyButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '800',
  },
});
