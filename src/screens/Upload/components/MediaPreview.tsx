import { Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SelectedMedia } from '@/@types/upload';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface MediaPreviewProps {
  media: SelectedMedia | null;
}

export function MediaPreview({ media }: MediaPreviewProps) {
  if (!media) {
    return (
      <View style={[styles.container, styles.empty]}>
        {/* 이미지 픽토그램 */}
        <View style={styles.iconWrap}>
          <Icon name="image-outline" size={48} color={COLORS.primary} />
        </View>
        <Typography variant="body" color="textMuted" align="center" style={styles.emptyText}>
          아래에서 사진 또는 영상을{'\n'}선택해주세요
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: media.uri }} style={styles.image} resizeMode="cover" />
      <View style={styles.badge}>
        <Typography variant="captionStrong" color="white">
          {media.type === 'video' ? '🎬 영상' : '🖼 사진'}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceMuted,
    position: 'relative',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: '#E8F5E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 20,
  },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.overlayStrong,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
});
