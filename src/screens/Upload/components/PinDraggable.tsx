import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PendingTag, TagPosition } from '@/@types/upload';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SHADOW, SPACING } from '@/constants/layout';

interface PinDraggableProps {
  tag: PendingTag;
  /** 핀이 위치한 캔버스의 실측 크기 (px) */
  canvasWidth: number;
  canvasHeight: number;
  /** 현재 선택된 상태(라벨 강조) */
  selected: boolean;
  onSelect: (id: string) => void;
  /** 드래그 종료 시 새 비율 좌표 통보 */
  onPositionChange: (id: string, position: TagPosition) => void;
}

const PIN_SIZE = 16;

/**
 * 캔버스 위에 떠 있는 핀.
 * - 사용자가 핀을 잡고 끌면 실시간으로 따라옴
 * - 손가락 떼면 0~1 비율로 변환해서 store에 저장
 * - 캔버스 경계 밖으로는 못 나감 (clamp)
 */
export function PinDraggable({
  tag,
  canvasWidth,
  canvasHeight,
  selected,
  onSelect,
  onPositionChange,
}: PinDraggableProps) {
  const x = useSharedValue((tag.position?.x ?? 0.5) * canvasWidth);
  const y = useSharedValue((tag.position?.y ?? 0.5) * canvasHeight);

  // 상위 상태가 바뀌면 (예: 캔버스 탭으로 새 위치 지정) 동기화
  useEffect(() => {
    if (tag.position) {
      x.value = tag.position.x * canvasWidth;
      y.value = tag.position.y * canvasHeight;
    }
  }, [tag.position, canvasWidth, canvasHeight, x, y]);

  const commit = (px: number, py: number) => {
    onPositionChange(tag.id, {
      x: px / canvasWidth,
      y: py / canvasHeight,
    });
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      runOnJS(onSelect)(tag.id);
    })
    .onChange(e => {
      'worklet';
      const nextX = Math.min(Math.max(x.value + e.changeX, 0), canvasWidth);
      const nextY = Math.min(Math.max(y.value + e.changeY, 0), canvasHeight);
      x.value = nextX;
      y.value = nextY;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(commit)(x.value, y.value);
    });

  const pinStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value - PIN_SIZE / 2 },
      { translateY: y.value - PIN_SIZE / 2 },
    ],
  }));

  // 라벨은 핀 위쪽에 표시. 핀이 화면 좌측에 가까우면 우측, 우측에 가까우면 좌측 배치
  const labelStyle = useAnimatedStyle(() => {
    const placeRight = x.value < canvasWidth / 2;
    return {
      transform: [
        {
          translateX: placeRight
            ? x.value + PIN_SIZE
            : x.value - PIN_SIZE - 120,
        },
        { translateY: y.value - 36 },
      ],
    };
  });

  return (
    <>
      <Animated.View
        style={[styles.label, labelStyle, selected && styles.labelSelected]}
        pointerEvents="none"
      >
        <Typography variant="captionStrong" color="textPrimary" numberOfLines={1}>
          {tag.label}
        </Typography>
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.pin, selected && styles.pinSelected, pinStyle]}
        />
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  pin: {
    position: 'absolute',
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOW.floating,
  },
  pinSelected: {
    backgroundColor: COLORS.primary,
  },
  label: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    maxWidth: 140,
    ...SHADOW.card,
  },
  labelSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});
