import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { COLORS } from '@/constants/colors';
import { useProducts } from './hooks/useProducts';

// 공통 컴포넌트 임포트
import SearchBar from '@/components/common/SearchBar';
import BottomNavBar from '@/components/common/BottomNavBar';

// 화면 하위 컴포넌트 임포트
import RecipeBanner from './components/RecipeBanner';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';

export function ProductListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  // 모드 분기 상태 (true: 홈에서 접근(검색창 활성화) / false: 릴스에서 접근(검색창 비활성화 & 레시피 배너 노출))
  const [isFromHome, setIsFromHome] = useState(false);
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
  } = useProducts();

  const flatListRef = useRef<FlatList>(null);

  // 레시피 배너에서 핀 카드를 탭했을 때
  const handleRecipeCardPress = () => {
    // 1. 검색어로 '봄동' 입력하여 리스트 검색
    setSearchQuery('봄동');
    
    // 2. 리스트를 배너 높이만큼 스크롤 다운시켜 필터와 상품 목록에 포커싱
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: 196, // 배너 높이(180) + 배너 마진(16)
        animated: true,
      });
    }, 100);
  };

  // 모드 변경 시 검색 초기화
  const handleModeChange = (mode: boolean) => {
    setIsFromHome(mode);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      {/* 상단 타이틀 헤더 (기기 상태바 겹침 방지 여백 적용) */}
      <View style={[styles.header, { paddingTop: insets.top, height: 56 + insets.top }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLogo}>봄동</Text>
          <Text style={styles.headerEmoji}>🌱</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          {/* 첫 번째 이미지 오른쪽 상단의 슬라이더 조절 모양 필터 아이콘 */}
          <Text style={styles.headerFilterIcon}>⌥</Text>
        </TouchableOpacity>
      </View>

      {/* 개발/검증용 모드 전환 스위치 (홈 진입 vs 릴스 진입) */}
      <View style={styles.modeSwitcher}>
        <TouchableOpacity
          style={[styles.modeTab, !isFromHome && styles.activeModeTab]}
          onPress={() => handleModeChange(false)}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeTabText, !isFromHome && styles.activeModeTabText]}>
            릴스 모드 (배너 카드 진입)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, isFromHome && styles.activeModeTab]}
          onPress={() => handleModeChange(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeTabText, isFromHome && styles.activeModeTabText]}>
            홈 모드 (검색창 진입)
          </Text>
        </TouchableOpacity>
      </View>

      {/* 상품 목록 리스트 */}
      <FlatList
        ref={flatListRef}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('Details', { product: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* 홈 모드일 때만 검색창 렌더링 */}
            {isFromHome ? (
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            ) : (
              // 릴스 모드일 때는 레시피 배너 렌더링 (임시 목업)
              <RecipeBanner onPressCard={handleRecipeCardPress} />
            )}

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
                &apos;{searchQuery}&apos; 검색 결과 (총 {products.length}건)
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          products.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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

      {/* 하단 고정 네비게이션바 (자리를 남겨두는 것에서 나아가 실제 플레이스홀더 바 렌더링) */}
      <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}
export default ProductListScreen;
