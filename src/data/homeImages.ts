import {ImageSourcePropType} from 'react-native';

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
    cheorwonCold: 'https://picsum.photos/seed/product1/200/200',
    smartFarm: 'https://picsum.photos/seed/product2/200/200',
    seosan: 'https://picsum.photos/seed/product3/200/200',
    hongseong: 'https://picsum.photos/seed/product4/200/200',
  },
  recipes: {
    shrimpPancake: 'https://picsum.photos/seed/recipe1/400/400',
    porkWrap: 'https://picsum.photos/seed/recipe2/400/400',
    bibimbapOne: 'https://picsum.photos/seed/recipe3/400/400',
    bibimbapTwo: 'https://picsum.photos/seed/recipe4/400/400',
  },
  groupBuys: {
    cheorwon: 'https://picsum.photos/seed/veggie1/400/400',
    haenam: 'https://picsum.photos/seed/veggie2/400/400',
    seosan: 'https://picsum.photos/seed/veggie3/400/400',
    yeosu: 'https://picsum.photos/seed/veggie4/400/400',
  },
  ranks: [
    'https://picsum.photos/seed/rank1/300/420',
    'https://picsum.photos/seed/rank2/300/420',
    'https://picsum.photos/seed/rank3/300/420',
  ],
};
