import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BottomNavigationBar, { TabType } from '../components/common/BottomNavigationBar';
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import ProfileScreen from './ProfileScreen';
import { COLORS } from '../theme/colors';

interface OtherTabsProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onSwipeProgress?: (translationX: number) => void;
  onSwipeEnd?: (translationX: number, velocityX: number) => void;
}

export default function OtherTabs({
  currentTab,
  onTabChange,
  onSwipeProgress,
  onSwipeEnd,
}: OtherTabsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.screenContainer, currentTab !== 'home' && styles.hidden]}>
          <HomeScreen
            onSwipeProgress={onSwipeProgress}
            onSwipeEnd={onSwipeEnd}
          />
        </View>
        <View style={[styles.screenContainer, currentTab !== 'cart' && styles.hidden]}>
          <CartScreen />
        </View>
        <View style={[styles.screenContainer, currentTab !== 'profile' && styles.hidden]}>
          <ProfileScreen />
        </View>
      </View>
      <BottomNavigationBar currentTab={currentTab} onTabChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    ...StyleSheet.absoluteFill,
  },
  hidden: {
    display: 'none',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.inactive,
    fontSize: 16,
  },
});
