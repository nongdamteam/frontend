import { Alert, Image, StyleSheet, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { useUploadDraft } from '../hooks/useUploadDraft';
import { UploadHeader } from '../components/UploadHeader';
import { CaptionInput } from '../components/CaptionInput';
import { TagTray } from '../components/TagTray';
import { PrivacySettings } from '../components/PrivacySettings';

interface DetailFormScreenProps {
  onClose: () => void;
}

export function DetailFormScreen({ onClose }: DetailFormScreenProps) {
  const {
    draft,
    setCaption,
    setPrivacy,
    removeTag,
    goTo,
    canSubmit,
    hasPendingTags,
  } = useUploadDraft();

  const handleAddTag = () => {
    // TODO(6단계): 상품 검색 모달 오픈
    Alert.alert('알림', '다음 단계에서 상품 검색 모달이 연결됩니다.');
  };

  const handleTagPress = () => {
    // 위치 미지정 태그가 있으면 위치 지정 화면으로 이동
    // TODO(7단계): TagPositionScreen
    Alert.alert('알림', '다음 단계에서 태그 위치 지정 화면이 연결됩니다.');
  };

  const handleSubmit = () => {
    if (hasPendingTags) {
      Alert.alert('태그 위치를 지정해주세요', '모든 태그에 위치가 필요해요.');
      return;
    }
    // TODO(8단계): 실제 업로드 핸들러
    console.log('[Upload draft]', draft);
    onClose();
  };

  return (
    <View style={styles.container}>
      <UploadHeader
        title="정보 입력"
        leadingIcon="chevron-back"
        onLeadingPress={() => goTo('media')}
        trailingLabel="업로드"
        trailingDisabled={!canSubmit}
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
          onAddPress={handleAddTag}
          onTagPress={handleTagPress}
          onTagRemove={removeTag}
        />

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
});
