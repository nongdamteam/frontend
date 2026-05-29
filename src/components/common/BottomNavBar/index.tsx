import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { COLORS } from '@/constants/colors';
import { BottomNavBarProps } from './types';

const TABS = [
  { name: '홈', icon: '🏠', id: 'home' },
  { name: '찾기', icon: '🔍', id: 'search' },
  { name: '공동구매', icon: '🤝', id: 'group' },
  { name: '채팅', icon: '💬', id: 'chat' },
  { name: '마이', icon: '👤', id: 'my' },
];

export function BottomNavBar({ activeTab = 'group', onTabPress }: BottomNavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const tintColor = isActive ? COLORS.primary : COLORS.textSecondary;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onTabPress?.(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Text style={[styles.iconText, { color: tintColor }]}>{tab.icon}</Text>
            </View>
            <Text style={[styles.tabLabel, { color: tintColor }]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default BottomNavBar;
