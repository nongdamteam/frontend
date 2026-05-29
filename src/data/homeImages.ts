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
    cheorwonCold: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=500&auto=format&fit=crop&q=80',
    smartFarm: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80',
    seosan: 'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=500&auto=format&fit=crop&q=80',
    hongseong: 'https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=500&auto=format&fit=crop&q=80',
  },
  recipes: {
    shrimpPancake: 'https://images.unsplash.com/photo-1669145024329-9e0c27e049d7?w=500&auto=format&fit=crop&q=80',
    porkWrap: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&auto=format&fit=crop&q=80',
    bibimbapOne: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=80',
    bibimbapTwo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80',
  },
  groupBuys: {
    cheorwon: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=500&auto=format&fit=crop&q=80',
    haenam: 'https://images.unsplash.com/photo-1550147760-44c9966d6bc7?w=500&auto=format&fit=crop&q=80',
    seosan: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80',
    yeosu: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=80',
  },
  ranks: [
    'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1604085792782-8d92f276d7d8?w=500&auto=format&fit=crop&q=80',
  ],
};
