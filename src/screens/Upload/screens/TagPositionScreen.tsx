import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SPACING } from '@/constants/layout';
import { useUploadDraft } from '../hooks/useUploadDraft';
import { UploadHeader } from '../components/UploadHeader';
import { PositionPickerCanvas } from '../components/PositionPickerCanvas';
import { PositionPickerTray } from '../components/PositionPickerTray';

interface TagPositionScreenProps {
  onClose: () => void;
}

export function TagPositionScreen(_: TagPositionScreenProps) {
  const { draft, updateTagPosition, removeTag, goTo, hasPendingTags } =
    useUploadDraft();

  // 진입 시 위치 미지정 태그가 있으면 그걸 첫 활성으로 잡음
  const initialActive =
    draft.tags.find(t => t.position == null)?.id ?? draft.tags[0]?.id ?? null;
  const [activeTagId, setActiveTagId] = useState<string | null>(initialActive);

  // 태그 목록이 바뀔 때 활성 태그 동기화 (선택 태그가 삭제됐을 때 대응)
  useEffect(() => {
    if (!activeTagId || !draft.tags.some(t => t.id === activeTagId)) {
      const next =
        draft.tags.find(t => t.position == null)?.id ??
        draft.tags[0]?.id ??
        null;
      setActiveTagId(next);
    }
  }, [draft.tags, activeTagId]);

  if (!draft.media) {
    return (
      <View style={styles.empty}>
        <Typography variant="body" color="textMuted">
          미디어가 선택되지 않았어요.
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UploadHeader
        title="태그 위치 지정"
        leadingIcon="chevron-back"
        onLeadingPress={() => goTo('detail')}
        trailingLabel="완료"
        trailingDisabled={hasPendingTags}
        onTrailingPress={() => goTo('detail')}
      />

      <PositionPickerCanvas
        media={draft.media}
        tags={draft.tags}
        activeTagId={activeTagId}
        onSelectTag={setActiveTagId}
        onPositionChange={updateTagPosition}
      />

      <PositionPickerTray
        tags={draft.tags}
        activeTagId={activeTagId}
        onSelect={setActiveTagId}
        onRemove={removeTag}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
});
