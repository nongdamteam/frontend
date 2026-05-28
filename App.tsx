import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, View, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import BottomNavigationBar, {
  TabType,
} from './src/components/common/BottomNavigationBar';
import HomeScreen from './src/screens/HomeScreen';
import {COLORS} from './src/theme/colors';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderTabContent(activeTab)}</View>
      <BottomNavigationBar currentTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

function renderTabContent(activeTab: TabType) {
  if (activeTab === 'home') {
    return <HomeScreen />;
  }

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>준비 중입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    color: COLORS.inactive,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default App;
