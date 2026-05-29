import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radius, shadow, spacing, typography } from '../../styles/theme';
import { COLORS } from '../../theme/colors';

type FilterType = 'all' | '1month' | '3months' | '6months' | 'custom';

interface FilterBottomSheetProps {
  visible: boolean;
  animValue: Animated.Value;
  tempFilter: FilterType;
  tempStartY: number;
  tempStartM: number;
  tempStartD: number;
  tempEndY: number;
  tempEndM: number;
  tempEndD: number;
  tempDatePicker: 'start' | 'end' | null;
  calY: number;
  calM: number;
  generateMonthDays: (number | null)[];
  onClose: () => void;
  onSetTempFilter: (filter: FilterType) => void;
  onSetTempDatePicker: (picker: 'start' | 'end' | null) => void;
  onToggleDatePicker: (type: 'start' | 'end') => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
  onApply: () => void;
}

const CloseIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={colors.subtleText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function FilterBottomSheet({
  visible,
  animValue,
  tempFilter,
  tempStartY,
  tempStartM,
  tempStartD,
  tempEndY,
  tempEndM,
  tempEndD,
  tempDatePicker,
  calY,
  calM,
  generateMonthDays,
  onClose,
  onSetTempFilter,
  onSetTempDatePicker,
  onToggleDatePicker,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
  onApply,
}: FilterBottomSheetProps) {
  if (!visible) {
    return null;
  }

  const dimmedOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  return (
    <View style={styles.modalOverlay}>
      {/* 반투명 딤드 터치 시 모달 닫기 */}
      <TouchableOpacity
        style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View style={[styles.modalDimmed, { opacity: dimmedOpacity, flex: 1 }]} />
      </TouchableOpacity>

      <Animated.View style={[styles.modalContent, { transform: [{ translateY }], zIndex: 2 }]}>
        {/* 모달 헤더 */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>기간 설정</Text>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
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
                  onSetTempFilter(filter);
                  onSetTempDatePicker(null);
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
              onSetTempFilter('custom');
              onSetTempDatePicker('start');
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
                onPress={() => onToggleDatePicker('start')}
              >
                <Text style={styles.modalDateTabLabel}>시작일</Text>
                <Text style={[styles.modalDateTabValue, tempDatePicker === 'start' && styles.activeModalDateTabValue]}>
                  {`${tempStartY}.${String(tempStartM).padStart(2, '0')}.${String(tempStartD).padStart(2, '0')}`}
                </Text>
              </TouchableOpacity>

              <Text style={styles.modalDateTabSpacer}>~</Text>

              <TouchableOpacity
                style={[styles.modalDateTab, tempDatePicker === 'end' && styles.activeModalDateTab]}
                onPress={() => onToggleDatePicker('end')}
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
                  <TouchableOpacity style={styles.modalMonthNavBtn} onPress={onPrevMonth}>
                    <Text style={styles.modalMonthNavText}>‹</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalCalendarTitle}>{`${calY}년 ${calM}월`}</Text>
                  <TouchableOpacity style={styles.modalMonthNavBtn} onPress={onNextMonth}>
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
                        onPress={() => onSelectDay(day)}
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
        <TouchableOpacity style={styles.applyButton} onPress={onApply}>
          <Text style={styles.applyButtonText}>조회 적용하기</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
