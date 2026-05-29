import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';

interface UploadStatusOverlayProps {
  state: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

/**
 * 업로드 중 / 완료 / 실패 상태를 시트 전체를 덮는 오버레이로 표시.
 * - uploading: 스피너 + 안내 텍스트
 * - success: ✓ 아이콘 + "업로드 완료"
 * - error: ! 아이콘 + 에러 메시지
 */
export function UploadStatusOverlay({
  state,
  errorMessage,
}: UploadStatusOverlayProps) {
  if (state === 'idle') return null;

  return (
    <View style={styles.container} pointerEvents="auto">
      <View style={styles.card}>
        {state === 'uploading' ? (
          <>
            <ActivityIndicator color={COLORS.primary} size="large" />
            <Typography variant="bodyStrong" color="textPrimary">
              업로드 중이에요...
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              네트워크 상태에 따라 시간이 걸릴 수 있어요.
            </Typography>
          </>
        ) : null}

        {state === 'success' ? (
          <>
            <View style={[styles.icon, { backgroundColor: COLORS.primary }]}>
              <Icon name="checkmark" size={32} color={COLORS.textOnPrimary} />
            </View>
            <Typography variant="bodyStrong" color="textPrimary">
              업로드 완료!
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              잠시 후 피드에서 확인할 수 있어요.
            </Typography>
          </>
        ) : null}

        {state === 'error' ? (
          <>
            <View style={[styles.icon, { backgroundColor: COLORS.surfaceMuted }]}>
              <Icon name="alert" size={32} color={COLORS.textPrimary} />
            </View>
            <Typography variant="bodyStrong" color="textPrimary">
              업로드에 실패했어요
            </Typography>
            <Typography variant="caption" color="textMuted" align="center">
              {errorMessage ?? '잠시 후 다시 시도해주세요.'}
            </Typography>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlayDim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    zIndex: 50,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
