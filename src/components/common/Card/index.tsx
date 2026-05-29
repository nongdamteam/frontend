import { View } from 'react-native';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SHADOW, SPACING } from '@/constants/layout';
import { CardProps } from './types';

export function Card({
  variant = 'flat',
  background = 'surface',
  padding = SPACING.lg,
  radius = RADIUS.lg,
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS[background],
          padding,
          borderRadius: radius,
        },
        variant === 'elevated' && SHADOW.card,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
