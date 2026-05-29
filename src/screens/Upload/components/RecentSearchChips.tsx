import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface RecentSearchChipsProps {
  keywords: string[];
  onPress: (keyword: string) => void;
}

export function RecentSearchChips({ keywords, onPress }: RecentSearchChipsProps) {
  if (keywords.length === 0) return null;

  return (
    <View>
      <Typography
        variant="captionStrong"
        color="textMuted"
        style={styles.title}
      >
        최근 검색
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {keywords.map(kw => (
          <Pressable
            key={kw}
            onPress={() => onPress(kw)}
            style={({ pressed }) => [styles.chip, pressed && { opacity: 0.7 }]}
          >
            <Typography variant="captionStrong" color="textSecondary">
              {kw}
            </Typography>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.pill,
  },
});
