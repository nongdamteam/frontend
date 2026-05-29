import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { UploadProvider, useUploadContext } from './context/UploadContext';
import { MediaSelectScreen } from './screens/MediaSelectScreen';
import { DetailFormScreen } from './screens/DetailFormScreen';
import { TagPositionScreen } from './screens/TagPositionScreen';

export interface UploadModalRef {
  open: () => void;
  close: () => void;
}

/**
 * 업로드 플로우 진입점.
 * 외부에서 ref.open() 호출 시 시트 표시.
 * 내부 step(media/detail/position) 전환은 UploadContext가 담당.
 */
export const UploadModal = forwardRef<UploadModalRef>((_props, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [resetKey, setResetKey] = useState(0);

  const close = useCallback(() => modalRef.current?.dismiss(), []);

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.present(),
    close,
  }));

  const snapPoints = useMemo(() => ['95%'], []);

  const handleDismiss = useCallback(() => {
    // 시트 닫힐 때마다 Provider 재마운트 → 다음 오픈은 깨끗한 상태
    setResetKey(k => k + 1);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        <UploadProvider key={resetKey}>
          <StepRouter onClose={close} />
        </UploadProvider>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

UploadModal.displayName = 'UploadModal';

/**
 * 현재 step에 따라 화면 분기.
 */
function StepRouter({ onClose }: { onClose: () => void }) {
  const { step } = useUploadContext();

  if (step === 'media') {
    return <MediaSelectScreen onClose={onClose} />;
  }

  if (step === 'detail') {
    return <DetailFormScreen onClose={onClose} />;
  }

  if (step === 'position') {
    return <TagPositionScreen onClose={onClose} />;
  }

  return (
    <View style={styles.placeholder}>
      <Typography variant="body" color="textMuted">
        알 수 없는 단계: {step}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handle: {
    backgroundColor: COLORS.border,
    width: 40,
  },
  content: { flex: 1 },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    gap: SPACING.sm,
  },
});
