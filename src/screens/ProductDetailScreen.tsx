import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Product} from '../components/ProductCard';
import {colors, radius, shadow, spacing, typography} from '../styles/theme';

type ProductDetailScreenProps = {
  onBack: () => void;
  product: Product;
};

type DetailTab = 'description' | 'review' | 'support';

const tabs: {key: DetailTab; label: string}[] = [
  {key: 'description', label: '상세 설명'},
  {key: 'review', label: '리뷰'},
  {key: 'support', label: '문의/환불'},
];

function ProductDetailScreen({onBack, product}: ProductDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('description');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹ 홈</Text>
        </Pressable>

        <View style={styles.heroImage}>
          <View style={styles.pagination}>
            <View style={styles.activeDot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.badges}>
          {product.badges.map(badge => (
            <Text key={badge} style={styles.badge}>
              {badge}
            </Text>
          ))}
        </View>

        <Text style={styles.price}>{product.price}</Text>
        {product.discountNote ? (
          <Text style={styles.discount}>{product.discountNote}</Text>
        ) : null}

        <View style={styles.actions}>
          <Pressable style={styles.cartButton}>
            <Text style={styles.cartIcon}>▢</Text>
          </Pressable>
          <Pressable style={styles.buyButton}>
            <Text style={styles.buyText}>구매하기</Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          {tabs.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}>
              <Text style={styles.tabText}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {activeTab === 'description' ? (
          <DescriptionSection product={product} />
        ) : null}
        {activeTab === 'review' ? <ReviewSection /> : null}
        {activeTab === 'support' ? <SupportSection /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function DescriptionSection({product}: {product: Product}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>오늘 수확한 봄동을 산지에서 바로 보내드려요</Text>
      <Text style={styles.paragraph}>
        {product.title}은 잎이 부드럽고 단맛이 좋아 겉절이, 된장국, 샤브샤브에
        잘 어울리는 제철 채소입니다. 주문이 모이면 농가에서 선별 후 포장해
        신선한 상태로 발송합니다.
      </Text>

      <View style={styles.infoBox}>
        <InfoRow label="원산지" value="국내산" />
        <InfoRow label="보관 방법" value="냉장 보관, 수령 후 3일 내 섭취 권장" />
        <InfoRow label="배송 안내" value="공구 마감 후 순차 발송" />
        <InfoRow label="구성" value="최소 500g부터 공동구매 가능" />
      </View>

      <Text style={styles.sectionTitle}>이런 점이 좋아요</Text>
      <Text style={styles.bullet}>- GAP 인증 농가 상품을 우선으로 선별했어요.</Text>
      <Text style={styles.bullet}>- 흙과 손상 잎을 한 번 정리한 뒤 포장해요.</Text>
      <Text style={styles.bullet}>- 공동구매로 필요한 양만 합리적으로 구매할 수 있어요.</Text>
    </View>
  );
}

function ReviewSection() {
  return (
    <View style={styles.section}>
      <View style={styles.ratingSummary}>
        <Text style={styles.ratingScore}>4.8</Text>
        <Text style={styles.ratingText}>★★★★★</Text>
        <Text style={styles.reviewCount}>리뷰 128개</Text>
      </View>

      <ReviewItem
        author="김*연"
        content="잎이 깨끗하고 생각보다 양이 넉넉했어요. 겉절이로 먹었는데 달큰해서 만족합니다."
        meta="재구매 의사 있어요 · 2일 전"
      />
      <ReviewItem
        author="박*준"
        content="포장이 단단하게 와서 무른 부분이 거의 없었습니다. 가격도 마트보다 괜찮았어요."
        meta="배송 만족 · 5일 전"
      />
      <ReviewItem
        author="이*민"
        content="국 끓이니 향이 좋네요. 다음 공구 열리면 부모님 댁에도 보내려고요."
        meta="맛 만족 · 1주 전"
      />
    </View>
  );
}

function SupportSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>문의 안내</Text>
      <Text style={styles.paragraph}>
        상품, 배송, 공동구매 일정 문의는 구매 전 문의를 남겨주세요. 농가 확인이
        필요한 내용은 답변까지 시간이 조금 걸릴 수 있습니다.
      </Text>

      <View style={styles.infoBox}>
        <InfoRow label="취소" value="공구 마감 전까지 가능" />
        <InfoRow label="교환/환불" value="수령 당일 사진 접수 시 확인 후 처리" />
        <InfoRow label="배송 지연" value="기상 상황에 따라 수확 일정 조정 가능" />
      </View>

      <Text style={styles.notice}>
        신선식품 특성상 단순 변심으로 인한 교환/환불은 제한될 수 있습니다.
      </Text>
    </View>
  );
}

function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ReviewItem({
  author,
  content,
  meta,
}: {
  author: string;
  content: string;
  meta: string;
}) {
  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewAuthor}>{author}</Text>
        <Text style={styles.reviewStars}>★★★★★</Text>
      </View>
      <Text style={styles.paragraph}>{content}</Text>
      <Text style={styles.reviewMeta}>{meta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  backText: {
    ...typography.body,
    color: colors.mutedText,
  },
  heroImage: {
    ...shadow.soft,
    alignItems: 'center',
    aspectRatio: 1,
    backgroundColor: colors.placeholder,
    borderRadius: radius.md,
    justifyContent: 'flex-end',
    marginBottom: spacing.xl,
    overflow: 'hidden',
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  dot: {
    backgroundColor: colors.surface,
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  activeDot: {
    backgroundColor: colors.border,
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  title: {
    ...typography.headline,
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    ...typography.badge,
    backgroundColor: colors.badge,
    borderRadius: radius.xs,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  price: {
    ...typography.headline,
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  discount: {
    ...typography.badge,
    alignSelf: 'flex-start',
    backgroundColor: colors.successBadge,
    borderRadius: radius.xs,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
  },
  cartButton: {
    alignItems: 'center',
    backgroundColor: colors.softSurface,
    borderRadius: radius.sm,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  cartIcon: {
    color: colors.mutedText,
    fontSize: 24,
  },
  buyButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    flex: 1,
    height: 56,
    justifyContent: 'center',
  },
  buyText: {
    ...typography.title,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    backgroundColor: colors.softSurface,
    borderRadius: radius.sm,
    flex: 1,
    paddingVertical: spacing.md,
  },
  activeTab: {
    backgroundColor: colors.softBorder,
  },
  tabText: {
    ...typography.body,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.title,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  paragraph: {
    ...typography.body,
    color: colors.subtleText,
    lineHeight: 23,
  },
  infoBox: {
    backgroundColor: colors.surface,
    borderColor: colors.softBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    marginVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoRow: {
    borderBottomColor: colors.softBorder,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.mutedText,
    width: 72,
  },
  infoValue: {
    ...typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  bullet: {
    ...typography.body,
    color: colors.subtleText,
    lineHeight: 26,
  },
  ratingSummary: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.softBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  ratingScore: {
    ...typography.brand,
    fontSize: 34,
  },
  ratingText: {
    color: colors.border,
    fontSize: 16,
    marginVertical: spacing.xs,
  },
  reviewCount: {
    ...typography.caption,
    color: colors.mutedText,
  },
  reviewItem: {
    backgroundColor: colors.surface,
    borderColor: colors.softBorder,
    borderRadius: radius.md,
    borderBottomWidth: 1,
    borderWidth: 1,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  reviewHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  reviewAuthor: {
    ...typography.body,
    fontWeight: '700',
  },
  reviewStars: {
    color: colors.border,
    fontSize: 12,
  },
  reviewMeta: {
    ...typography.caption,
    color: colors.mutedText,
    marginTop: spacing.sm,
  },
  notice: {
    ...typography.caption,
    backgroundColor: colors.warningBadge,
    borderRadius: radius.sm,
    lineHeight: 18,
    padding: spacing.md,
  },
});

export default ProductDetailScreen;
