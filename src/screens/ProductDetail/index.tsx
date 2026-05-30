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
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { styles } from './styles';
import { ProductDetailProps, DetailTab } from './types';
import { cartService } from '@/services/cartService';

import ArrowLeftIcon from '@/assets/icons/ArrowLeftIcon';
import FireIcon from '@/assets/icons/FireIcon';
import CartIcon from '@/assets/icons/CartIcon';


// 컴포넌트 임포트
import ImageCarousel from './components/ImageCarousel';
import PriceComparison from './components/PriceComparison';
import DetailTabs from './components/DetailTabs';
import TabContents from './components/TabContents';
import FarmInfoScreen, { getFarmInfo } from './components/FarmInfoScreen';

export function ProductDetailScreen({
  route,
  navigation,
  product: propsProduct,
  entryPoint: propsEntryPoint,
  onBackPress,
}: ProductDetailProps) {
  const product = route?.params?.product ?? propsProduct;
  const entryPoint = route?.params?.entryPoint ?? propsEntryPoint ?? 'list';
  const [activeTab, setActiveTab] = useState<DetailTab>('description');
  const [showFarmInfo, setShowFarmInfo] = useState(false);
  const insets = useSafeAreaInsets();
  const isModal = entryPoint === 'modal';

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.infoSection}>
          <Text style={{ textAlign: 'center', marginTop: 40 }}>상품 정보를 찾을 수 없습니다.</Text>
        </View>
      </View>
    );
  }

  const formattedPrice = product.pricePer100g ? product.pricePer100g.toLocaleString() : '0';
  const farmInfo = getFarmInfo(product);

  // 장바구니 담기 핸들러
  const handleAddToCart = () => {
    const farmId = product.title?.includes('해남') ? 'haenam' : 'cheorwon';
    const newCartItem = {
      id: product.id,
      farmId,
      title: product.title,
      option: '옵션: 공동구매 특가 · 산지직송',
      unitPrice: product.pricePer100g || 1000,
      quantity: 1,
      checked: true,
      image: product.image,
    };
    cartService.addCartItem(newCartItem);

    Alert.alert(
      '장바구니 담기 완료',
      `[${product.title}]이(가) 장바구니에 추가되었습니다.`,
      [
        {
          text: '확인',
        }
      ]
    );
  };

  // 구매하기 핸들러
  const handleBuy = () => {
    if (product.isGroupPurchase) {
      Alert.alert(
        '공동구매 참여',
        '공구에 참여하시겠습니까?',
        [
          {
            text: '아니오',
            style: 'cancel',
            onPress: () => {
              handleAddToCart();
            }
          },
          {
            text: '예',
            onPress: () => {
              cartService.addOrderFromProduct(product);
              cartService.setShouldShowOrderHistory(true);
              Alert.alert(
                '신청 완료',
                '공동구매 신청이 성공적으로 접수되었습니다.',
                [
                  {
                    text: '확인',
                  }
                ]
              );
            }
          }
        ]
      );
    } else {
      Alert.alert(
        '바로 구매',
        `[${product.title}]을(를) 바로 구매하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '구매하기',
            onPress: () => {
              cartService.addOrderFromProduct(product);
              cartService.setShouldShowOrderHistory(true);
              Alert.alert(
                '주문 완료',
                '주문이 성공적으로 완료되었습니다.',
                [
                  {
                    text: '확인',
                  }
                ]
              );
            }
          }
        ]
      );
    }
  };

  const ScrollContainer = (isModal ? BottomSheetScrollView : ScrollView) as any;

  if (showFarmInfo) {
    return (
      <FarmInfoScreen
        insets={insets}
        isModal={isModal}
        onBack={() => setShowFarmInfo(false)}
        product={product}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* 커스텀 상단 헤더 (기기 상태바 겹침 방지 여백 적용) */}
      <View style={[styles.header, { paddingTop: isModal ? 0 : insets.top, height: isModal ? 52 : 52 + insets.top }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            if (onBackPress) {
              onBackPress();
            } else if (navigation) {
              navigation.goBack();
            }
          }}
          activeOpacity={0.7}
        >
          <ArrowLeftIcon color="#222222" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {entryPoint === 'home' ? '홈 특가 상세' : '상품 상세'}
        </Text>
        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Text style={[styles.headerButtonText, { fontSize: 16 }]}>공유</Text>
        </TouchableOpacity>
      </View>

      <ScrollContainer
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 12) + 70 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 이미지 캐러셀 슬라이더 */}
        <ImageCarousel images={product.images || (product.image ? [product.image] : [])} />

        {/* 홈 피드 진입 전용 특별 배너 */}
        {entryPoint === 'home' && (
          <View style={localStyles.specialBanner}>
            <View style={localStyles.specialBannerIcon}>
              <FireIcon size={16} color="#F59F00" />
            </View>
            <Text style={localStyles.specialBannerText}>
              홈 피드 특별 추천! 공동구매 특가 혜택 적용 상품
            </Text>
          </View>
        )}

        {/* 상품 정보 영역 */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.badgeRow}>
            {product.tags.map((tag: string, idx: number) => (
              <View key={`detail-tag-${idx}`} style={styles.badge}>
                <Text style={styles.badgeText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.pricePrefix}>100g당</Text>
            <Text style={styles.priceText}>{formattedPrice}원</Text>
          </View>

          <TouchableOpacity
            style={styles.farmInfoButton}
            onPress={() => setShowFarmInfo(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.farmInfoLabel}>판매자</Text>
            <Text style={styles.farmInfoName} numberOfLines={1}>
              {farmInfo.name}
            </Text>
            <Text style={styles.farmInfoRating}>★ {farmInfo.rating.toFixed(1)}</Text>
            <Text style={styles.farmInfoArrow}>›</Text>
          </TouchableOpacity>

          {/* 초록색 가격 변동 비교 분석 상자 */}
          <PriceComparison currentPrice={product.pricePer100g} />
        </View>

        {/* 탭 네비게이터 */}
        <DetailTabs activeTab={activeTab} onTabPress={setActiveTab} />

        {/* 탭 내부 페이지 전환 콘텐츠 */}
        <TabContents activeTab={activeTab} productTitle={product.title} />
      </ScrollContainer>

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
          <CartIcon color="#D4494B" size={24} />
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
  specialBannerIcon: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59F00',
    letterSpacing: -0.3,
  },
});

export default ProductDetailScreen;
