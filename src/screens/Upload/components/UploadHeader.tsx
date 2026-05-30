import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
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

const TRAILING_ICON: Record<string, string> = {
  '다음': 'chevron-forward',
  '업로드': 'cloud-upload-outline',
};

export function UploadHeader({
  title,
  leadingIcon = 'close',
  onLeadingPress,
  trailingLabel,
  onTrailingPress,
  trailingDisabled,
}: UploadHeaderProps) {
  const trailingIcon = trailingLabel ? (TRAILING_ICON[trailingLabel] ?? 'arrow-forward') : null;

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
            pressed && !trailingDisabled && styles.trailingPressed,
          ]}
        >
          <Typography
            variant="captionStrong"
            style={[
              styles.trailingText,
              trailingDisabled ? styles.trailingTextDisabled : styles.trailingTextActive,
            ]}
          >
            {trailingLabel}
          </Typography>
          {trailingIcon && !trailingDisabled && (
            <Icon
              name={trailingIcon}
              size={14}
              color={COLORS.primaryPressed}
              style={styles.trailingIcon}
            />
          )}
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    gap: 2,
  },
  trailingActive: {
    // no background — text only
  },
  trailingDisabled: {
    // no background
  },
  trailingPressed: {
    opacity: 0.5,
  },
  trailingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trailingTextActive: {
    color: COLORS.primaryPressed,
  },
  trailingTextDisabled: {
    color: COLORS.textMuted,
  },
  trailingIcon: {
    marginTop: 1,
  },
  spacer: { width: 32 },
});
