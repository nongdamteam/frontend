import { useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { PendingTag, SelectedMedia, TagPosition } from '@/@types/upload';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { PinDraggable } from './PinDraggable';

interface PositionPickerCanvasProps {
  media: SelectedMedia;
  tags: PendingTag[];
  /** 현재 선택된(편집 대상) 태그 id */
  activeTagId: string | null;
  onSelectTag: (id: string) => void;
  onPositionChange: (id: string, position: TagPosition) => void;
}

/**
 * 미디어 위에 핀을 배치할 수 있는 캔버스.
 * - 빈 곳 탭: 현재 선택된(activeTagId) 태그를 그 좌표로 이동
 * - 핀 드래그: 해당 태그를 직접 이동
 */
export function PositionPickerCanvas({
  media,
  tags,
  activeTagId,
  onSelectTag,
  onPositionChange,
}: PositionPickerCanvasProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const handleCanvasPress = (e: GestureResponderEvent) => {
    if (!activeTagId || size.width === 0) return;
    const { locationX, locationY } = e.nativeEvent;
    onPositionChange(activeTagId, {
      x: locationX / size.width,
      y: locationY / size.height,
    });
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Image
        source={{ uri: media.uri }}
        style={styles.media}
        resizeMode="cover"
      />
      <Pressable onPress={handleCanvasPress} style={StyleSheet.absoluteFill} />

      {/* 가이드 칩 */}
      <View style={styles.guide} pointerEvents="none">
        <Typography variant="captionStrong" color="white">
          {activeTagId
            ? '화면을 탭하거나 핀을 드래그해 위치를 조정하세요'
            : '아래 목록에서 태그를 선택해주세요'}
        </Typography>
      </View>

      {/* 핀들 (캔버스 크기가 측정된 후에만 렌더) */}
      {size.width > 0 &&
        tags.map(tag => (
          <PinDraggable
            key={tag.id}
            tag={tag}
            canvasWidth={size.width}
            canvasHeight={size.height}
            selected={tag.id === activeTagId}
            onSelect={onSelectTag}
            onPositionChange={onPositionChange}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: COLORS.black,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  guide: {
    position: 'absolute',
    top: SPACING.md,
    alignSelf: 'center',
    backgroundColor: COLORS.overlayStrong,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
  },
});
