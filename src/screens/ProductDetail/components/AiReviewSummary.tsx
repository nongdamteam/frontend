import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AiReviewSummary() {
  return (
    <View style={localStyles.outerContainer}>
      {/* Title Header */}
      <View style={localStyles.titleRow}>
        <Text style={localStyles.titleText}>AI 리뷰 요약</Text>
        <Text style={localStyles.subtitleText}>128개의 최근 리뷰를 분석했어요</Text>
      </View>

      {/* Blue Summary Card */}
      <View style={localStyles.summaryCard}>
        <Text style={localStyles.summaryText}>
          최근 리뷰에서는 <Text style={localStyles.boldBlueText}>신선도와 맛</Text>에 대한 만족도가 높습니다. 다만 일부 사용자는 <Text style={localStyles.boldBlueText}>포장이 약하다</Text>고 느꼈습니다.
        </Text>
      </View>

      {/* Pros & Cons Columns */}
      <View style={localStyles.columnsRow}>
        {/* Pros (Green) */}
        <View style={[localStyles.columnCard, localStyles.prosCard]}>
          <Text style={localStyles.prosText}>· 맛이 좋다는 반응이 많아요.</Text>
          <Text style={[localStyles.prosText, { marginTop: 4 }]}>· 신선하다는 리뷰가 많아요.</Text>
        </View>

        {/* Cons (Red) */}
        <View style={[localStyles.columnCard, localStyles.consCard]}>
          <Text style={localStyles.consText}>
            · 일부 리뷰에서 포장이 약해 잎이 눌렸다는 의견이 있어요.
          </Text>
        </View>
      </View>

      {/* Yellow Recommendation Card */}
      <View style={localStyles.recommendCard}>
        <Text style={localStyles.recommendText}>
          <Text style={localStyles.boldRecommendText}>이런 분께 추천해요!</Text> 2~3일 안에 바로 조리할 분
        </Text>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  outerContainer: {
    borderWidth: 1.5,
    borderColor: '#C5D8F1', // light blue border matching image
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitleText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 6,
  },
  summaryCard: {
    backgroundColor: '#EDF2FC', // Light blue/lavender background
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  boldBlueText: {
    fontWeight: 'bold',
    color: '#1E40AF', // dark blue text
  },
  columnsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  columnCard: {
    flex: 1,
    borderRadius: 6,
    padding: 10,
  },
  prosCard: {
    backgroundColor: '#EFF9F0', // Soft light green
  },
  consCard: {
    backgroundColor: '#FDF2F2', // Soft light red/pink
  },
  prosText: {
    fontSize: 11.5,
    color: '#1E6B24', // dark green
    lineHeight: 16,
  },
  consText: {
    fontSize: 11.5,
    color: '#B71C1C', // dark red
    lineHeight: 16,
  },
  recommendCard: {
    backgroundColor: '#FEF7D5', // Soft light yellow
    borderRadius: 6,
    padding: 10,
  },
  recommendText: {
    fontSize: 12,
    color: '#78350F', // dark brown/amber
  },
  boldRecommendText: {
    fontWeight: 'bold',
    color: '#B45309', // amber bold
  },
});
