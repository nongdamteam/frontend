import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PendingTag } from '@/@types/upload';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface TagTrayProps {
  tags: PendingTag[];
  onAddPress: () => void;
  onTagPress?: (tag: PendingTag) => void;
  onTagRemove?: (id: string) => void;
}

/**
 * 정보 입력 화면 하단의 태그 칩 리스트.
 * - position 있음: "✓ 봄동" (정상 칩)
 * - position null: "📍 봄동 (위치 지정 필요)" (점선 테두리)
 * - "＋ 상품 태그 추가" 버튼은 항상 노출
 */
export function TagTray({
  tags,
  onAddPress,
  onTagPress,
  onTagRemove,
}: TagTrayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="bodyStrong" color="textPrimary">
          상품 태그
        </Typography>
        <Typography variant="caption" color="textMuted">
          {tags.length > 0 ? `${tags.length}개 추가됨` : '추가된 태그 없음'}
        </Typography>
      </View>

      <Typography variant="caption" color="textMuted" style={styles.helper}>
        콘텐츠에 등장하는 상품을 태그하면 사용자가 바로 구매할 수 있어요.
      </Typography>

      {tags.length > 0 ? (
        <View style={styles.chipList}>
          {tags.map(tag => {
            const isPlaced = tag.position != null;
            return (
              <View
                key={tag.id}
                style={[styles.chip, !isPlaced && styles.chipPending]}
              >
                <Pressable
                  onPress={() => onTagPress?.(tag)}
                  style={styles.chipBody}
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
                  {!isPlaced ? (
                    <Typography variant="caption" color="textMuted">
                      위치 지정 필요
                    </Typography>
                  ) : null}
                </Pressable>
                <Pressable
                  onPress={() => onTagRemove?.(tag.id)}
                  hitSlop={6}
                  style={styles.removeBtn}
                >
                  <Icon
                    name="close"
                    size={14}
                    color={isPlaced ? COLORS.accentText : COLORS.textMuted}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      ) : null}

      <Pressable
        onPress={onAddPress}
        style={({ pressed }) => [
          styles.addBtn,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Icon name="add" size={18} color={COLORS.textSecondary} />
        <Typography variant="bodyStrong" color="textSecondary">
          상품 태그 추가
        </Typography>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.divider,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  helper: {
    marginBottom: SPACING.sm,
  },
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.pill,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  chipPending: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  chipBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  removeBtn: {
    marginLeft: SPACING.xs,
    padding: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
});
