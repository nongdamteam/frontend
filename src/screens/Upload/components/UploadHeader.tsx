import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton } from '@/components/common/IconButton';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface UploadHeaderProps {
  title: string;
  /** 좌측 아이콘 (기본: ✕ 닫기) */
  leadingIcon?: 'close' | 'chevron-back';
  onLeadingPress?: () => void;
  /** 우측 액션 버튼 (예: 다음/완료). 없으면 빈 공간 */
  trailingLabel?: string;
  onTrailingPress?: () => void;
  /** 우측 버튼 활성 여부 */
  trailingDisabled?: boolean;
}

export function UploadHeader({
  title,
  leadingIcon = 'close',
  onLeadingPress,
  trailingLabel,
  onTrailingPress,
  trailingDisabled,
}: UploadHeaderProps) {
  return (
    <View style={styles.container}>
      <IconButton
        name={leadingIcon}
        size={24}
        color="textPrimary"
        onPress={onLeadingPress}
        accessibilityLabel={leadingIcon === 'close' ? '닫기' : '뒤로'}
      />

      <Typography variant="heading3" color="textPrimary">
        {title}
      </Typography>

      {trailingLabel ? (
        <Pressable
          onPress={onTrailingPress}
          disabled={trailingDisabled}
          style={({ pressed }) => [
            styles.trailing,
            {
              backgroundColor: trailingDisabled
                ? COLORS.surfaceMuted
                : COLORS.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Typography
            variant="captionStrong"
            color={trailingDisabled ? 'textMuted' : 'textOnPrimary'}
          >
            {trailingLabel}
          </Typography>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  trailing: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
  },
  spacer: { width: 32 },
});
