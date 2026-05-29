import { Image, StyleSheet, View } from 'react-native';
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
        <Typography variant="body" color="textMuted">
          아래에서 미디어를 선택해주세요
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
