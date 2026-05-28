import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import BottomNavigationBar, { TabType } from './src/components/common/BottomNavigationBar';
import { COLORS } from './src/theme/colors';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      {/* StatusBar color bound to centralized theme color background */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={COLORS.background}
      />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  return (
    <SafeAreaView style={styles.container}>
      {/* Empty clean background content area */}
      <View style={styles.content} />

      {/* Common Reusable Bottom Navigation Bar */}
      <BottomNavigationBar
        currentTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Dynamically bound to theme background (#FFFFFF)
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background, // Dynamically bound to theme background (#FFFFFF)
  },
});

export default App;
