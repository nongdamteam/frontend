import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../styles/theme';
import { COLORS } from '../theme/colors';
import BackButton from '../components/common/BackButton';

export interface DeliveryAddress {
  id: string;
  label: string;      // 집, 회사, 등
  address: string;    // 도로명 주소
  detail?: string;    // 상세주소
  isEarlyMorning: boolean;
}

interface DeliveryAddressScreenProps {
  currentAddressId: string;
  onBack: () => void;
  onSelect: (address: DeliveryAddress) => void;
}

const mockAddresses: DeliveryAddress[] = [
  {
    id: 'addr-1',
    label: '집',
    address: '서울 강남구 테헤란로 152',
    detail: '강남파이낸스센터 10층',
    isEarlyMorning: true,
  },
  {
    id: 'addr-2',
    label: '회사',
    address: '서울 마포구 월드컵북로 400',
    detail: 'DMC 첨단산업센터 7층',
    isEarlyMorning: false,
  },
  {
    id: 'addr-3',
    label: '부모님댁',
    address: '경기 고양시 일산동구 장항동 865',
    detail: '킨텍스 1층',
    isEarlyMorning: true,
  },
];


const PlusIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const CheckCircleIcon = ({ active }: { active: boolean }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" fill={active ? COLORS.primary : 'none'} stroke={active ? COLORS.primary : colors.placeholderDark} strokeWidth="1.5" />
    {active && (
      <Path d="M7 12L10.5 15.5L17 8.5" stroke={colors.surface} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </Svg>
);

const LocationPinIcon = ({ color }: { color: string }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
      fill={color}
    />
  </Svg>
);

export default function DeliveryAddressScreen({
  currentAddressId,
  onBack,
  onSelect,
}: DeliveryAddressScreenProps) {
  const [selectedId, setSelectedId] = useState(currentAddressId);

  const handleConfirm = () => {
    const selected = mockAddresses.find(a => a.id === selectedId);
    if (selected) {
      onSelect(selected);
    }
  };

  const handleAddNew = () => {
    Alert.alert('새 배송지 추가', '주소 검색 기능은 준비 중입니다.');
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <Text style={styles.headerTitle}>배송지 변경</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 새 배송지 추가 버튼 */}
        <TouchableOpacity style={styles.addNewButton} onPress={handleAddNew} activeOpacity={0.7}>
          <PlusIcon />
          <Text style={styles.addNewText}>새 배송지 추가</Text>
        </TouchableOpacity>

        {/* 저장된 주소 목록 */}
        <Text style={styles.sectionTitle}>저장된 배송지</Text>

        {mockAddresses.map(addr => {
            const isSelected = addr.id === selectedId;
            return (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, isSelected && styles.addressCardSelected]}
                onPress={() => setSelectedId(addr.id)}
                activeOpacity={0.75}
              >
                <View style={styles.addressCardLeft}>
                  <View style={styles.addressLabelRow}>
                    <LocationPinIcon color={isSelected ? COLORS.primary : colors.mutedText} />
                    <Text style={[styles.addressLabel, isSelected && styles.addressLabelSelected]}>
                      {addr.label}
                    </Text>
                    {addr.isEarlyMorning && (
                      <View style={styles.earlyBadge}>
                        <Text style={styles.earlyBadgeText}>새벽배송 가능</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressText} numberOfLines={1}>{addr.address}</Text>
                  {addr.detail ? (
                    <Text style={styles.addressDetail} numberOfLines={1}>{addr.detail}</Text>
                  ) : null}
                </View>
                <CheckCircleIcon active={isSelected} />
              </TouchableOpacity>
            );
          })}
      </ScrollView>

      {/* 하단 확정 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.85}>
          <Text style={styles.confirmButtonText}>이 주소로 배송받기</Text>
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

  // Header
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
    fontWeight: '800',
  },
  headerSpacer: {
    width: 32,
  },

  // 스크롤
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },

  // 새 배송지 추가
  addNewButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: COLORS.primary,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
  },
  addNewText: {
    ...typography.body,
    color: COLORS.primary,
    fontWeight: '700',
  },

  // 섹션 타이틀
  sectionTitle: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },

  // 주소 카드
  addressCard: {
    ...shadow.soft,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  addressCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF9F9',
  },
  addressCardLeft: {
    flex: 1,
    gap: 3,
  },
  addressLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: 2,
  },
  addressLabel: {
    ...typography.body,
    color: colors.subtleText,
    fontWeight: '700',
    fontSize: 14,
  },
  addressLabelSelected: {
    color: COLORS.primary,
  },
  earlyBadge: {
    backgroundColor: '#FFF0F1',
    borderRadius: radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  earlyBadgeText: {
    ...typography.badge,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 9,
  },
  addressText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  addressDetail: {
    ...typography.caption,
    color: colors.mutedText,
    fontWeight: '500',
  },

  // 하단 확정 버튼
  bottomBar: {
    ...shadow.soft,
    backgroundColor: colors.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    position: 'absolute',
    right: 0,
  },
  confirmButton: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: radius.sm,
    height: 52,
    justifyContent: 'center',
  },
  confirmButtonText: {
    ...typography.title,
    color: colors.surface,
    fontWeight: '800',
  },
});
