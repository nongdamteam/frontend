import { StyleSheet, View, TextInput } from 'react-native';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SPACING } from '@/constants/layout';

interface CaptionInputProps {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
}

export function CaptionInput({
  value,
  onChange,
  maxLength = 500,
}: CaptionInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        maxLength={maxLength}
        placeholder="이 콘텐츠를 설명해 주세요... (예: 올봄 첫 봄동 비빔밥 🌱)"
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
      />
      <View style={styles.counterRow}>
        <Typography variant="caption" color="textMuted">
          {value.length} / {maxLength}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  input: {
    minHeight: 84,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
    padding: 0,
  },
  counterRow: {
    alignItems: 'flex-end',
    marginTop: SPACING.xs,
  },
});
