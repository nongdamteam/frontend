import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';
import { DetailTab } from '../types';

interface DetailTabsProps {
  activeTab: DetailTab;
  onTabPress: (tab: DetailTab) => void;
}

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'description', label: '상세 설명' },
  { id: 'reviews', label: '리뷰' },
  { id: 'inquiries', label: '문의/환불' },
];

export function DetailTabs({ activeTab, onTabPress }: DetailTabsProps) {
  return (
    <View style={styles.tabHeaderContainer}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default DetailTabs;
