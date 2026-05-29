import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SPACING } from '@/constants/layout';

export type MediaSource = 'gallery' | 'photo' | 'video';

interface MediaSourceTabsProps {
  value: MediaSource;
  onChange: (next: MediaSource) => void;
}

const TABS: { key: MediaSource; label: string }[] = [
  { key: 'gallery', label: '갤러리' },
  { key: 'photo', label: '사진 촬영' },
  { key: 'video', label: '영상 촬영' },
];

export function MediaSourceTabs({ value, onChange }: MediaSourceTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const selected = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              selected && styles.tabSelected,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Typography
              variant={selected ? 'bodyStrong' : 'body'}
              color={selected ? 'textPrimary' : 'textMuted'}
            >
              {tab.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  tab: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabSelected: {
    borderBottomColor: COLORS.textPrimary,
  },
});
