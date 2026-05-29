import { useCallback, useRef, useState } from 'react';
import { ViewToken } from 'react-native';

/**
 * FlatList의 onViewableItemsChanged에 연결해서
 * 현재 화면에 보이는 항목의 인덱스를 추적한다.
 */
export function useActiveVideoIndex(initial = 0) {
  const [activeIndex, setActiveIndex] = useState(initial);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]).current;

  const reset = useCallback(() => setActiveIndex(initial), [initial]);

  return { activeIndex, viewabilityConfigCallbackPairs, reset };
}
