import { useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeedItem as FeedItemType, FeedTag } from '@/@types/feed';
import { FloatingButton } from '@/components/common/FloatingButton';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SCREEN, SPACING } from '@/constants/layout';
import { useActiveVideoIndex } from '@/hooks/useActiveVideoIndex';
import { navigationService } from '@/services/navigationService';
import { ProductSheet, ProductSheetRef } from '@/screens/ProductSheet/ProductSheet';
import { UploadModal, UploadModalRef } from '@/screens/Upload/UploadModal';
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

export function BabsScreen({
  onSwipeLeft,
  onSwipeRight,
  onSwipeProgress,
  onSwipeEnd,
}: BabsScreenProps) {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError } = useBabsFeed();
  const { activeIndex, viewabilityConfigCallbackPairs } = useActiveVideoIndex(0);
  const sheetRef = useRef<ProductSheetRef>(null);
  const uploadModalRef = useRef<UploadModalRef>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleUploadPress = useCallback(() => {
    uploadModalRef.current?.open();
  }, []);

  // 다른 탭에서 특정 피드로 점프 (navigationService 통해 외부 트리거)
  useEffect(() => {
    navigationService.setBabsNavigationCallback(feedId => {
      const index = data?.findIndex(item => item.id === feedId);
      if (index !== undefined && index !== -1 && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index, animated: false });
        }, 100);
      }
    });
    return () => {
      navigationService.setBabsNavigationCallback(null);
    };
  }, [data]);

  const handleTagPress = useCallback((tag: FeedTag) => {
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
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-8, 8])
    .onUpdate(event => {
      'worklet';
      if (onSwipeProgress) {
        runOnJS(onSwipeProgress)(event.translationX);
      }
    })
    .onEnd(event => {
      'worklet';
      if (onSwipeEnd) return; // 부모가 onSwipeEnd로 직접 처리

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
          ref={flatListRef}
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

        {/* 우상단 플로팅 + 버튼 — 업로드 모달 진입 */}
        <FloatingButton
          iconName="add"
          iconSize={28}
          size={52}
          background="surface"
          iconColor="textPrimary"
          onPress={handleUploadPress}
          accessibilityLabel="콘텐츠 업로드"
          style={{
            position: 'absolute',
            top: insets.top + SPACING.md,
            right: SPACING.lg,
          }}
        />

        <UploadModal ref={uploadModalRef} />
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
