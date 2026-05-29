import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { useUploadDraft } from '../hooks/useUploadDraft';
import { MediaPreview } from '../components/MediaPreview';
import {
  MediaSource,
  MediaSourceTabs,
} from '../components/MediaSourceTabs';
import { UploadHeader } from '../components/UploadHeader';

interface MediaSelectScreenProps {
  onClose: () => void;
}

export function MediaSelectScreen({ onClose }: MediaSelectScreenProps) {
  const { draft, setMedia, goTo, canProceedToDetail } = useUploadDraft();
  const { pickFromLibrary, captureFromCamera } = useMediaLibrary();
  const [source, setSource] = useState<MediaSource>('gallery');

  const handleSourceChange = useCallback(
    async (next: MediaSource) => {
      setSource(next);
      if (next === 'gallery') {
        const m = await pickFromLibrary({ mediaType: 'mixed' });
        if (m) setMedia(m);
      } else if (next === 'photo') {
        const m = await captureFromCamera({ mediaType: 'photo' });
        if (m) setMedia(m);
      } else {
        const m = await captureFromCamera({ mediaType: 'video' });
        if (m) setMedia(m);
      }
    },
    [pickFromLibrary, captureFromCamera, setMedia],
  );

  const handleReselect = useCallback(async () => {
    const m = await pickFromLibrary({ mediaType: 'mixed' });
    if (m) setMedia(m);
  }, [pickFromLibrary, setMedia]);

  return (
    <View style={styles.container}>
      <UploadHeader
        title="새 콘텐츠"
        leadingIcon="close"
        onLeadingPress={onClose}
        trailingLabel="다음"
        trailingDisabled={!canProceedToDetail}
        onTrailingPress={() => goTo('detail')}
      />

      <BottomSheetScrollView contentContainerStyle={styles.scroll}>
        <MediaPreview media={draft.media} />

        <MediaSourceTabs value={source} onChange={handleSourceChange} />

        {/* 갤러리 미리 보여줄 그리드는 RN 이미지 갤러리 API가 따로 필요해
            여기선 "다시 선택" 버튼만 노출. */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleReselect}
            style={({ pressed }) => [
              styles.reselect,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Icon name="images-outline" size={20} color={COLORS.textPrimary} />
            <Typography variant="bodyStrong" color="textPrimary">
              갤러리에서 다시 선택
            </Typography>
          </Pressable>

          <Typography variant="caption" color="textMuted" align="center">
            선택한 미디어가 미리보기에 표시됩니다.
          </Typography>
        </View>
      </BottomSheetScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: SPACING.xxl },
  actions: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  reselect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
});
