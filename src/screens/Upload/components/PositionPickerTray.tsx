import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PendingTag } from '@/@types/upload';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface PositionPickerTrayProps {
  tags: PendingTag[];
  activeTagId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

/**
 * 위치 지정 화면 하단 — 태그 칩 가로 스크롤.
 * - placed: 연두 배경 ✓
 * - pending: 회색 점선 📍
 * - active: 두꺼운 outline
 */
export function PositionPickerTray({
  tags,
  activeTagId,
  onSelect,
  onRemove,
}: PositionPickerTrayProps) {
  const placedCount = tags.filter(t => t.position != null).length;

  return (
    <View style={styles.container}>
      <Typography
        variant="captionStrong"
        color="textMuted"
        style={styles.title}
      >
        태그 ({placedCount}/{tags.length} 배치됨)
      </Typography>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {tags.map(tag => {
          const isPlaced = tag.position != null;
          const isActive = tag.id === activeTagId;
          return (
            <Pressable
              key={tag.id}
              onPress={() => onSelect(tag.id)}
              style={[
                styles.chip,
                isPlaced ? styles.chipPlaced : styles.chipPending,
                isActive && styles.chipActive,
              ]}
            >
              <Icon
                name={isPlaced ? 'checkmark' : 'location-outline'}
                size={14}
                color={isPlaced ? COLORS.accentText : COLORS.textSecondary}
              />
              <Typography
                variant="captionStrong"
                color={isPlaced ? 'accentText' : 'textSecondary'}
              >
                {tag.label}
              </Typography>
              <Pressable
                onPress={() => onRemove(tag.id)}
                hitSlop={6}
                style={styles.removeBtn}
              >
                <Icon
                  name="close"
                  size={14}
                  color={isPlaced ? COLORS.accentText : COLORS.textMuted}
                />
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.divider,
  },
  title: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  row: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
  },
  chipPlaced: {
    backgroundColor: COLORS.accent,
  },
  chipPending: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  chipActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'solid',
  },
  removeBtn: { padding: 2, marginLeft: 2 },
});
