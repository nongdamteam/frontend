import { ImageSourcePropType } from 'react-native';

type CartImages = {
  products: Record<string, ImageSourcePropType | string>;
};

export const cartImages: CartImages = {
  products: {
    nei: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=200&h=200', // 냉이
    rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200&h=200', // 쌀
    mushroom: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=200&h=200', // 표고버섯
    bomdong: 'https://images.unsplash.com/photo-1628773822003-11333736556e?auto=format&fit=crop&q=80&w=200&h=200', // 봄동
    sebal: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200&h=200', // 세발나물
  },
};



