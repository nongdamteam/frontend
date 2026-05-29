import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BottomNavigationBar, { TabType } from './src/components/common/BottomNavigationBar';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import { BabsScreen } from '@/screens/Babs/BabsScreen';
import { COLORS } from './src/theme/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const TAB_ORDER: TabType[] = ['babs', 'home', 'cart', 'profile'];

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <StatusBar
              backgroundColor={COLORS.background}
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <AppContent />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('babs');
  const isLanding = activeTab === 'babs';

  const goToOffset = (offset: number) => {
    const idx = TAB_ORDER.indexOf(activeTab);
    const next = (idx + offset + TAB_ORDER.length) % TAB_ORDER.length;
    setActiveTab(TAB_ORDER[next]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isLanding ? (
          <BabsScreen
            onSwipeLeft={() => goToOffset(1)}
            onSwipeRight={() => goToOffset(-1)}
          />
        ) : (
          renderTabContent(activeTab)
        )}
      </View>

      {!isLanding && (
        <BottomNavigationBar currentTab={activeTab} onTabChange={setActiveTab} />
      )}
    </View>
  );
}

function renderTabContent(activeTab: TabType) {
  if (activeTab === 'home') {
    return <HomeScreen />;
  }

  if (activeTab === 'cart') {
    return <CartScreen />;
  }

  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>준비 중입니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  content: {
    flex: 1,
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

export default App;
