import 'react-native-gesture-handler';
import React, { useRef, useState, useEffect } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import OtherTabs from './src/screens/OtherTabs';
import { BabsScreen } from './src/screens/Babs/BabsScreen';
import { COLORS } from './src/theme/colors';
import { SCREEN } from './src/constants/layout';
import { TabType } from './src/components/common/BottomNavigationBar';
import { navigationService } from './src/services/navigationService';

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
            <NavigationContainer>
              <StatusBar
                backgroundColor={COLORS.background}
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <AppContent />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('babs');
  const [lastOtherTab, setLastOtherTab] = useState<TabType>('home');
  const [transition, setTransition] = useState<{
    from: TabType;
    to: TabType;
    direction: number;
  } | null>(null);
  const [dragTransition, setDragTransition] = useState<{
    from: TabType;
    to: TabType;
    direction: number;
  } | null>(null);
  const dragTransitionRef = useRef<{
    from: TabType;
    to: TabType;
    direction: number;
  } | null>(null);
  const translateBabs = useRef(new Animated.Value(0)).current;
  const translateOther = useRef(new Animated.Value(SCREEN.width)).current;
  const SWIPE_DISTANCE_THRESHOLD = SCREEN.width * 0.4;
  const SWIPE_VELOCITY_THRESHOLD = -750;
  const OTHER_SWIPE_DISTANCE_THRESHOLD = SCREEN.width * 0.25;
  const OTHER_SWIPE_VELOCITY_THRESHOLD = 750;

  const changeTab = React.useCallback((nextTab: TabType) => {
    if (nextTab === activeTab || transition) {
      if (nextTab === activeTab && !transition) {
        navigationService.scrollToTop(nextTab);
      }
      return;
    }

    if (nextTab === 'babs') {
      setTransition({ from: activeTab, to: nextTab, direction: -1 });
      Animated.parallel([
        Animated.timing(translateBabs, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateOther, {
          toValue: SCREEN.width,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveTab(nextTab);
        setTransition(null);
        setDragTransition(null);
      });
    } else if (activeTab === 'babs') {
      setLastOtherTab(nextTab);
      setTransition({ from: activeTab, to: nextTab, direction: 1 });
      Animated.parallel([
        Animated.timing(translateBabs, {
          toValue: -SCREEN.width,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateOther, {
          toValue: 0,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveTab(nextTab);
        setTransition(null);
        setDragTransition(null);
      });
    } else {
      setLastOtherTab(nextTab);
      setActiveTab(nextTab);
    }
  }, [activeTab, transition, translateBabs, translateOther]);

  useEffect(() => {
    navigationService.setRedirectTabCallback((tab) => {
      changeTab(tab);
    });
  }, [changeTab]);

  const goToOffset = (offset: number) => {
    const idx = TAB_ORDER.indexOf(activeTab);
    const next = (idx + offset + TAB_ORDER.length) % TAB_ORDER.length;
    changeTab(TAB_ORDER[next]);
  };

  const handleSwipeProgress = (translationX: number) => {
    if (transition || activeTab !== 'babs') return;

    if (translationX >= 0) {
      if (dragTransition) {
        translateBabs.setValue(0);
        translateOther.setValue(SCREEN.width);
        setDragTransition(null);
        dragTransitionRef.current = null;
      }
      return;
    }

    if (!dragTransition) {
      const nextTransition = { from: activeTab, to: 'home' as TabType, direction: 1 };
      setDragTransition(nextTransition);
      dragTransitionRef.current = nextTransition;
      translateBabs.setValue(0);
      translateOther.setValue(SCREEN.width);
    }

    translateBabs.setValue(translationX);
    translateOther.setValue(SCREEN.width + translationX);
  };

  const handleOtherSwipeProgress = (translationX: number) => {
    if (transition || activeTab === 'babs') return;
    if (translationX <= 0) {
      if (dragTransition) {
        translateBabs.setValue(-SCREEN.width);
        translateOther.setValue(0);
        setDragTransition(null);
        dragTransitionRef.current = null;
      }
      return;
    }

    if (!dragTransition) {
      const nextTransition = { from: activeTab, to: 'babs' as TabType, direction: -1 };
      setDragTransition(nextTransition);
      dragTransitionRef.current = nextTransition;
      translateBabs.setValue(-SCREEN.width);
      translateOther.setValue(0);
    }

    translateBabs.setValue(-SCREEN.width + translationX);
    translateOther.setValue(translationX);
  };

  const handleOtherSwipeEnd = (translationX: number, velocityX: number) => {
    const currentDragTransition = dragTransitionRef.current;
    if (!currentDragTransition) return;

    const shouldComplete = translationX > OTHER_SWIPE_DISTANCE_THRESHOLD || velocityX > OTHER_SWIPE_VELOCITY_THRESHOLD;
    if (shouldComplete) {
      setTransition(currentDragTransition);
      Animated.parallel([
        Animated.spring(translateBabs, {
          toValue: 0,
          friction: 11,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.spring(translateOther, {
          toValue: SCREEN.width,
          friction: 11,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveTab('babs');
        setTransition(null);
        setDragTransition(null);
        dragTransitionRef.current = null;
      });
      return;
    }

    Animated.parallel([
      Animated.spring(translateBabs, {
        toValue: -SCREEN.width,
        friction: 12,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateOther, {
        toValue: 0,
        friction: 12,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDragTransition(null);
      dragTransitionRef.current = null;
      translateBabs.setValue(-SCREEN.width);
      translateOther.setValue(0);
    });
  };

  const handleSwipeEnd = (translationX: number, velocityX: number) => {
    const currentDragTransition = dragTransitionRef.current;
    if (!currentDragTransition) return;

    const shouldComplete = translationX < -SWIPE_DISTANCE_THRESHOLD || velocityX < SWIPE_VELOCITY_THRESHOLD;
    if (shouldComplete) {
      setTransition(currentDragTransition);
      Animated.parallel([
        Animated.spring(translateBabs, {
          toValue: -SCREEN.width,
          friction: 11,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.spring(translateOther, {
          toValue: 0,
          friction: 11,
          tension: 120,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActiveTab('home');
        setLastOtherTab('home');
        setTransition(null);
        setDragTransition(null);
        dragTransitionRef.current = null;
      });
      return;
    }

    Animated.parallel([
      Animated.spring(translateBabs, {
        toValue: 0,
        friction: 12,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateOther, {
        toValue: SCREEN.width,
        friction: 12,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDragTransition(null);
      dragTransitionRef.current = null;
      translateBabs.setValue(0);
      translateOther.setValue(SCREEN.width);
    });
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.animatedScreen,
            { transform: [{ translateX: translateBabs }] },
          ]}
        >
          <BabsScreen
            onSwipeLeft={() => goToOffset(1)}
            onSwipeRight={() => goToOffset(-1)}
            onSwipeProgress={handleSwipeProgress}
            onSwipeEnd={handleSwipeEnd}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedScreen,
            { transform: [{ translateX: translateOther }] },
          ]}
        >
          <OtherTabs
            currentTab={activeTab === 'babs' ? lastOtherTab : activeTab}
            onTabChange={changeTab}
            onSwipeProgress={handleOtherSwipeProgress}
            onSwipeEnd={handleOtherSwipeEnd}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}
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
  animatedScreen: {
    ...StyleSheet.absoluteFill,
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
