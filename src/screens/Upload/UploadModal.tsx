import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
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
interface UploadModalProps {
  /** 시트가 닫혔을 때 부모에게 통보 (스와이프 비활성화 등 외부 상태 동기화용) */
  onClose?: () => void;
}

export const UploadModal = forwardRef<UploadModalRef, UploadModalProps>(
  ({ onClose }, ref) => {
    const [visible, setVisible] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    const close = useCallback(() => {
      setVisible(false);
      setResetKey(k => k + 1);
      onClose?.();
    }, [onClose]);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close,
    }));

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={close}
      >
        <View style={localStyles.modalOverlay}>
          {/* Backdrop press to close */}
          <Pressable style={localStyles.backdrop} onPress={close} />

          {/* Modal content sheet taking 95% height */}
          <View style={[styles.background, localStyles.sheetContainer]}>
            <View style={localStyles.handleWrapper}>
              <View style={styles.handle} />
            </View>
            <View style={styles.content}>
              <UploadProvider key={resetKey}>
                <StepRouter onClose={close} />
              </UploadProvider>
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

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

const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent', // Remove the 50% opacity black backdrop
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheetContainer: {
    height: '95%',
    width: '100%',
  },
  handleWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handle: {
    backgroundColor: COLORS.border,
    width: 42,
    height: 5,
    borderRadius: 2.5,
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
export default UploadModal;
