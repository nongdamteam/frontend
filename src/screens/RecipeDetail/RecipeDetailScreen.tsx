import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import BackButton from '@/components/common/BackButton';
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
        tags: recipe.tags.map((tag, idx) => {
          const kw = tag.replace('#', '').trim();
          let thumbnailUrl: any = undefined;

          if (kw.includes('봄동') || kw.includes('겉절이')) {
            thumbnailUrl = require('@/assets/images/tags/bomdong.png');
          } else if (kw.includes('참기름')) {
            thumbnailUrl = require('@/assets/images/tags/chamgireum.png');
          } else if (kw.includes('고추장')) {
            thumbnailUrl = require('@/assets/images/tags/gochujang.png');
          } else if (kw.includes('냉이')) {
            thumbnailUrl = require('@/assets/images/tags/naengi.png');
          } else if (kw.includes('된장')) {
            thumbnailUrl = require('@/assets/images/tags/doenjang.png');
          } else if (kw.includes('상추')) {
            thumbnailUrl = require('@/assets/images/tags/sangchu.png');
          }

          return {
            id: `${recipe.id}-tag-${idx}`,
            keyword: kw,
            label: kw,
            averagePrice: 2000 + idx * 500,
            thumbnailUrl,
            x: 0.3 + idx * 0.2,
            y: 0.5 + idx * 0.1,
          };
        }),
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
      <View style={[styles.backButtonWrapper, { top: insets.top + 10 }]}>
        <BackButton onPress={() => navigation.goBack()} color="#FFFFFF" />
      </View>

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
  backButtonWrapper: {
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
  center: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecipeDetailScreen;
