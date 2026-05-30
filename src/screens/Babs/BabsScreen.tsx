import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  // 업로드 모달이 열려있는 동안에는 가로 스와이프 비활성화 (시트 제스처와 충돌 방지)
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleUploadPress = useCallback(() => {
    setUploadOpen(true);
    uploadModalRef.current?.open();
  }, []);

  const handleUploadModalClose = useCallback(() => {
    setUploadOpen(false);
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

  // 가로 스와이프 제스처: 좌우 충분히 그었을 때만 인식.
  // - 매 렌더마다 객체가 재생성되면 GestureDetector가 불안정해지므로 useMemo.
  // - 업로드 모달이 열려있으면 enabled=false 로 비활성화.
  // - 훅 순서 안정성을 위해 early return 위에 위치.
  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(!uploadOpen)
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
        // 트리비얼 이벤트(움직임 거의 없음)는 무시 — 모달 토글 시 잘못된 이벤트 방지
        if (Math.abs(event.translationX) < 5) return;
        if (onSwipeEnd) {
          runOnJS(onSwipeEnd)(event.translationX, event.velocityX);
        }
      });
  }, [uploadOpen, onSwipeLeft, onSwipeRight, onSwipeProgress, onSwipeEnd]);

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

  return (
    <View style={styles.container}>
      {/* 피드만 GestureDetector 안에 둠 — 버튼/모달은 제스처 영향 밖 */}
      <GestureDetector gesture={swipeGesture}>
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
      </GestureDetector>

      <ProductSheet ref={sheetRef} />

      {/* 우상단 플로팅 + 버튼 — 업로드 모달 진입 (GestureDetector 밖) */}
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
          opacity: 0.7,
        }}
      />

      <UploadModal ref={uploadModalRef} onClose={handleUploadModalClose} />
    </View>
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
