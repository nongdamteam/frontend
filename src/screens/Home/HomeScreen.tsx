import { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import { FeedItem as FeedItemType, FeedTag } from '@/@types/feed';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SCREEN } from '@/constants/layout';
import { useActiveVideoIndex } from '@/hooks/useActiveVideoIndex';
import { ProductSheet, ProductSheetRef } from '@/screens/ProductSheet/ProductSheet';
import { FeedItem } from './components/FeedItem';
import { useHomeFeed } from './hooks/useHomeFeed';

export function HomeScreen() {
  const { data, isLoading, isError } = useHomeFeed();
  const { activeIndex, viewabilityConfigCallbackPairs } = useActiveVideoIndex(0);
  const sheetRef = useRef<ProductSheetRef>(null);

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

  return (
    <>
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
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
