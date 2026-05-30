import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/colors.local';
import { SPACING } from '@/constants/layout';
import { useMediaLibrary } from '../hooks/useMediaLibrary';
import { useUploadDraft } from '../hooks/useUploadDraft';
import { GalleryGrid } from '../components/GalleryGrid';
import { GalleryPhoto } from '../hooks/useGalleryPhotos';
import { MediaPreview } from '../components/MediaPreview';
import { MediaSourceTabs, MediaSource } from '../components/MediaSourceTabs';
import { UploadHeader } from '../components/UploadHeader';
import { SelectedMedia } from '@/@types/upload';

interface MediaSelectScreenProps {
  onClose: () => void;
}

export function MediaSelectScreen({ onClose }: MediaSelectScreenProps) {
  const { draft, setMedia, goTo, canProceedToDetail } = useUploadDraft();
  const { captureFromCamera } = useMediaLibrary();
  const [source, setSource] = useState<MediaSource>('gallery');

  const handleGallerySelect = useCallback(
    (photo: GalleryPhoto) => {
      const media: SelectedMedia = {
        type: photo.type,
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        durationMs: photo.durationMs,
      };
      setMedia(media);
    },
    [setMedia],
  );

  const handleSourceChange = useCallback(
    async (next: MediaSource) => {
      setSource(next);
      if (next === 'photo') {
        const m = await captureFromCamera({ mediaType: 'photo' });
        if (m) setMedia(m);
        // 촬영 후 갤러리 탭으로 복귀
        setSource('gallery');
      } else if (next === 'video') {
        const m = await captureFromCamera({ mediaType: 'video' });
        if (m) setMedia(m);
        setSource('gallery');
      }
    },
    [captureFromCamera, setMedia],
  );

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

      {/* 상단 미리보기: 선택된 사진 or 플레이스홀더 */}
      <View style={styles.preview}>
        <MediaPreview media={draft.media} />
      </View>

      {/* 탭 */}
      <MediaSourceTabs value={source} onChange={handleSourceChange} />

      {/* 갤러리 탭일 때 그리드 표시 */}
      {source === 'gallery' && (
        <View style={styles.grid}>
          <GalleryGrid
            selectedUri={draft.media?.uri ?? null}
            onSelect={handleGallerySelect}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  preview: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceMuted,
  },
  grid: {
    flex: 1,
  },
});
