import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

export type ProductDetailRouteProp = RouteProp<RootStackParamList, 'Details'>;
export type ProductDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export interface ProductDetailProps {
  route: ProductDetailRouteProp;
  navigation: ProductDetailNavigationProp;
}

export type DetailTab = 'description' | 'reviews' | 'inquiries';
