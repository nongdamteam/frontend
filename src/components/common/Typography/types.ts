import { TextProps, TextStyle } from 'react-native';
import { ColorKey } from '@/constants/colors.local';
import { TypographyVariant } from '@/constants/typography';

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorKey;
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}
