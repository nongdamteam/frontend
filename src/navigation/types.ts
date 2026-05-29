import { IProduct } from '@/screens/ProductList/types';

export type RootStackParamList = {
  Home: undefined; // 상품 리스트 화면
  Details: { product: IProduct; entryPoint?: 'home' | 'list' }; // 상품 상세 화면
};
