import { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { FeedItem as FeedItemType, FeedTag } from '@/@types/feed';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SCREEN } from '@/constants/layout';
import { useActiveVideoIndex } from '@/hooks/useActiveVideoIndex';
import { ProductSheet, ProductSheetRef } from '@/screens/ProductSheet/ProductSheet';
import { FeedItem } from './components/FeedItem';
import { useBabsFeed } from './hooks/useBabsFeed';

interface BabsScreenProps {
  /** 좌측 스와이프 시 호출 (다음 탭으로 이동) */
  onSwipeLeft?: () => void;
  /** 우측 스와이프 시 호출 (이전 탭으로 이동) */
  onSwipeRight?: () => void;
  /** 스와이프 진행 중일 때 부모에게 translationX 값을 전달 */
  onSwipeProgress?: (translationX: number) => void;
  /** 스와이프가 끝났을 때 부모에게 전달 */
  onSwipeEnd?: (translationX: number, velocityX: number) => void;
}

export function BabsScreen({ onSwipeLeft, onSwipeRight, onSwipeProgress, onSwipeEnd }: BabsScreenProps) {
  const { data, isLoading, isError } = useBabsFeed();
  const { activeIndex, viewabilityConfigCallbackPairs } = useActiveVideoIndex(0);
  const sheetRef = useRef<ProductSheetRef>(null);

  const handleTagPress = useCallback((tag: FeedTag) => {
    console.log('[BabsScreen] handleTagPress tag.keyword:', tag.keyword);
    sheetRef.current?.open(tag.keyword);
  }, []);

  const renderItem = useCallback<ListRenderItem<FeedItemType>>(
    ({ item, index }) => (
      <FeedItem
        item={item}
        isActive={index === activeIndex}
        onTagPress={handleTagPress}
      />
    ),
    [activeIndex, handleTagPress],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Typography variant="body" color="textMuted">
          피드를 불러오지 못했어요.
        </Typography>
      </View>
    );
  }

  // 가로 스와이프 제스처: 좌우 충분히 그었을 때만 인식
  // activeOffsetX: 가로 20px 이상 움직이면 제스처 활성
  // failOffsetY: 세로로 15px 넘게 움직이면 제스처 실패 (피드 스크롤이 우선)
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onUpdate(event => {
      'worklet';
      if (onSwipeProgress) {
        runOnJS(onSwipeProgress)(event.translationX);
      }
    })
    .onEnd(event => {
      'worklet';
      if (onSwipeEnd) return;

      const SWIPE_THRESHOLD = 50;
      if (event.translationX < -SWIPE_THRESHOLD && onSwipeLeft) {
        runOnJS(onSwipeLeft)();
      } else if (event.translationX > SWIPE_THRESHOLD && onSwipeRight) {
        runOnJS(onSwipeRight)();
      }
    })
    .onFinalize(event => {
      'worklet';
      if (onSwipeEnd) {
        runOnJS(onSwipeEnd)(event.translationX, event.velocityX);
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        pagingEnabled
        snapToInterval={SCREEN.height}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
        windowSize={3}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: SCREEN.height,
          offset: SCREEN.height * index,
          index,
        })}
      />
      <ProductSheet ref={sheetRef} />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
