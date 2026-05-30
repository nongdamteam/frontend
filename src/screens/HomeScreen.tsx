import React from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';

import {homeImages} from '../data/homeImages';
import {colors, radius, shadow, spacing, typography} from '../styles/theme';

import ProductListScreen from '@/screens/ProductList/ProductListScreen';
import ProductDetailScreen from '@/screens/ProductDetail';
import RecipeListScreen from '@/screens/RecipeList/RecipeListScreen';
import {IProduct, SortOption} from '@/screens/ProductList/types';
import {MOCK_PRODUCTS} from '@/screens/ProductList/hooks/useProducts';
import { navigationService } from '@/services/navigationService';
import { MOCK_RECIPES } from './RecipeList/RecipeListScreen';
import RecipeDetailScreen from '@/screens/RecipeDetail/RecipeDetailScreen';
import { NongdamLogo } from '@/assets/icons/NongdamLogo';

type ScreenMode = 'main' | 'products';

type Recipe = {
  id: string;
  image: ImageSourcePropType | string;
  title: string;
};

type GroupBuyItem = {
  id: string;
  image: ImageSourcePropType | string;
  title: string;
  time: string;
};

// 기존의 하드코딩된 groupBuys 배열 제거 (MOCK_PRODUCTS 연동으로 대체)



// 기존의 하드코딩된 groupBuys 배열 제거 (MOCK_PRODUCTS 연동으로 대체)

function imageSource(image: ImageSourcePropType | string) {
  return typeof image === 'string' ? {uri: image} : image;
}

export type HomeStackParamList = {
  HomeMain: undefined;
  ProductList: { isGroupPurchaseOnly?: boolean; searchQuery?: string; initialSortOption?: SortOption; isPopularRanking?: boolean } | undefined;
  Details: { product: IProduct; entryPoint?: 'home' | 'list' };
  RecipeList: undefined;
  RecipeDetail: { recipeId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const getMockProductById = (id: string): IProduct => {
  const idMap: Record<string, string> = {
    'cheorwon-cold': '7',
    'smart-farm': '2',
    'yeosu': '6',
    'seosan-cold': '10',
    'seosan': '3',
    'hongseong': '4',
    'cheorwon': '7',
    'haenam': '5',
  };

  const targetId = idMap[id] || '1';
  const found = MOCK_PRODUCTS.find((p) => p.id === targetId);
  return found || MOCK_PRODUCTS[0];
};

interface HomeScreenProps {
  onSwipeProgress?: (translationX: number) => void;
  onSwipeEnd?: (translationX: number, velocityX: number) => void;
}

function HomeScreen({ onSwipeProgress, onSwipeEnd }: HomeScreenProps) {
  return (
    <Stack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain">
        {props => (
          <MainHomeScreen
            {...props}
            onSwipeProgress={onSwipeProgress}
            onSwipeEnd={onSwipeEnd}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="Details" component={ProductDetailScreen} />
      <Stack.Screen name="RecipeList" component={RecipeListScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

interface MainHomeScreenProps {
  onSwipeProgress?: (translationX: number) => void;
  onSwipeEnd?: (translationX: number, velocityX: number) => void;
}

function MainHomeScreen({ onSwipeProgress, onSwipeEnd }: MainHomeScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    navigationService.registerScrollToTop('home', () => {
      if (navigation.canGoBack()) {
        navigation.popToTop();
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }, 100);
      } else {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    });
    return () => {
      navigationService.unregisterScrollToTop('home');
    };
  }, [navigation]);

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([20, 99999])
    .failOffsetY([-8, 8])
    .onUpdate(event => {
      'worklet';
      if (onSwipeProgress) {
        runOnJS(onSwipeProgress)(event.translationX);
      }
    })
    .onFinalize(event => {
      'worklet';
      if (onSwipeEnd) {
        runOnJS(onSwipeEnd)(event.translationX, event.velocityX);
      }
    });

  const handleProductPress = (productId: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId) || getMockProductById(productId);
    navigation.navigate('Details', { product, entryPoint: 'home' });
  };

  const handleOpenProducts = () => {
    navigation.navigate('ProductList');
  };

  const handleOpenRecipes = () => {
    navigation.navigate('RecipeList');
  };

  const handleOpenPopularProducts = () => {
    navigation.navigate('ProductList', { initialSortOption: 'participants', isPopularRanking: true });
  };

  const handleOpenGroupPurchase = () => {
    navigation.navigate('ProductList', { isGroupPurchaseOnly: true });
  };

  const homeGroupBuys = React.useMemo(() => {
    return MOCK_PRODUCTS
      .filter((p) => p.isGroupPurchase && p.timeRemaining !== undefined)
      .sort((a, b) => {
        const aSec = a.timeInSeconds ?? 999999;
        const bSec = b.timeInSeconds ?? 999999;
        return aSec - bSec;
      })
      .slice(0, 3);
  }, []);

  const homePopularProducts = React.useMemo(() => {
    return [...MOCK_PRODUCTS]
      .sort((a, b) => b.participantsCount - a.participantsCount)
      .slice(0, 3);
  }, []);

  const handleGroupItemPress = (productId: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId) || getMockProductById(productId);
    navigation.navigate('Details', { product, entryPoint: 'home' });
  };

  return (
    <GestureDetector gesture={swipeGesture}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerLogoWrapper}>
            <NongdamLogo mode="horizontal" height={40} />
          </View>

          <Pressable
            onPress={handleOpenProducts}
            style={({pressed}) => [styles.heroWrapper, pressed && styles.pressed]}>
            <ImageBackground
              imageStyle={styles.heroImageStyle}
              resizeMode="cover"
              source={imageSource(homeImages.hero)}
              style={styles.hero}>
              <View style={styles.heroOverlay}>
                <View style={styles.heroTopRow}>
                  <Text style={styles.heroEyebrow}>오늘 마감 공구</Text>
                </View>
                <View style={styles.heroSpacer} />
                <Text style={styles.heroText}>강호동이 먹었던 그 봄동!</Text>
                <Text style={styles.heroSubText}>공구 진행중</Text>
                <View style={styles.heroDots}>
                  <View style={[styles.heroDot, styles.activeHeroDot]} />
                  <View style={styles.heroDot} />
                  <View style={styles.heroDot} />
                  <View style={styles.heroDot} />
                </View>
              </View>
            </ImageBackground>
          </Pressable>

          <HomeSection onViewAll={handleOpenRecipes} title="이런 레시피 어때요?">
            <View style={styles.tileGrid}>
              {MOCK_RECIPES.slice(0, 4).map(recipe => (
                <Pressable
                  key={recipe.id}
                  onPress={() => {
                    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
                  }}
                  style={({pressed}) => [
                    styles.tileItem,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.tileImageWrapper}>
                    <Image
                      resizeMode="cover"
                      source={imageSource(recipe.image)}
                      style={styles.tileImage}
                    />
                  </View>
                  <Text numberOfLines={1} style={styles.tileTitle}>
                    {recipe.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </HomeSection>

          <HomeSection onViewAll={handleOpenGroupPurchase} title="오늘의 공구">
            <View style={styles.tileGridThree}>
              {homeGroupBuys.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => handleGroupItemPress(item.id)}
                  style={({pressed}) => [
                    styles.tileItemThree,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.tileImageWrapperLarge}>
                    <Image
                      resizeMode="cover"
                      source={imageSource(item.image)}
                      style={styles.tileImage}
                    />
                    <View style={styles.timeBadgeWrapper}>
                      <Text style={styles.timeBadge}>{item.timeRemaining}</Text>
                    </View>
                  </View>
                  <Text numberOfLines={1} style={styles.tileTitle}>
                    {item.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </HomeSection>

          <HomeSection onViewAll={handleOpenPopularProducts} title="사람들이 많이 찾는 상품">
            <View style={styles.rankGrid}>
              {homePopularProducts.map((product, index) => (
                <Pressable
                  key={product.id}
                  onPress={() => handleProductPress(product.id)}
                  style={({pressed}) => [
                    styles.rankItem,
                    pressed && styles.pressed,
                  ]}>
                  <View style={styles.rankImageWrapper}>
                    <Image
                      resizeMode="cover"
                      source={imageSource(product.image)}
                      style={styles.rankImage}
                    />
                    <View style={styles.rankBadgeWrapper}>
                      <Text style={styles.rankBadge}>{index + 1}</Text>
                    </View>
                  </View>
                  <Text numberOfLines={2} style={styles.rankTitle}>
                    {product.title}
                  </Text>
                </Pressable>
              ))}
            </View>
          </HomeSection>
        </ScrollView>
      </SafeAreaView>
    </GestureDetector>
  );
}

function HomeSection({
  children,
  onViewAll,
  title,
}: {
  children: React.ReactNode;
  onViewAll?: () => void;
  title: string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text style={styles.viewAllText}>전체보기</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  mainLogo: {
    ...typography.brand,
    marginBottom: spacing.xl,
  },
  headerLogoWrapper: {
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
  },

  // Hero
  heroWrapper: {
    ...shadow.soft,
    borderRadius: 20,
    marginBottom: spacing.xl,
  },
  hero: {
    aspectRatio: 1.6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImageStyle: {
    borderRadius: 20,
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    flex: 1,
    padding: spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heroSpacer: {
    flex: 1,
  },
  heroEyebrow: {
    ...typography.caption,
    backgroundColor: colors.badge,
    borderRadius: radius.xs,
    color: colors.text,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  heroText: {
    ...typography.headline,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
    textAlign: 'right',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {height: 1, width: 0},
    textShadowRadius: 6,
  },
  heroSubText: {
    ...typography.title,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'right',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: {height: 1, width: 0},
    textShadowRadius: 4,
  },
  heroDots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: spacing.sm,
  },
  heroDot: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 4,
    height: 6,
    width: 6,
  },
  activeHeroDot: {
    backgroundColor: '#FFFFFF',
    width: 18,
  },

  // Section
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title,
    fontWeight: '800',
  },
  viewAllText: {
    ...typography.caption,
    color: colors.mutedText,
  },

  // Shared tile grid (recipes + group buys)
  tileGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  // Three-up larger tiles for group buys
  tileGridThree: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tileItemThree: {
    flex: 1,
    minWidth: 0,
  },
  tileImageWrapperLarge: {
    aspectRatio: 0.92,
    borderRadius: 14,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  tileItem: {
    flex: 1,
    minWidth: 0,
  },
  tileImageWrapper: {
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  tileImage: {
    height: '100%',
    width: '100%',
  },
  tileTitle: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Timer badge (group buy overlay)
  timeBadgeWrapper: {
    right: spacing.sm,
    position: 'absolute',
    top: spacing.sm,
  },
  timeBadge: {
    ...typography.badge,
    backgroundColor: colors.timerBadge,
    borderRadius: radius.xs,
    overflow: 'hidden',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },

  // Rank grid
  rankGrid: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  rankItem: {
    flex: 1,
    minWidth: 0,
  },
  rankImageWrapper: {
    aspectRatio: 0.72,
    borderRadius: 12,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  rankImage: {
    height: '100%',
    width: '100%',
  },
  rankBadgeWrapper: {
    left: spacing.sm,
    position: 'absolute',
    top: spacing.sm,
  },
  rankBadge: {
    ...typography.badge,
    backgroundColor: colors.badge,
    borderRadius: 14,
    height: 28,
    lineHeight: 28,
    overflow: 'hidden',
    textAlign: 'center',
    width: 28,
  },
  rankTitle: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Shared
  pressed: {
    opacity: 0.78,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  brand: {
    ...typography.brand,
  },
  listMeta: {
    marginBottom: spacing.md,
  },
  listCount: {
    ...typography.caption,
    color: colors.mutedText,
  },
  list: {
    gap: spacing.lg,
  },
});

export default HomeScreen;
