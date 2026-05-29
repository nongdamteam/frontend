import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ProductSortType } from '@/@types/product';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SPACING } from '@/constants/layout';
import { useProductList } from '../hooks/useProductList';
import { useProductSheet } from '../context/ProductSheetContext';
import { SortFilterBar } from './SortFilterBar';
import { ProductListItem } from './ProductListItem';

interface ProductListViewProps {
  keyword: string;
}

export function ProductListView({ keyword }: ProductListViewProps) {
  const [sort, setSort] = useState<ProductSortType>('distance');
  const { data, isLoading, isError } = useProductList(keyword, sort);
  const { pushDetail } = useProductSheet();

  return (
    <View style={styles.container}>
      <SortFilterBar value={sort} onChange={setSort} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : isError || !data ? (
        <View style={styles.center}>
          <Typography variant="body" color="textMuted">
            상품을 불러오지 못했어요.
          </Typography>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.center}>
          <Typography variant="body" color="textMuted">
            '{keyword}' 관련 상품이 없어요.
          </Typography>
        </View>
      ) : (
        <BottomSheetFlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductListItem product={item} onPress={pushDetail} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
});
