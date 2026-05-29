import { StyleSheet, Switch, View } from 'react-native';
import { UploadPrivacy } from '@/@types/upload';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SPACING } from '@/constants/layout';

interface PrivacySettingsProps {
  value: UploadPrivacy;
  onChange: (next: Partial<UploadPrivacy>) => void;
}

interface RowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (next: boolean) => void;
  hasDivider?: boolean;
}

function Row({ label, description, value, onChange, hasDivider }: RowProps) {
  return (
    <View style={[styles.row, hasDivider && styles.rowDivider]}>
      <View style={styles.rowText}>
        <Typography variant="bodyStrong" color="textPrimary">
          {label}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {description}
        </Typography>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    </View>
  );
}

export function PrivacySettings({ value, onChange }: PrivacySettingsProps) {
  return (
    <View style={styles.container}>
      <Typography variant="bodyStrong" color="textPrimary" style={styles.title}>
        공개 설정
      </Typography>
      <Row
        label="공개"
        description="모든 사용자에게 공개"
        value={value.isPublic}
        onChange={next => onChange({ isPublic: next })}
      />
      <Row
        label="댓글 허용"
        description="다른 사용자가 댓글을 달 수 있어요"
        value={value.allowComments}
        onChange={next => onChange({ allowComments: next })}
        hasDivider
      />
      <Row
        label="좋아요 수 숨기기"
        description="본인 외에는 좋아요 수가 보이지 않아요"
        value={value.hideLikes}
        onChange={next => onChange({ hideLikes: next })}
        hasDivider
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.divider,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.divider,
  },
  rowText: { flex: 1, gap: SPACING.xs },
});
