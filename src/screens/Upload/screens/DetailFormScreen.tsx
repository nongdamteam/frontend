import { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ProductListItem } from '@/@types/product';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { createTempId } from '@/utils/id';
import { useUploadDraft } from '../hooks/useUploadDraft';
import { useUploadContent } from '../hooks/useUploadContent';
import { buildUploadPayload } from '../utils/buildUploadPayload';
import { UploadHeader } from '../components/UploadHeader';
import { CaptionInput } from '../components/CaptionInput';
import { TagTray } from '../components/TagTray';
import { PrivacySettings } from '../components/PrivacySettings';
import {
  ProductSearchSheet,
  ProductSearchSheetRef,
} from '../components/ProductSearchSheet';
import { UploadStatusOverlay } from '../components/UploadStatusOverlay';

interface DetailFormScreenProps {
  onClose: () => void;
}

export function DetailFormScreen({ onClose }: DetailFormScreenProps) {
  const {
    draft,
    setCaption,
    setPrivacy,
    addTag,
    removeTag,
    goTo,
    canSubmit,
    hasPendingTags,
    isVideo,
  } = useUploadDraft();
  const searchSheetRef = useRef<ProductSearchSheetRef>(null);
  const { mutate: upload, isPending, isSuccess, isError, error } =
    useUploadContent();
  const [closeQueued, setCloseQueued] = useState(false);

  // 성공 후 잠깐 보여주고 자동 닫기 (1.2s)
  useEffect(() => {
    if (!isSuccess) return;
    const id = setTimeout(() => {
      setCloseQueued(true);
    }, 1200);
    return () => clearTimeout(id);
  }, [isSuccess]);

  useEffect(() => {
    if (closeQueued) {
      onClose();
    }
  }, [closeQueued, onClose]);

  const handleAddTag = () => {
    searchSheetRef.current?.open();
  };

  const handleSearchSelect = (product: ProductListItem) => {
    addTag({
      id: createTempId('tag'),
      keyword: product.keyword,
      label: product.name,
      thumbnailUrl: product.thumbnailUrl,
      averagePrice: product.pricePerUnit,
      position: null,
    });
    searchSheetRef.current?.close();
  };

  const handleTagPress = () => {
    if (draft.tags.length === 0) return;
    if (isVideo) return; // 영상은 위치 지정 단계 없음
    goTo('position');
  };

  const handleSubmit = () => {
    if (!isVideo && hasPendingTags) {
      Alert.alert('태그 위치를 지정해주세요', '모든 태그에 위치가 필요해요.');
      return;
    }
    try {
      const payload = buildUploadPayload(draft);
      upload(payload);
    } catch (e) {
      Alert.alert('업로드 준비 실패', (e as Error).message);
    }
  };

  const overlayState: 'idle' | 'uploading' | 'success' | 'error' = isPending
    ? 'uploading'
    : isSuccess
    ? 'success'
    : isError
    ? 'error'
    : 'idle';

  return (
    <View style={styles.container}>
      <UploadHeader
        title="정보 입력"
        leadingIcon="chevron-back"
        onLeadingPress={() => goTo('media')}
        trailingLabel="업로드"
        trailingDisabled={!canSubmit || isPending}
        onTrailingPress={handleSubmit}
      />

      <BottomSheetScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.previewRow}>
          {draft.media ? (
            <Image
              source={{ uri: draft.media.uri }}
              style={styles.thumb}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]} />
          )}
          <View style={styles.captionWrap}>
            <CaptionInput value={draft.caption} onChange={setCaption} />
          </View>
        </View>

        <TagTray
          tags={draft.tags}
          treatAllAsPlaced={isVideo}
          onAddPress={handleAddTag}
          onTagPress={handleTagPress}
          onTagRemove={removeTag}
        />

        {isVideo && draft.tags.length > 0 ? (
          <Typography
            variant="caption"
            color="textMuted"
            align="center"
            style={styles.videoNotice}
          >
            영상은 위치 지정 없이, 시청자가 영상을 일시정지하면 하단에 자동
            노출돼요.
          </Typography>
        ) : null}

        <PrivacySettings value={draft.privacy} onChange={setPrivacy} />

        <Typography
          variant="caption"
          color="textMuted"
          align="center"
          style={styles.footer}
        >
          업로드 후에도 캡션과 공개 설정은 변경할 수 있어요.
        </Typography>
      </BottomSheetScrollView>

      <ProductSearchSheet
        ref={searchSheetRef}
        addedKeywords={draft.tags.map(t => t.keyword)}
        onSelect={handleSearchSelect}
      />

      <UploadStatusOverlay
        state={overlayState}
        errorMessage={(error as Error | undefined)?.message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingBottom: SPACING.xxxl,
  },
  previewRow: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
  },
  thumbPlaceholder: {},
  captionWrap: { flex: 1 },
  footer: { paddingHorizontal: SPACING.lg, marginTop: SPACING.md },
  videoNotice: { paddingHorizontal: SPACING.lg, marginTop: -SPACING.sm },
});
