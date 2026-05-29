import 'react-native-gesture-handler';
import { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BottomNavigationBar, { TabType } from './src/components/common/BottomNavigationBar';
import { COLORS } from './src/theme/colors';
import { BabsScreen } from '@/screens/Babs/BabsScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={COLORS.background}
            />
            <AppContent />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// 탭 순환 순서: 좌측 스와이프 시 다음, 우측 스와이프 시 이전 (순환)
const TAB_ORDER: TabType[] = ['babs', 'home', 'cart', 'profile'];

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('babs');

  const isLanding = activeTab === 'babs';

  const goToOffset = (offset: number) => {
    const idx = TAB_ORDER.indexOf(activeTab);
    const next = (idx + offset + TAB_ORDER.length) % TAB_ORDER.length;
    setActiveTab(TAB_ORDER[next]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isLanding ? (
          <BabsScreen
            onSwipeLeft={() => goToOffset(1)}
            onSwipeRight={() => goToOffset(-1)}
          />
        ) : null}
      </View>

      {/* 밥스(랜딩)에서는 하단바 숨김 — 좌우 스와이프로만 이동 가능 */}
      {!isLanding ? (
        <BottomNavigationBar
          currentTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
