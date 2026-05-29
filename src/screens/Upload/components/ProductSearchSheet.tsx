import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { ProductListItem } from '@/@types/product';
import { IconButton } from '@/components/common/IconButton';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useProductSearch } from '../hooks/useProductSearch';
import { ProductSearchItem } from './ProductSearchItem';
import { RecentSearchChips } from './RecentSearchChips';

export interface ProductSearchSheetRef {
  open: () => void;
  close: () => void;
}

interface ProductSearchSheetProps {
  /** 이미 추가된 태그 키워드 (회색 ✓ 표시용) */
  addedKeywords: string[];
  /** 상품 선택 시 호출 */
  onSelect: (product: ProductListItem) => void;
}

export const ProductSearchSheet = forwardRef<
  ProductSearchSheetRef,
  ProductSearchSheetProps
>(({ addedKeywords, onSelect }, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data, isFetching } = useProductSearch(debouncedQuery);

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.present(),
    close: () => modalRef.current?.dismiss(),
  }));

  const snapPoints = useMemo(() => ['85%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );

  const commitRecent = useCallback((kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    setRecent(prev => {
      const next = [trimmed, ...prev.filter(k => k !== trimmed)];
      return next.slice(0, 8);
    });
  }, []);

  const handleSelect = (product: ProductListItem) => {
    commitRecent(product.keyword);
    onSelect(product);
  };

  const handleRecentPress = (kw: string) => {
    setQuery(kw);
  };

  const handleClear = () => setQuery('');

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      stackBehavior="push"
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      keyboardBlurBehavior="restore"
    >
      <View style={styles.headerRow}>
        <IconButton
          name="close"
          size={22}
          onPress={() => modalRef.current?.dismiss()}
        />
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color={COLORS.textMuted} />
          <BottomSheetTextInput
            value={query}
            onChangeText={setQuery}
            placeholder="상품 검색 (예: 봄동, 참기름)"
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <IconButton name="close-circle" size={18} onPress={handleClear} />
          ) : null}
        </View>
      </View>

      {/* 검색어 비었을 때만 최근 검색 노출 */}
      {query.length === 0 ? (
        <RecentSearchChips keywords={recent} onPress={handleRecentPress} />
      ) : null}

      {query.length === 0 ? (
        <View style={styles.empty}>
          <Typography variant="body" color="textMuted">
            검색어를 입력해주세요.
          </Typography>
        </View>
      ) : isFetching ? (
        <View style={styles.empty}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : !data || data.length === 0 ? (
        <View style={styles.empty}>
          <Typography variant="body" color="textMuted">
            '{query}' 검색 결과가 없어요.
          </Typography>
        </View>
      ) : (
        <>
          <Typography
            variant="captionStrong"
            color="textMuted"
            style={styles.resultTitle}
          >
            검색 결과 · {data.length}건
          </Typography>
          <BottomSheetFlatList
            data={data}
            keyExtractor={p => p.id}
            renderItem={({ item }) => (
              <ProductSearchItem
                product={item}
                added={addedKeywords.includes(item.keyword)}
                onPress={handleSelect}
              />
            )}
          />
        </>
      )}
    </BottomSheetModal>
  );
});

ProductSearchSheet.displayName = 'ProductSearchSheet';

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handle: { backgroundColor: COLORS.border, width: 40 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  resultTitle: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
});
