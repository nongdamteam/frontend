import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { NongdamLogo } from '@/assets/icons/NongdamLogo';

interface UploadStatusOverlayProps {
  state: 'idle' | 'uploading' | 'success' | 'error';
  mediaType?: 'image' | 'video';
  errorMessage?: string;
}

/**
 * 업로드 중 / 완료 / 실패 상태 및 AI 검사 단계를 보여주는 전체 화면 오버레이.
 * 농담 브랜딩이 적용된 프리미엄 디자인.
 */
export function UploadStatusOverlay({
  state,
  mediaType = 'image',
  errorMessage,
}: UploadStatusOverlayProps) {
  const [aiPhase, setAiPhase] = useState<'idle' | 'analyzing' | 'passed' | 'done'>('idle');
  const progress = useRef(new Animated.Value(0)).current;

  // dot animation for the "..." typing effect
  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;
  const dotAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  // card entrance animation
  const cardScale = useRef(new Animated.Value(0.88)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // pulse for logo while analyzing
  const logoPulse = useRef(new Animated.Value(1)).current;
  const logoPulseAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (state === 'uploading') {
      setAiPhase('analyzing');
      progress.setValue(0);

      // entrance animation
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // progress bar
      Animated.timing(progress, {
        toValue: 1,
        duration: 2400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start(() => {
        setAiPhase('passed');
        setTimeout(() => {
          setAiPhase('done');
        }, 1400);
      });

      // pulsing logo
      logoPulseAnim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, {
            toValue: 1.08,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(logoPulse, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      logoPulseAnim.current.start();

      // typing dots
      const dotSeq = Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity1, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity2, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity3, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dotOpacity3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ])
      );
      dotAnimRef.current = dotSeq;
      dotSeq.start();
    } else if (state === 'idle') {
      setAiPhase('idle');
      progress.setValue(0);
      cardScale.setValue(0.88);
      cardOpacity.setValue(0);
      logoPulse.setValue(1);
      dotOpacity1.setValue(0.3);
      dotOpacity2.setValue(0.3);
      dotOpacity3.setValue(0.3);
      logoPulseAnim.current?.stop();
      dotAnimRef.current?.stop();
    }

    return () => {
      logoPulseAnim.current?.stop();
      dotAnimRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const visible = state !== 'idle';

  const renderContent = () => {
    if (state === 'error') {
      return (
        <>
          <View style={[styles.iconCircle, localStyles.iconError]}>
            <Icon name="alert" size={30} color={COLORS.white} />
          </View>
          <Typography variant="bodyStrong" color="textPrimary" style={localStyles.cardTitle}>
            업로드에 실패했어요
          </Typography>
          <Typography variant="caption" color="textMuted" align="center">
            {errorMessage ?? '잠시 후 다시 시도해주세요.'}
          </Typography>
        </>
      );
    }

    if (state === 'success') {
      return (
        <>
          <NongdamLogo mode="icon" width={64} height={64} />
          <View style={[styles.iconCircle, localStyles.iconSuccess]}>
            <Icon name="checkmark" size={30} color={COLORS.white} />
          </View>
          <Typography variant="bodyStrong" color="textPrimary" style={localStyles.cardTitle}>
            업로드 완료!
          </Typography>
          <Typography variant="caption" color="textMuted" align="center">
            잠시 후 피드에서 확인할 수 있어요.
          </Typography>
        </>
      );
    }

    if (aiPhase === 'analyzing') {
      const typeText = mediaType === 'video' ? '동영상' : '사진';
      return (
        <>
          {/* Pulsing logo */}
          <Animated.View style={{ transform: [{ scale: logoPulse }] }}>
            <NongdamLogo mode="icon" width={72} height={72} />
          </Animated.View>

          {/* Brand badge */}
          <View style={localStyles.brandBadge}>
            <Typography variant="caption" style={localStyles.brandBadgeText}>
              농담 AI
            </Typography>
          </View>

          <View style={localStyles.textBlock}>
            <Typography variant="bodyStrong" color="textPrimary" style={localStyles.cardTitle}>
              적합한 콘텐츠인지{'\n'}분석하고 있어요!
            </Typography>
            <View style={localStyles.dotsRow}>
              <Animated.Text style={[localStyles.dot, { opacity: dotOpacity1 }]}>●</Animated.Text>
              <Animated.Text style={[localStyles.dot, { opacity: dotOpacity2 }]}>●</Animated.Text>
              <Animated.Text style={[localStyles.dot, { opacity: dotOpacity3 }]}>●</Animated.Text>
            </View>
          </View>

          <Typography variant="caption" color="textMuted" align="center">
            농담 AI가 {typeText}을(를) 검토하고 있어요.
          </Typography>

          <View style={localStyles.progressContainer}>
            <Animated.View
              style={[
                localStyles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </>
      );
    }

    if (aiPhase === 'passed') {
      return (
        <>
          <NongdamLogo mode="icon" width={72} height={72} />
          <View style={[localStyles.brandBadge, localStyles.brandBadgePassed]}>
            <Icon name="checkmark-circle" size={14} color={COLORS.white} />
            <Typography variant="caption" style={localStyles.brandBadgeTextPassed}>
              통과
            </Typography>
          </View>
          <Typography variant="bodyStrong" color="textPrimary" style={localStyles.cardTitle}>
            분석 완료!
          </Typography>
          <Typography variant="caption" color="textMuted" align="center">
            콘텐츠가 검사를 통과했어요 🎉
          </Typography>
          <View style={localStyles.progressContainer}>
            <View style={[localStyles.progressBar, { width: '100%' }]} />
          </View>
        </>
      );
    }

    // aiPhase === 'done' (uploading to server after AI pass)
    return (
      <>
        <NongdamLogo mode="icon" width={64} height={64} />
        <Typography variant="bodyStrong" color="textPrimary" style={localStyles.cardTitle}>
          서버에 업로드 중이에요...
        </Typography>
        <Typography variant="caption" color="textMuted" align="center">
          거의 다 됐어요!
        </Typography>
      </>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      statusBarTranslucent
      animationType="fade"
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}
        >
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
}

const localStyles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
    marginTop: 4,
  },
  textBlock: {
    alignItems: 'center',
    gap: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    fontSize: 8,
    color: '#A8C99E',
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E2',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5B9A6F',
  },
  brandBadgePassed: {
    backgroundColor: '#A8C99E',
  },
  brandBadgeTextPassed: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressContainer: {
    width: '90%',
    height: 6,
    backgroundColor: '#E8F5E2',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#A8C99E',
    borderRadius: 3,
  },
  iconSuccess: {
    backgroundColor: '#A8C99E',
  },
  iconError: {
    backgroundColor: '#E57373',
  },
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  card: {
    width: '100%',
    maxWidth: 310,
    backgroundColor: '#FFFDF8',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#E5E0D6',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UploadStatusOverlay;
