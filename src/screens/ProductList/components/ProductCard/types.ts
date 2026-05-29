import { IProduct } from '../../types';

export interface ProductCardProps {
  product: IProduct;
  onPress?: () => void;
  rank?: number;
}
