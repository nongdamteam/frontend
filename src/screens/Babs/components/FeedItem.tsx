import { useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedItem as FeedItemType, FeedTag } from '@/@types/feed';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SCREEN, SPACING, TAB_BAR_HEIGHT } from '@/constants/layout';
import { FeedVideoPlayer } from './FeedVideoPlayer';
import { FeedImageViewer } from './FeedImageViewer';
import { TagOverlay } from './TagOverlay';
import { VideoTagStrip } from './VideoTagStrip';
import { FeedSideActions } from './FeedSideActions';

interface FeedItemProps {
  item: FeedItemType;
  isActive: boolean;
  onTagPress?: (tag: FeedTag) => void;
}

export function FeedItem({ item, isActive, onTagPress }: FeedItemProps) {
  const insets = useSafeAreaInsets();
  const [userPaused, setUserPaused] = useState(false);
  const [size, setSize] = useState({ width: SCREEN.width, height: SCREEN.height });

  const isVideo = item.type === 'video';
  // 영상: 일시정지 또는 비활성일 때 오버레이 노출
  // 이미지: 항상 오버레이 노출
  const showOverlay = isVideo ? !isActive || userPaused : true;
  const paused = !isActive || userPaused;

  const togglePause = () => {
    if (!isVideo) return;
    setUserPaused(prev => !prev);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Pressable style={StyleSheet.absoluteFill} onPress={togglePause}>
        {isVideo ? (
          <FeedVideoPlayer
            uri={item.mediaUrl as string}
            posterUri={item.posterUrl}
            paused={paused}
          />
        ) : (
          <FeedImageViewer source={item.mediaUrl} />
        )}
      </Pressable>

      {/* 이미지: 콘텐츠 위 절대 좌표 핀 / 영상: 하단 가로 strip */}
      {isVideo ? (
        <VideoTagStrip
          tags={item.tags}
          visible={showOverlay}
          onTagPress={tag => onTagPress?.(tag)}
          bottomOffset={insets.bottom + TAB_BAR_HEIGHT}
        />
      ) : (
        <TagOverlay
          tags={item.tags}
          visible={showOverlay}
          containerWidth={size.width}
          containerHeight={size.height}
          onTagPress={tag => onTagPress?.(tag)}
        />
      )}

      {/* 좌하단 캡션 */}
      <View
        pointerEvents="none"
        style={[
          styles.caption,
          { bottom: insets.bottom + TAB_BAR_HEIGHT + SPACING.lg },
        ]}
      >
        <Typography variant="bodyStrong" color="white">
          @{item.authorName}
        </Typography>
        {item.caption ? (
          <Typography variant="body" color="white">
            {item.caption}
          </Typography>
        ) : null}
      </View>

      {/* 우측 사이드 액션 */}
      <View
        style={[
          styles.side,
          { bottom: insets.bottom + TAB_BAR_HEIGHT + SPACING.lg },
        ]}
      >
        <FeedSideActions
          likeCount={item.likeCount}
          commentCount={item.commentCount}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN.width,
    height: SCREEN.height,
    backgroundColor: COLORS.black,
  },
  caption: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.xxxl * 2,
    gap: SPACING.xs,
  },
  side: {
    position: 'absolute',
    right: SPACING.lg,
  },
});
