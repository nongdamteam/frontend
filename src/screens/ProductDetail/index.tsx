import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { ProductDetailProps, DetailTab } from './types';

// 컴포넌트 임포트
import ImageCarousel from './components/ImageCarousel';
import PriceComparison from './components/PriceComparison';
import DetailTabs from './components/DetailTabs';
import TabContents from './components/TabContents';

export function ProductDetailScreen({ route, navigation }: ProductDetailProps) {
  const { product, entryPoint = 'list' } = route.params;
  const [activeTab, setActiveTab] = useState<DetailTab>('description');
  const insets = useSafeAreaInsets();

  const formattedPrice = product.pricePer100g.toLocaleString();

  // 장바구니 담기 핸들러
  const handleAddToCart = () => {
    Alert.alert('장바구니', `[${product.title}]을(를) 장바구니에 담았습니다.`);
  };

  // 구매하기 핸들러
  const handleBuy = () => {
    Alert.alert('주문', `[${product.title}] 공동구매 신청을 진행합니다.`);
  };

  return (
    <View style={styles.container}>
      {/* 커스텀 상단 헤더 (기기 상태바 겹침 방지 여백 적용) */}
      <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {entryPoint === 'home' ? '🏠 홈 특가 상세' : '상품 상세'}
        </Text>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Text style={[styles.headerButtonText, { fontSize: 16 }]}>공유</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 70 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 이미지 캐러셀 슬라이더 */}
        <ImageCarousel />

        {/* 홈 피드 진입 전용 특별 배너 */}
        {entryPoint === 'home' && (
          <View style={localStyles.specialBanner}>
            <Text style={localStyles.specialBannerEmoji}>🔥</Text>
            <Text style={localStyles.specialBannerText}>
              홈 피드 특별 추천! 공동구매 특가 혜택 적용 상품
            </Text>
          </View>
        )}

        {/* 상품 정보 영역 */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{product.title}</Text>
          
          <View style={styles.badgeRow}>
            {product.tags.map((tag, idx) => (
              <View key={`detail-tag-${idx}`} style={styles.badge}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.pricePrefix}>100g당</Text>
            <Text style={styles.priceText}>{formattedPrice}원</Text>
          </View>

          {/* 초록색 가격 변동 비교 분석 상자 */}
          <PriceComparison currentPrice={product.pricePer100g} />
        </View>

        {/* 탭 네비게이터 */}
        <DetailTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* 탭 내부 페이지 전환 콘텐츠 */}
        <TabContents activeTab={activeTab} productTitle={product.title} />
      </ScrollView>

      {/* 하단 고정 구매바 (Safe Area 보정) */}
      <View
        style={[
          styles.bottomPurchaseBar,
          { paddingBottom: Math.max(insets.bottom, 12), height: Math.max(insets.bottom, 12) + 64 },
        ]}
      >
        <TouchableOpacity
          style={styles.cartButton}
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.cartEmoji}>🛒</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuy}
          activeOpacity={0.8}
        >
          <Text style={styles.buyButtonText}>구매하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  specialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9DB', // 밝은 노란색 톤
    borderColor: '#FFE066',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  specialBannerEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  specialBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59F00',
    letterSpacing: -0.3,
  },
});

export default ProductDetailScreen;
