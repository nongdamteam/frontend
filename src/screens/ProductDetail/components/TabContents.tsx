import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import { DetailTab } from '../types';
import AiReviewSummary from './AiReviewSummary';

interface TabContentsProps {
  activeTab: DetailTab;
  productTitle: string;
}

export function TabContents({ activeTab, productTitle }: TabContentsProps) {
  switch (activeTab) {
    case 'description':
      return (
        <View style={styles.tabContentContainer}>
          <Text style={[styles.descText, { fontWeight: 'bold', fontSize: 16 }]}>
            🥬 산지의 신선함을 그대로 전하는 정성 가득 봄동
          </Text>
          <Text style={styles.descText}>
            이 봄동은 무농약 친환경 스마트팜에서 정보통신기술(ICT)을 이용해 온도, 습도, 광량 등을 최적으로 조절하여 정성껏 길러냈습니다. 흙먼지나 공해로부터 완벽히 차단된 정밀 청정 구역에서 생산되어 세척이 매우 용이하며 안심하고 드실 수 있습니다.
          </Text>
          <Text style={styles.descText}>
            아삭하고 꼬들꼬들한 특유의 맛이 일품이며, 비타민 C와 칼슘이 풍부하여 봄철 춘곤증 예방과 면역력 증진에 아주 좋습니다. 수확 직후 정성껏 포장하여 공동구매 참여 당일 신선하게 받아보실 수 있습니다.
          </Text>
          <Text style={[styles.descText, { fontWeight: 'bold', fontSize: 15, marginTop: 8 }]}>
            🍽️ 맛있는 봄동 요리 팁
          </Text>
          <Text style={styles.descText}>
            • **봄동 겉절이**: 소금에 살짝 절인 후 멸치액젓, 고춧가루, 다진 마늘, 참기름과 버무리면 매콤아삭한 밑반찬이 완성됩니다.{"\n"}
            • **봄동 된장국**: 구수한 멸치 육수에 봄동을 썰어 넣고 된장을 풀어 끓여내면 달큰하고 시원한 국물맛을 즐기실 수 있습니다.
          </Text>
        </View>
      );

    case 'reviews':
      return (
        <View style={styles.tabContentContainer}>
          {/* AI 리뷰 요약 */}
          <AiReviewSummary />

          {/* 리뷰 요약 헤더 */}
          <View style={styles.ratingHeader}>
            <Text style={styles.ratingNumber}>4.8</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingStar}>★</Text>
            </View>
            <Text style={styles.ratingCountText}>리뷰 총 124건</Text>
          </View>

          {/* 리뷰 리스트 */}
          <View style={styles.reviewItem}>
            <View style={styles.reviewUserRow}>
              <Text style={styles.reviewUser}>농담조아해요 (★5.0)</Text>
              <Text style={styles.reviewDate}>2026.05.27</Text>
            </View>
            <Text style={styles.reviewText}>
              완전 대박! 진짜 아삭아삭하고 상처 하나 없이 아주 깔끔하게 도착했어요. 받자마자 바로 겉절이 해먹었는데 밥 한 그릇 순삭했습니다.
            </Text>
          </View>

          <View style={styles.reviewItem}>
            <View style={styles.reviewUserRow}>
              <Text style={styles.reviewUser}>신선파 식재료 (★4.5)</Text>
              <Text style={styles.reviewDate}>2026.05.25</Text>
            </View>
            <Text style={styles.reviewText}>
              마트에서 파는 것보다 훨씬 깨끗하고 신선해요. 공동구매라서 배송이 조금 걸릴까 걱정했는데 다음 날 바로 집 앞 배송 완료됐네요. 추천해요.
            </Text>
          </View>

          <View style={styles.reviewItem}>
            <View style={styles.reviewUserRow}>
              <Text style={styles.reviewUser}>요리초보자 (★5.0)</Text>
              <Text style={styles.reviewDate}>2026.05.23</Text>
            </View>
            <Text style={styles.reviewText}>
              양이 넉넉해서 절반은 국 끓여 먹고 절반은 겉절이 해먹었어요. 단맛이 아주 강해서 양념을 세게 안 해도 너무 맛있네요. 재구매 의향 200% 입니다!
            </Text>
          </View>
        </View>
      );

    case 'inquiries':
      return (
        <View style={styles.tabContentContainer}>
          {/* 배송 및 공구 안내 */}
          <View style={styles.inquiryNotice}>
            <Text style={styles.inquiryNoticeTitle}>📌 공동구매 이용 및 환불 정책</Text>
            <Text style={styles.inquiryNoticeText}>
              • 이 상품은 공동구매 상품으로 목표 인원 달성 시 산지 수확 및 순차 배송됩니다.{"\n"}
              • 신선식품 특성상 단순 변심에 의한 반품/환불은 불가합니다. 단, 수령 직후 상품 이상이 발견될 경우 사진 첨부와 함께 고객센터로 즉시 문의 주시면 확인 후 신속하게 교환/환불을 진행해 드립니다.
            </Text>
          </View>

          {/* 자주 묻는 문의 */}
          <View style={styles.inquiryItem}>
            <Text style={styles.inquiryQ}>Q. 배송은 언제 시작되나요?</Text>
            <Text style={styles.inquiryA}>
              A. 본 상품은 공동구매가 성공하여 주문이 최종 마감되는 시점 기준 다음 날 산지에서 일괄 발송되며, 일반 택배로 1~2일 내에 수령 가능합니다.
            </Text>
          </View>

          <View style={styles.inquiryItem}>
            <Text style={styles.inquiryQ}>Q. 세척 후 보관해야 하나요?</Text>
            <Text style={styles.inquiryA}>
              A. 수령 후 가급적 신선한 상태로 바로 섭취하는 것을 권장합니다. 보관이 필요할 경우 세척하지 않은 채로 키친타월에 싸서 지퍼백에 밀봉한 후 냉장 보관하시면 좀 더 신선함이 오래 유지됩니다.
            </Text>
          </View>
        </View>
      );

    default:
      return null;
  }
}
export default TabContents;
