import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
// (영상 분기에서 자동 복귀를 위해 useEffect 사용)
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
  const { draft, updateTagPosition, removeTag, goTo, hasPendingTags, isVideo } =
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

  // 영상이면 진입 즉시 detail로 복귀
  useEffect(() => {
    if (isVideo) goTo('detail');
  }, [isVideo, goTo]);

  if (!draft.media) {
    return (
      <View style={styles.empty}>
        <Typography variant="body" color="textMuted">
          미디어가 선택되지 않았어요.
        </Typography>
      </View>
    );
  }

  // 영상은 위치 지정 단계 자체를 건너뜀 — 정상 흐름에선 도달하지 않지만
  // 만약 의도치 않게 들어왔다면 자동으로 detail로 복귀시킴.
  if (isVideo) {
    return (
      <View style={styles.empty}>
        <Typography variant="body" color="textMuted" align="center">
          영상에는 위치 지정이 없어요.{'\n'}
          정보 입력 화면으로 돌아갑니다.
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
