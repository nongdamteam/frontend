import { ImageSourcePropType } from 'react-native';

type HomeImages = {
  groupBuys: Record<string, ImageSourcePropType | string>;
  hero: ImageSourcePropType | string;
  products: Record<string, ImageSourcePropType | string>;
  ranks: Array<ImageSourcePropType | string>;
  recipes: Record<string, ImageSourcePropType | string>;
};

export const homeImages: HomeImages = {
  hero: require('../assets/images/hero-main.png'),
  products: {
    cheorwonCold: require('../assets/images/products/prod_naengi_1.png'),
    smartFarm: require('../assets/images/products/prod_002.png'),
    seosan: require('../assets/images/products/prod_naengi_2.png'),
    hongseong: require('../assets/images/products/prod_004.png'),
    yeosu: require('../assets/images/products/prod_bangpung_1.png'),
  },
  recipes: {
    shrimpPancake: 'https://images.unsplash.com/photo-1669145024329-9e0c27e049d7?w=500&auto=format&fit=crop&q=80',
    porkWrap: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&auto=format&fit=crop&q=80',
    bibimbapOne: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80',
    bibimbapTwo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
  },
  groupBuys: {
    cheorwon: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=500&auto=format&fit=crop&q=80',
    haenam: require('../assets/images/bomdong_fresh.png'),
    seosan: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
    yeosu: 'https://images.unsplash.com/photo-1508747703725-719ae25db29f?w=500&auto=format&fit=crop&q=80',
  },
  ranks: [
    require('../assets/images/products/prod_001.png'),
    require('../assets/images/products/prod_002.png'),
    require('../assets/images/products/prod_003.png'),
  ],
};
