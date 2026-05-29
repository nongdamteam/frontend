import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackHeader from '@/components/common/BackHeader';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/theme/colors'; // 기존 프로젝트에 설정된 색상 테마 사용 (없으면 기본값 폴백)

// 레시피 아이템 인터페이스
interface RecipeItem {
  id: string;
  title: string;
  image: string;
  aspectRatio: number; // 가변 높이를 연출하기 위한 종횡비
  author: {
    nickname: string;
    avatar: string;
  };
  likes: number;
  tags: string[];
}

// 풍성한 핀터레스트 레시피 피드용 목업 데이터
const MOCK_RECIPES: RecipeItem[] = [
  {
    id: 'r1',
    title: '새콤달콤 밥도둑 봄동겉절이',
    image: 'https://picsum.photos/seed/recipe1/400/500',
    aspectRatio: 0.8, // 400x500
    author: {
      nickname: 'najeongwhan',
      avatar: 'https://picsum.photos/seed/user1/100/100',
    },
    likes: 18,
    tags: ['#봄동', '#겉절이', '#초간단'],
  },
  {
    id: 'r2',
    title: '바삭바삭 봄동전 만들기 꿀팁',
    image: 'https://picsum.photos/seed/recipe2/400/300',
    aspectRatio: 1.33, // 400x300
    author: {
      nickname: 'dong__415',
      avatar: 'https://picsum.photos/seed/user2/100/100',
    },
    likes: 22,
    tags: ['#봄동전', '#바삭함', '#막걸리안주'],
  },
  {
    id: 'r3',
    title: '구수하고 달큰한 백종원 봄동된장국',
    image: 'https://picsum.photos/seed/recipe3/400/400',
    aspectRatio: 1.0, // 400x400
    author: {
      nickname: 'ddanggong',
      avatar: 'https://picsum.photos/seed/user3/100/100',
    },
    likes: 24,
    tags: ['#봄동국', '#해장국', '#집밥백선생'],
  },
  {
    id: 'r4',
    title: '나른한 봄날을 깨우는 봄동 샐러드',
    image: 'https://picsum.photos/seed/recipe4/400/550',
    aspectRatio: 0.72, // 400x550
    author: {
      nickname: 'yejida',
      avatar: 'https://picsum.photos/seed/user4/100/100',
    },
    likes: 35,
    tags: ['#샐러드', '#다이어트', '#상큼'],
  },
  {
    id: 'r5',
    title: '아삭함이 살아있는 봄동 달래 비빔밥',
    image: 'https://picsum.photos/seed/recipe5/400/450',
    aspectRatio: 0.89, // 400x450
    author: {
      nickname: 'cooking_mama',
      avatar: 'https://picsum.photos/seed/user5/100/100',
    },
    likes: 42,
    tags: ['#비빔밥', '#달래', '#봄철밥상'],
  },
  {
    id: 'r6',
    title: '봄나물 한가득! 봄동 냉이 샤브샤브',
    image: 'https://picsum.photos/seed/recipe6/400/320',
    aspectRatio: 1.25, // 400x320
    author: {
      nickname: 'healthy_green',
      avatar: 'https://picsum.photos/seed/user6/100/100',
    },
    likes: 29,
    tags: ['#샤브샤브', '#냉이', '#건강식'],
  },
  {
    id: 'r7',
    title: '봄동과 찰떡궁합 대패삼겹살 봄동쌈',
    image: 'https://picsum.photos/seed/recipe7/400/520',
    aspectRatio: 0.77, // 400x520
    author: {
      nickname: 'meat_lover',
      avatar: 'https://picsum.photos/seed/user7/100/100',
    },
    likes: 56,
    tags: ['#대패삼겹살', '#봄동쌈', '#고기파티'],
  },
  {
    id: 'r8',
    title: '봄동 쌈장 무침 반찬 만들기',
    image: 'https://picsum.photos/seed/recipe8/400/380',
    aspectRatio: 1.05, // 400x380
    author: {
      nickname: 'side_dish_king',
      avatar: 'https://picsum.photos/seed/user8/100/100',
    },
    likes: 15,
    tags: ['#밑반찬', '#쌈장무침', '#초스피드'],
  },
];

export function RecipeListScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // 좋아요 인터랙션을 위한 개별 상태 관리
  const [likesData, setLikesData] = useState<Record<string, { count: number; liked: boolean }>>(
    MOCK_RECIPES.reduce((acc, item) => {
      acc[item.id] = { count: item.likes, liked: false };
      return acc;
    }, {} as Record<string, { count: number; liked: boolean }>)
  );

  const handleLikePress = (id: string) => {
    setLikesData((prev) => {
      const current = prev[id];
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
    });
  };

  // 핀터레스트 2열 Masonry 구현을 위해 데이터를 홀수/짝수 인덱스로 분할
  const leftCol = MOCK_RECIPES.filter((_, idx) => idx % 2 === 0);
  const rightCol = MOCK_RECIPES.filter((_, idx) => idx % 2 === 1);

  // 카드 아이템 렌더링 헬퍼
  const renderCard = (item: RecipeItem) => {
    const likeInfo = likesData[item.id] || { count: item.likes, liked: false };

    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={[styles.cardImage, { aspectRatio: item.aspectRatio }]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.tagContainer}>
            {item.tags.slice(0, 2).map((tag, tIdx) => (
              <Text key={`${item.id}-tag-${tIdx}`} style={styles.tagText}>
                {tag}
              </Text>
            ))}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.cardFooter}>
            <View style={styles.authorContainer}>
              <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
              <Text style={styles.nickname} numberOfLines={1}>
                {item.author.nickname}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleLikePress(item.id)}
              style={styles.likeButton}
            >
              <Text style={[styles.likeHeart, likeInfo.liked && styles.likedHeart]}>
                {likeInfo.liked ? '❤️' : '🤍'}
              </Text>
              <Text style={[styles.likeCount, likeInfo.liked && styles.likedCount]}>
                {likeInfo.count}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader title="추천 레시피 피드" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.feedSubtitle}>신선한 봄동으로 만드는 다채로운 식탁 🌱</Text>
        
        {/* 2열 Masonry Grid 레이아웃 */}
        <View style={styles.gridContainer}>
          <View style={styles.column}>
            {leftCol.map(renderCard)}
          </View>
          <View style={styles.column}>
            {rightCol.map(renderCard)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // 세련된 매트 화이트 배경
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F3F5',
  },
  backArrow: {
    fontSize: 20,
    color: '#343A40',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#212529',
    letterSpacing: -0.5,
  },
  headerPlaceholder: {
    width: 36,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  feedSubtitle: {
    fontSize: 14,
    color: '#868E96',
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 6,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    // 소프트 섀도우 효과로 세련된 볼륨감 제공
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#E9ECEF',
  },
  cardImage: {
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#343A40',
    lineHeight: 18,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS?.primary || '#2F9E44', // 프로젝트의 primary 색상 사용, 기본은 초록
    backgroundColor: '#EBFBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    backgroundColor: '#CED4DA',
  },
  nickname: {
    fontSize: 11,
    color: '#495057',
    fontWeight: '600',
    flex: 1,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likeHeart: {
    fontSize: 11,
    marginRight: 3,
  },
  likedHeart: {},
  likeCount: {
    fontSize: 10,
    color: '#868E96',
    fontWeight: '700',
  },
  likedCount: {
    color: '#E03131',
  },
});

export default RecipeListScreen;
