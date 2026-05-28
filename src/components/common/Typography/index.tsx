import { Text } from 'react-native';
import { COLORS } from '@/constants/colors.local';
import { TYPOGRAPHY } from '@/constants/typography';
import { TypographyProps } from './types';

export function Typography({
  variant = 'body',
  color = 'textPrimary',
  align,
  style,
  children,
  ...rest
}: TypographyProps) {
  return (
    <Text
      style={[
        TYPOGRAPHY[variant],
        { color: COLORS[color], textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}
