import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@/screens/HomeScreen';

export type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'Details'>;
export type ProductDetailNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Details'>;

export interface ProductDetailProps {
  route?: ProductDetailRouteProp;
  navigation?: ProductDetailNavigationProp;
  product?: any;
  entryPoint?: 'home' | 'list' | 'modal';
  onBackPress?: () => void;
  onCloseModal?: () => void;
}

export type DetailTab = 'description' | 'reviews' | 'inquiries';
