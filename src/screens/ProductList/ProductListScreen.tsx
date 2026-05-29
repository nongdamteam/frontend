import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/screens/HomeScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import BackHeader from '@/components/common/BackHeader';
import { COLORS } from '@/constants/colors';
import { useProducts, ITEMS_PER_PAGE } from './hooks/useProducts';
import { SortOption } from './types';

// 공통 컴포넌트 임포트
import SearchBar from '@/components/common/SearchBar';

// 화면 하위 컴포넌트 임포트
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';

export interface ProductListContentProps {
  productState: ReturnType<typeof useProducts>;
  isPopularRanking?: boolean;
  onProductPress?: (product: any) => void;
}

/**
 * 리스트 UI 렌더링만을 담당하는 순수 뷰 컴포넌트 (모달 및 스크린 공용)
 * useRoute/useNavigation에 의존하지 않으므로 에러 크래시를 원천 차단합니다.
 */
export function ProductListContent({
  productState,
  isPopularRanking = false,
  onProductPress,
}: ProductListContentProps) {
  const {
    products,
    searchQuery,
    sortOption,
    setSortOption,
    isGroupPurchaseOnly,
    setIsGroupPurchaseOnly,
    currentPage,
    totalPages,
    isLoading,
    handlePageChange,
    totalItems,
  } = productState;

  const flatListRef = useRef<FlatList<any>>(null);

  const onPageChange = (page: number) => {
    handlePageChange(page);
    try {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (e) { }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 상품 목록 리스트 */}
      <FlatList
        ref={flatListRef}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            onPress={() => onProductPress?.(item)}
            rank={
              isPopularRanking
                ? (currentPage - 1) * ITEMS_PER_PAGE + index + 1
                : undefined
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* 필터 탭바 */}
            <FilterBar
              sortOption={sortOption}
              onSortChange={setSortOption}
              isGroupPurchaseOnly={isGroupPurchaseOnly}
              onGroupPurchaseToggle={() => setIsGroupPurchaseOnly(!isGroupPurchaseOnly)}
            />

            {/* 검색 결과 표시 */}
            {searchQuery.trim() !== '' && (
              <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginVertical: 10 }}>
                &apos;{searchQuery}&apos; 검색 결과 (총 {totalItems}건)
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          products.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🥬</Text>
            <Text style={styles.emptyText}>조건에 맞는 상품이 없습니다.</Text>
          </View>
        }
      />

      {/* 페이지 전환 시 부드러운 로딩 스피너 연출 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

/**
 * 기존 전체 화면 형태의 ProductListScreen
 */
export function ProductListScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'ProductList'>>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const initialGroupPurchaseOnly = route.params?.isGroupPurchaseOnly ?? false;
  const initialSearchQuery = route.params?.searchQuery ?? '';
  const initialSortOption = route.params?.initialSortOption ?? 'none';
  const isPopularRanking = route.params?.isPopularRanking ?? false;

  const productState = useProducts(
    initialSearchQuery,
    initialGroupPurchaseOnly,
    initialSortOption,
    isPopularRanking ? 100 : undefined
  );

  return (
    <View style={styles.container}>
      <BackHeader
        center={
          <SearchBar
            value={productState.searchQuery}
            onChangeText={productState.setSearchQuery}
          />
        }
      />

      <ProductListContent
        productState={productState}
        isPopularRanking={isPopularRanking}
        onProductPress={(product) =>
          navigation.navigate('Details', { product, entryPoint: 'list' })
        }
      />
    </View>
  );
}

export default ProductListScreen;
