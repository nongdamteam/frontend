import React, { useMemo } from 'react';
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COLORS } from '@/constants/colors';

type FarmProduct = {
  id: string;
  image: ImageSourcePropType | string;
  name: string;
  priceLabel: string;
  tag: string;
};

type FarmReview = {
  id: string;
  author: string;
  date: string;
  text: string;
};

type FarmInfo = {
  certifications: string[];
  description: string;
  delivery: string;
  headline: string;
  location: string;
  name: string;
  operationYears: number;
  products: FarmProduct[];
  rating: number;
  reviewCount: number;
  reviews: FarmReview[];
};

interface FarmInfoScreenProps {
  insets: EdgeInsets;
  isModal: boolean;
  onBack: () => void;
  product: any;
}

function imageSource(image: ImageSourcePropType | string | undefined) {
  if (!image) {
    return require('@/assets/images/bomdong_fresh.png');
  }

  return typeof image === 'string' ? { uri: image } : image;
}

function getProductTitle(product: any) {
  return product?.title ?? product?.name ?? '산지상품';
}

export function getFarmInfo(product: any): FarmInfo {
  const title = getProductTitle(product);
  const currentImage = product?.image ?? product?.thumbnailUrl ?? product?.images?.[0];

  if (title.includes('해남')) {
    return {
      name: '해남 땅끝농장',
      location: '전남 해남군 산이면',
      headline: '바닷바람을 맞고 자란 단단한 잎채소를 보내요.',
      description:
        '해남 황토밭에서 봄동과 세발나물을 중심으로 재배하는 가족 농가입니다. 수확 당일 선별 후 산지에서 바로 포장해 신선도를 지키고 있어요.',
      rating: 4.8,
      reviewCount: 186,
      operationYears: 12,
      delivery: '일반 택배 · 산지묶음배송',
      certifications: ['친환경 재배', '당일 선별', '보냉 포장'],
      products: [
        {
          id: 'farm-haenam-current',
          name: title,
          priceLabel: `${(product?.pricePer100g ?? 850).toLocaleString()}원 / 100g`,
          tag: '공구 진행중',
          image: currentImage,
        },
        {
          id: 'farm-haenam-sebal',
          name: '해남 세발나물 200g',
          priceLabel: '2,900원',
          tag: '새벽수확',
          image: require('@/assets/images/products/prod_004.png'),
        },
        {
          id: 'farm-haenam-bomdong',
          name: '해남 봄동 1포기',
          priceLabel: '4,500원',
          tag: '산지직송',
          image: require('@/assets/images/bomdong_fresh.png'),
        },
      ],
      reviews: [
        {
          id: 'haenam-review-1',
          author: '김*연',
          date: '2026.05.20',
          text: '잎이 단단하고 단맛이 좋아서 겉절이로 먹기 딱 좋았어요.',
        },
        {
          id: 'haenam-review-2',
          author: '박*민',
          date: '2026.05.12',
          text: '포장이 깔끔했고 흙냄새 없이 신선하게 도착했습니다.',
        },
      ],
    };
  }

  if (title.includes('서산') || title.includes('충남')) {
    return {
      name: '서산 황토농장',
      location: '충남 서산시 부석면',
      headline: '황토밭의 온도 차로 아삭한 봄채소를 키워요.',
      description:
        '서산 간척지 인근의 바람과 배수가 좋은 밭에서 봄동, 냉이, 쪽파를 재배합니다. 과한 비료보다 토양 관리에 집중하는 농가예요.',
      rating: 4.7,
      reviewCount: 142,
      operationYears: 9,
      delivery: '일반 택배 · 오후 수확분 발송',
      certifications: ['GAP 준비중', '저농약 관리', '꼼꼼 선별'],
      products: [
        {
          id: 'farm-seosan-current',
          name: title,
          priceLabel: `${(product?.pricePer100g ?? 1100).toLocaleString()}원 / 100g`,
          tag: '공구 진행중',
          image: currentImage,
        },
        {
          id: 'farm-seosan-cold',
          name: '서산 노지 냉이 300g',
          priceLabel: '5,800원',
          tag: '향 진함',
          image: require('@/assets/images/products/prod_001.png'),
        },
        {
          id: 'farm-seosan-green',
          name: '서산 쪽파 500g',
          priceLabel: '3,900원',
          tag: '묶음배송',
          image: require('@/assets/images/products/prod_003.png'),
        },
      ],
      reviews: [
        {
          id: 'seosan-review-1',
          author: '이*훈',
          date: '2026.05.18',
          text: '크기는 일정하지 않아도 맛이 진하고 신선도가 좋았습니다.',
        },
        {
          id: 'seosan-review-2',
          author: '최*아',
          date: '2026.05.07',
          text: '봄동 잎이 억세지 않고 샐러드로 먹어도 괜찮았어요.',
        },
      ],
    };
  }

  if (title.includes('홍성')) {
    return {
      name: '홍성 햇살농장',
      location: '충남 홍성군 홍동면',
      headline: '친환경 밭에서 제철 채소를 소량씩 수확합니다.',
      description:
        '홍성 햇살농장은 봄동과 쌈채소를 소량 재배하며 주문량에 맞춰 수확합니다. 작은 농가지만 선별과 포장에 시간을 충분히 쓰고 있어요.',
      rating: 4.6,
      reviewCount: 98,
      operationYears: 7,
      delivery: '일반 택배 · 화/목 발송',
      certifications: ['친환경 지향', '소량 수확', '재활용 포장'],
      products: [
        {
          id: 'farm-hongseong-current',
          name: title,
          priceLabel: `${(product?.pricePer100g ?? 980).toLocaleString()}원 / 100g`,
          tag: '공구 진행중',
          image: currentImage,
        },
        {
          id: 'farm-hongseong-ssam',
          name: '홍성 모듬 쌈채소 300g',
          priceLabel: '4,900원',
          tag: '소량수확',
          image: require('@/assets/images/products/prod_002.png'),
        },
        {
          id: 'farm-hongseong-radish',
          name: '홍성 어린 무청 500g',
          priceLabel: '3,700원',
          tag: '제철',
          image: require('@/assets/images/bomdong_fresh.png'),
        },
      ],
      reviews: [
        {
          id: 'hongseong-review-1',
          author: '정*호',
          date: '2026.05.21',
          text: '상태가 좋아서 받은 날 바로 무쳐 먹었습니다.',
        },
        {
          id: 'hongseong-review-2',
          author: '오*지',
          date: '2026.05.04',
          text: '양은 적당했고 포장 안쪽 물기 관리가 잘 되어 있었어요.',
        },
      ],
    };
  }

  if (title.includes('스마트팜')) {
    return {
      name: '초록 스마트팜',
      location: '경기 이천시 마장면',
      headline: '온습도 데이터를 보며 일정한 품질을 맞춰요.',
      description:
        '스마트팜 시설에서 봄동과 잎채소를 재배합니다. 수확 전 생육 데이터를 확인해 품질 편차를 줄이고, 세척 없이도 손질이 쉬운 상태로 보내요.',
      rating: 4.9,
      reviewCount: 221,
      operationYears: 5,
      delivery: '새벽배송 가능 · 보냉 포장',
      certifications: ['GAP 인증', '스마트팜', '품질 균일'],
      products: [
        {
          id: 'farm-smart-current',
          name: title,
          priceLabel: `${(product?.pricePer100g ?? 1200).toLocaleString()}원 / 100g`,
          tag: '인기',
          image: currentImage,
        },
        {
          id: 'farm-smart-lettuce',
          name: '스마트팜 버터헤드 2입',
          priceLabel: '4,800원',
          tag: '샐러드용',
          image: require('@/assets/images/products/prod_002.png'),
        },
        {
          id: 'farm-smart-herb',
          name: '스마트팜 바질 30g',
          priceLabel: '2,600원',
          tag: '향채소',
          image: require('@/assets/images/feed/eco_vegetables.png'),
        },
      ],
      reviews: [
        {
          id: 'smart-review-1',
          author: '문*라',
          date: '2026.05.22',
          text: '잎 크기가 고르고 손질하기 편해서 재구매하고 싶어요.',
        },
        {
          id: 'smart-review-2',
          author: '한*수',
          date: '2026.05.10',
          text: '배송 온도가 잘 유지되어서 신선함이 오래 갔습니다.',
        },
      ],
    };
  }

  return {
    name: '철원 들녘농장',
    location: '강원 철원군 동송읍',
    headline: '찬 기운을 머금은 들녘에서 향 좋은 봄채소를 키워요.',
    description:
      '철원 들녘농장은 냉이와 봄동을 주력으로 재배하는 산지 농가입니다. 주문이 모이면 당일 선별 후 보냉 포장으로 보내 신선도를 지키고 있어요.',
    rating: 4.8,
    reviewCount: 268,
    operationYears: 14,
    delivery: '새벽배송 가능 · 산지직송',
    certifications: ['GAP 인증', '당일 선별', '보냉 포장'],
    products: [
      {
        id: 'farm-cheorwon-current',
        name: title,
        priceLabel: `${(product?.pricePer100g ?? 1000).toLocaleString()}원 / 100g`,
        tag: '공구 진행중',
        image: currentImage,
      },
      {
        id: 'farm-cheorwon-cold',
        name: '철원 냉이 300g',
        priceLabel: '5,900원',
        tag: '향 진함',
        image: require('@/assets/images/products/prod_001.png'),
      },
      {
        id: 'farm-cheorwon-rice',
        name: '철원 오대쌀 2kg',
        priceLabel: '9,800원',
        tag: '산지직송',
        image: require('@/assets/images/products/prod_003.png'),
      },
    ],
    reviews: [
      {
        id: 'cheorwon-review-1',
        author: '김*연',
        date: '2026.05.21',
        text: '봄동이 싱싱하고 단맛이 좋아요. 냉장고에 며칠 둬도 잎이 쉽게 무르지 않았습니다.',
      },
      {
        id: 'cheorwon-review-2',
        author: '윤*재',
        date: '2026.05.14',
        text: '농가 설명처럼 포장이 꼼꼼했고 흙이 과하지 않아 손질이 편했어요.',
      },
    ],
  };
}

export default function FarmInfoScreen({
  insets,
  isModal,
  onBack,
  product,
}: FarmInfoScreenProps) {
  const farm = useMemo(() => getFarmInfo(product), [product]);
  const ScrollContainer = (isModal ? BottomSheetScrollView : ScrollView) as any;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            height: isModal ? 52 : 52 + insets.top,
            paddingTop: isModal ? 0 : insets.top,
          },
        ]}
      >
        <TouchableOpacity style={styles.headerButton} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>농가 정보</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollContainer
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 12) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>농</Text>
          </View>
          <Text style={styles.farmName}>{farm.name}</Text>
          <Text style={styles.location}>{farm.location}</Text>
          <Text style={styles.headline}>{farm.headline}</Text>

          <View style={styles.metricRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>★ {farm.rating.toFixed(1)}</Text>
              <Text style={styles.metricLabel}>농가 평점</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{farm.reviewCount}</Text>
              <Text style={styles.metricLabel}>구매 후기</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{farm.operationYears}년</Text>
              <Text style={styles.metricLabel}>재배 경력</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>농가 소개</Text>
          <Text style={styles.description}>{farm.description}</Text>
          <View style={styles.tagRow}>
            {farm.certifications.map(cert => (
              <View key={cert} style={styles.tag}>
                <Text style={styles.tagText}>{cert}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.deliveryText}>{farm.delivery}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>판매중 상품</Text>
            <Text style={styles.sectionMeta}>{farm.products.length}개</Text>
          </View>
          {farm.products.map(item => (
            <View key={item.id} style={styles.productRow}>
              <Image source={imageSource(item.image)} style={styles.productImage} resizeMode="cover" />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.priceLabel}</Text>
              </View>
              <View style={styles.productTag}>
                <Text style={styles.productTagText}>{item.tag}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>농가 후기</Text>
            <Text style={styles.sectionMeta}>평균 ★ {farm.rating.toFixed(1)}</Text>
          </View>
          {farm.reviews.map(review => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))}
        </View>
      </ScrollContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomColor: '#F5F5F5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  headerButtonText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
  },
  scroll: {
    backgroundColor: '#FAFAF8',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    marginBottom: 10,
    width: 52,
  },
  avatarText: {
    color: '#2E5A27',
    fontSize: 22,
    fontWeight: '900',
  },
  farmName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  location: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  headline: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 10,
    textAlign: 'center',
  },
  metricRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 18,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '900',
  },
  metricLabel: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  metricDivider: {
    backgroundColor: '#EEEEEE',
    height: 32,
    width: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900',
  },
  sectionMeta: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  tag: {
    backgroundColor: COLORS.badgeBg,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: COLORS.badgeText,
    fontSize: 11,
    fontWeight: '800',
  },
  deliveryText: {
    color: '#2E5A27',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 12,
  },
  productRow: {
    alignItems: 'center',
    borderBottomColor: '#F5F5F5',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  productImage: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    height: 54,
    marginRight: 12,
    width: 54,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '800',
  },
  productPrice: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  productTag: {
    backgroundColor: '#EBF6EB',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  productTagText: {
    color: '#2E5A27',
    fontSize: 10,
    fontWeight: '800',
  },
  reviewItem: {
    borderTopColor: '#F5F5F5',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reviewAuthor: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
  },
  reviewDate: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '600',
  },
  reviewText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});
