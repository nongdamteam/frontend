import React from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {homeImages} from '../data/homeImages';
import {colors, radius, shadow, spacing, typography} from '../styles/theme';

import ProductListScreen from '@/screens/ProductList/ProductListScreen';
import ProductDetailScreen from '@/screens/ProductDetail';
import RecipeListScreen from '@/screens/RecipeList/RecipeListScreen';
import {IProduct, SortOption} from '@/screens/ProductList/types';
import {MOCK_PRODUCTS} from '@/screens/ProductList/hooks/useProducts';

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

const products = [
  {
    id: 'cheorwon-cold',
    title: '철원 최고의 냉이 농장에서 자란 봄동',
    badges: ['공구 진행중', '최소 500g', 'GAP 인증'],
    price: '100g당 1,000원',
    discountNote: '5월 전에는 100g당 1,500원이었어요!',
    image: homeImages.products.cheorwonCold,
  },
  {
    id: 'smart-farm',
    title: '유기농 스마트팜 봄동',
    badges: ['공구 진행중', '최소 500g', 'GAP 인증'],
    price: '100g당 1,200원',
    discountNote: '5월 전에는 100g당 1,500원이었어요!',
    image: homeImages.products.smartFarm,
  },
  {
    id: 'seosan',
    title: '충남 서산 봄동',
    badges: ['공구 진행중', '최소 500g'],
    price: '100g당 1,100원',
    discountNote: '5월 전에는 100g당 1,400원이었어요!',
    image: homeImages.products.seosan,
  },
  {
    id: 'hongseong',
    title: '신선한 홍성 봄동',
    badges: ['공구 진행중', '최소 500g'],
    price: '100g당 980원',
    discountNote: '5월 전에는 100g당 1,300원이었어요!',
    image: homeImages.products.hongseong,
  },
];

const recipes: Recipe[] = [
  {
    id: 'shrimp-pancake',
    title: '냉이새우부침',
    image: homeImages.recipes.shrimpPancake,
  },
  {
    id: 'pork-wrap',
    title: '냉이새우보쌈',
    image: homeImages.recipes.porkWrap,
  },
  {
    id: 'bibimbap1',
    title: '봄동비빔밥',
    image: homeImages.recipes.bibimbapOne,
  },
  {
    id: 'bibimbap2',
    title: '봄동비빔밥',
    image: homeImages.recipes.bibimbapTwo,
  },
];

const groupBuys: GroupBuyItem[] = [
  {
    id: 'cheorwon',
    title: '철원 냉이',
    time: '08:10:02 남음',
    image: homeImages.groupBuys.cheorwon,
  },
  {
    id: 'haenam',
    title: '해남 봄동',
    time: '08:10:02 남음',
    image: homeImages.groupBuys.haenam,
  },
  {
    id: 'seosan-cold',
    title: '서산 냉이',
    time: '08:10:02 남음',
    image: homeImages.groupBuys.seosan,
  },
  {
    id: 'yeosu',
    title: '여수 방풍나물',
    time: '08:10:02 남음',
    image: homeImages.groupBuys.yeosu,
  },
];

function imageSource(image: ImageSourcePropType | string) {
  return typeof image === 'string' ? {uri: image} : image;
}

export type HomeStackParamList = {
  HomeMain: undefined;
  ProductList: { isGroupPurchaseOnly?: boolean; searchQuery?: string; initialSortOption?: SortOption; isPopularRanking?: boolean } | undefined;
  Details: { product: IProduct; entryPoint?: 'home' | 'list' };
  RecipeList: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const getMockProductById = (id: string): IProduct => {
  const idMap: Record<string, string> = {
    'cheorwon-cold': '1',
    'smart-farm': '2',
    'seosan': '3',
    'hongseong': '4',
    'cheorwon': '1',
    'haenam': '5',
    'seosan-cold': '3',
    'yeosu': '6',
  };

  const targetId = idMap[id] || '1';
  const found = MOCK_PRODUCTS.find((p) => p.id === targetId);
  return found || MOCK_PRODUCTS[0];
};

function HomeScreen() {
  return (
    <Stack.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={MainHomeScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="Details" component={ProductDetailScreen} />
      <Stack.Screen name="RecipeList" component={RecipeListScreen} />
    </Stack.Navigator>
  );
}

function MainHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const handleProductPress = (productId: string) => {
    const product = getMockProductById(productId);
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

  const handleGroupItemPress = (title: string) => {
    let query = '';
    if (title.includes('냉이')) {
      query = '냉이';
    } else if (title.includes('봄동')) {
      query = '봄동';
    } else if (title.includes('방풍나물')) {
      query = '방풍나물';
    } else {
      query = title;
    }
    navigation.navigate('ProductList', { isGroupPurchaseOnly: true, searchQuery: query });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.mainLogo}>농담 🌱</Text>

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
            {recipes.map(recipe => (
              <Pressable
                key={recipe.id}
                onPress={handleOpenRecipes}
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
            {groupBuys.slice(0, 3).map(item => (
              <Pressable
                key={item.id}
                onPress={() => handleGroupItemPress(item.title)}
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
                    <Text style={styles.timeBadge}>{item.time}</Text>
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
            {products.slice(0, 3).map((product, index) => (
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
                    source={imageSource(homeImages.ranks[index])}
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

  // Product list screen
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  backText: {
    ...typography.body,
    color: colors.mutedText,
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
