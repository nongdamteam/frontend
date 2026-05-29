import { ViewProps } from 'react-native';
import { ColorKey } from '@/constants/colors.local';

export type CardVariant = 'flat' | 'elevated';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  background?: ColorKey;
  padding?: number;
  radius?: number;
  children: React.ReactNode;
}
