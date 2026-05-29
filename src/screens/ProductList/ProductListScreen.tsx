import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/screens/HomeScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import BackHeader from '@/components/common/BackHeader';
import { COLORS } from '@/constants/colors';
import { useProducts, ITEMS_PER_PAGE } from './hooks/useProducts';

// 공통 컴포넌트 임포트
import SearchBar from '@/components/common/SearchBar';
// import BottomNavBar from '@/components/common/BottomNavBar';

// 화면 하위 컴포넌트 임포트
import RecipeBanner from './components/RecipeBanner';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';

export function ProductListScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'ProductList'>>();
  const initialGroupPurchaseOnly = route.params?.isGroupPurchaseOnly ?? false;
  const initialSearchQuery = route.params?.searchQuery ?? '';
  const initialSortOption = route.params?.initialSortOption ?? 'none';
  const isPopularRanking = route.params?.isPopularRanking ?? false;

  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const insets = useSafeAreaInsets();
  
  const [activeTab, setActiveTab] = useState('group'); // 하단 탭바 활성 탭

  const {
    products,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    isGroupPurchaseOnly,
    setIsGroupPurchaseOnly,
    currentPage,
    totalPages,
    isLoading,
    handlePageChange,
    totalItems,
  } = useProducts(initialSearchQuery, initialGroupPurchaseOnly, initialSortOption, isPopularRanking ? 100 : undefined);

  const flatListRef = useRef<FlatList<any>>(null);

  // Ensure list scrolls to top when page changes
  const onPageChange = (page: number) => {
    handlePageChange(page);
    // after changing page, scroll list to top so user sees the first items
    try {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } catch (e) {
      // fallback: ignore if method not available
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader
        center={<SearchBar value={searchQuery} onChangeText={setSearchQuery} />}
      />

      {/* 상품 목록 리스트 */}
      <FlatList
        ref={flatListRef}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('Details', { product: item, entryPoint: 'list' })}
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
            <Text style={styles.emptyText}>조건에 맞는 봄동 상품이 없습니다.</Text>
          </View>
        }
      />

      {/* 페이지 전환 시 부드러운 로딩 스피너 연출 */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {/* 하단 고정 네비게이션바 (자리를 남겨두는 것에서 나아가 실제 플레이스홀더 바 렌더링)
      <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
      */}
    </View>
  );
}
export default ProductListScreen;
