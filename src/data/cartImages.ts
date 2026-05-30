import { ImageSourcePropType } from 'react-native';

type CartImages = {
  products: Record<string, ImageSourcePropType | string>;
};

export const cartImages: CartImages = {
  products: {
    nei: require('@/assets/images/products/prod_naengi_1.png'), // 냉이
    rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200&h=200', // 쌀
    mushroom: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=200&h=200', // 표고버섯
    bomdong: require('@/assets/images/bomdong_fresh.png'), // 봄동
    sebal: require('@/assets/images/products/prod_004.png'), // 세발나물
  },
};



