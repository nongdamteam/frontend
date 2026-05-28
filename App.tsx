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

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      {/* Screen background is strictly white (#FFFFFF) */}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#FFFFFF" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  return (
    <SafeAreaView style={styles.container}>
      {/* Empty pure white content area */}
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
