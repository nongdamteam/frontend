import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FeedItem } from '@/screens/Babs/components/FeedItem';
import { ProductSheet, ProductSheetRef } from '@/screens/ProductSheet/ProductSheet';
import { FEED_MOCK } from '@/assets/mock/feed';
import { MOCK_RECIPES } from '@/screens/RecipeList/RecipeListScreen';
import { HomeStackParamList } from '@/screens/HomeScreen';

export function RecipeDetailScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, 'RecipeDetail'>>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<ProductSheetRef>(null);
  const { recipeId } = route.params;

  // 1. Find from FEED_MOCK first
  let feedItem = FEED_MOCK.find(f => f.id === recipeId);

  // 2. If not found in Babs feeds, check RecipeList MOCK_RECIPES
  if (!feedItem) {
    const recipe = MOCK_RECIPES.find(r => r.id === recipeId);
    if (recipe) {
      // Map to FeedItem format
      feedItem = {
        id: recipe.id,
        type: 'image',
        mediaUrl: recipe.image,
        authorName: recipe.author.nickname,
        caption: recipe.title,
        likeCount: recipe.likes,
        commentCount: Math.floor(recipe.likes / 4),
        tags: recipe.tags.map((tag, idx) => ({
          id: `${recipe.id}-tag-${idx}`,
          keyword: tag.replace('#', '').trim(),
          label: tag.replace('#', '').trim(),
          averagePrice: 2000 + idx * 500,
          thumbnailUrl: require('@/assets/images/tags/bomdong.png'),
          x: 0.3 + idx * 0.2,
          y: 0.5 + idx * 0.1,
        })),
      };
    }
  }

  const handleTagPress = useCallback((tag: any) => {
    sheetRef.current?.open(tag.keyword);
  }, []);

  if (!feedItem) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#FFFFFF' }}>레시피 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backButton, { top: insets.top + 10 }]}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <FeedItem
        item={feedItem}
        isActive={true}
        onTagPress={handleTagPress}
      />

      <ProductSheet ref={sheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecipeDetailScreen;
