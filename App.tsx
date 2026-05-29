import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from '@/navigation/RootNavigator';
import BottomNavigationBar, { TabType } from '@/components/common/BottomNavigationBar';
import { COLORS } from './src/theme/colors';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <View style={styles.container}>
          <View style={styles.content}>
            <RootNavigator />
          </View>
          <BottomNavigationBar currentTab={currentTab} onTabChange={setCurrentTab} />
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
