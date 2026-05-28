import { Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors.local';
import { HIT_SLOP } from '@/constants/layout';
import { IconButtonProps } from './types';

export function IconButton({
  name,
  size = 24,
  color = 'textPrimary',
  onPress,
  disabled,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={HIT_SLOP.small}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
      style={({ pressed }) => [
        { opacity: disabled ? 0.4 : pressed ? 0.6 : 1 },
        style,
      ]}
    >
      <Icon name={name} size={size} color={COLORS[color]} />
    </Pressable>
  );
}
