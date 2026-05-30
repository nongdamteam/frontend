import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors.local';
import { SHADOW } from '@/constants/layout';
import { FloatingButtonProps } from './types';

export function FloatingButton({
  iconName,
  iconSize = 24,
  size = 48,
  background = 'surface',
  iconColor = 'textPrimary',
  onPress,
  accessibilityLabel,
  style,
}: FloatingButtonProps) {
  const baseOpacity = (style as any)?.opacity ?? 1;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? iconName}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: COLORS[background],
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? baseOpacity * 0.85 : baseOpacity,
        },
        SHADOW.floating,
        style,
      ]}
    >
      <Icon name={iconName} size={iconSize} color={COLORS[iconColor]} />
    </Pressable>
  );
}
