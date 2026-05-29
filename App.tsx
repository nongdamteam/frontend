import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

import RootNavigator from '@/navigation/RootNavigator';
import BottomNavigationBar, { TabType } from '@/components/common/BottomNavigationBar';
import { RootStackParamList } from './src/navigation/types';
import { COLORS } from './src/theme/colors';

const navigationRef = createNavigationContainerRef<RootStackParamList>();

const TAB_TO_ROUTE_NAME: Record<TabType, keyof RootStackParamList> = {
  babs: 'Babs',
  home: 'Home',
  cart: 'Cart',
  profile: 'Profile',
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  const handleTabChange = (tab: TabType) => {
    const routeName = TAB_TO_ROUTE_NAME[tab];
    setCurrentTab(tab);

    if (navigationRef.isReady() && navigationRef.getCurrentRoute()?.name !== routeName) {
      navigationRef.navigate(routeName);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <View style={styles.container}>
          <View style={styles.content}>
            <RootNavigator />
          </View>
          <BottomNavigationBar currentTab={currentTab} onTabChange={handleTabChange} />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default App;
