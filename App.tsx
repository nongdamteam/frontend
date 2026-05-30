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
import { NongdamLogo } from './src/assets/icons/NongdamLogo';

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
  const [showLanding, setShowLanding] = useState(true);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <StatusBar
                backgroundColor={showLanding ? '#FFFFFF' : COLORS.background}
                barStyle={showLanding ? 'dark-content' : (isDarkMode ? 'light-content' : 'dark-content')}
              />
              {showLanding ? (
                <LandingScreen onFinish={() => setShowLanding(false)} />
              ) : (
                <AppContent />
              )}
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

function LandingScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const containerFade = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(containerFade, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 1400);
    });
  }, [fadeAnim, scaleAnim, containerFade, progress, onFinish]);

  return (
    <Animated.View style={[styles.landingContainer, { opacity: containerFade }]}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center', width: '100%' }}>
        <View style={styles.landingLogoWrapper}>
          <NongdamLogo mode="all" width={200} height={290} />
        </View>
        <Text style={styles.landingSubtitle}>산지와 소비자를 잇는 맛있는 대화</Text>
        <View style={styles.landingProgressBarContainer}>
          <Animated.View
            style={[
              styles.landingProgressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </Animated.View>
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
  landingContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  landingLogoWrapper: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 10,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginBottom: 8,
  },
  landingSubtitle: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  landingProgressBarContainer: {
    width: '45%',
    height: 4,
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
    marginTop: 40,
    overflow: 'hidden',
  },
  landingProgressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});

export default App;
