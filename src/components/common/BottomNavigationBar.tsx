import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BabsIcon from '../../assets/icons/BabsIcon';
import HomeIcon from '../../assets/icons/HomeIcon';
import CartIcon from '../../assets/icons/CartIcon';
import ProfileIcon from '../../assets/icons/ProfileIcon';
import { COLORS } from '../../theme/colors';

export type TabType = 'babs' | 'home' | 'cart' | 'profile';

interface BottomNavigationBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabItem {
  id: TabType;
  label: string;
  renderIcon: (color: string, size: number) => React.ReactNode;
}

export const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  currentTab,
  onTabChange,
}) => {
  const insets = useSafeAreaInsets();

  const scaleBabs = useRef(new Animated.Value(1)).current;
  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleCart = useRef(new Animated.Value(1)).current;
  const scaleProfile = useRef(new Animated.Value(1)).current;

  const getScaleValue = (tabId: TabType) => {
    switch (tabId) {
      case 'babs': return scaleBabs;
      case 'home': return scaleHome;
      case 'cart': return scaleCart;
      case 'profile': return scaleProfile;
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'babs',
      label: '밥스',
      renderIcon: (color, size) => <BabsIcon color={color} size={size} />,
    },
    {
      id: 'home',
      label: '홈',
      renderIcon: (color, size) => <HomeIcon color={color} size={size} />,
    },
    {
      id: 'cart',
      label: '장바구니',
      renderIcon: (color, size) => <CartIcon color={color} size={size} />,
    },
    {
      id: 'profile',
      label: '나',
      renderIcon: (color, size) => <ProfileIcon color={color} size={size} />,
    },
  ];

  const handlePress = (tabId: TabType) => {
    onTabChange(tabId);

    const scaleAnim = getScaleValue(tabId);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const activeColor = COLORS.primary;
          const inactiveColor = COLORS.inactive;
          const tabColor = isActive ? activeColor : inactiveColor;
          const scaleVal = getScaleValue(tab.id);

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.85}
              onPress={() => handlePress(tab.id)}
              style={styles.tabButton}
            >
              {isActive && (
                <View style={styles.indicatorContainer}>
                  <View style={styles.indicator} />
                </View>
              )}

              <Animated.View style={[{ transform: [{ scale: scaleVal }] }, styles.iconContainer]}>
                {tab.renderIcon(tabColor, 26)}
              </Animated.View>
              <Text style={[styles.label, { color: tabColor }, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#A78B60',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 5,
  },
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COLORS.white,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    alignItems: 'center',
    overflow: 'visible',
  },
  indicator: {
    width: '38%',
    height: 4.5,
    backgroundColor: COLORS.primary,
    borderRadius: 99,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1.2 },
    shadowOpacity: 0.48,
    shadowRadius: 2.2,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 4,
    marginTop: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  activeLabel: {
    fontWeight: '700',
  },
});

export default BottomNavigationBar;
