import { FeedItem } from '@/@types/feed';

/**
 * 피드 목업 데이터.
 * 로컬 이미지는 require()로 불러와 mediaUrl에 number 형태로 들어간다.
 */
export const FEED_MOCK: FeedItem[] = [
  {
    id: 'feed-001',
    type: 'image',
    mediaUrl: require('@/assets/images/feed/bomdong_bibimbap.png'),
    authorName: '철원농부 김씨',
    caption: '올봄 첫 봄동 비빔밥 🌱',
    likeCount: 1240,
    commentCount: 87,
    tags: [
      {
        id: 'tag-001-1',
        keyword: '봄동',
        label: '봄동 300g',
        averagePrice: 1000,
        thumbnailUrl: 'https://picsum.photos/seed/bomdong-thumb/80/80',
        x: 0.78,
        y: 0.28,
      },
      {
        id: 'tag-001-2',
        keyword: '참기름',
        label: '참기름',
        averagePrice: 10000,
        thumbnailUrl: 'https://picsum.photos/seed/sesame/80/80',
        x: 0.18,
        y: 0.5,
      },
      {
        id: 'tag-001-3',
        keyword: '고추장',
        label: '고추장',
        averagePrice: 10000,
        thumbnailUrl: 'https://picsum.photos/seed/gochujang/80/80',
        x: 0.6,
        y: 0.74,
      },
    ],
  },
  {
    id: 'feed-002',
    type: 'image',
    mediaUrl: require('@/assets/images/feed/naengi_doenjang_guk.png'),
    authorName: '충남 서산 농장',
    caption: '냉이된장국 한 그릇',
    likeCount: 892,
    commentCount: 41,
    tags: [
      {
        id: 'tag-002-1',
        keyword: '냉이',
        label: '냉이 200g',
        averagePrice: 3500,
        thumbnailUrl: 'https://picsum.photos/seed/naengi/80/80',
        x: 0.5,
        y: 0.4,
      },
      {
        id: 'tag-002-2',
        keyword: '된장',
        label: '전통 된장',
        averagePrice: 12000,
        thumbnailUrl: 'https://picsum.photos/seed/doenjang/80/80',
        x: 0.3,
        y: 0.7,
      },
    ],
  },
  {
    id: 'feed-003',
    type: 'image',
    mediaUrl: require('@/assets/images/feed/eco_vegetables.png'),
    authorName: '유기농 스마트팜',
    caption: '오늘 수확한 친환경 채소',
    likeCount: 530,
    commentCount: 22,
    tags: [
      {
        id: 'tag-003-1',
        keyword: '상추',
        label: '상추 한 봉',
        averagePrice: 2500,
        thumbnailUrl: 'https://picsum.photos/seed/lettuce/80/80',
        x: 0.65,
        y: 0.35,
      },
    ],
  },
];
