import { GestureResponderEvent, ViewStyle } from 'react-native';
import { ColorKey } from '@/constants/colors.local';

export interface FloatingButtonProps {
  /** Ionicons 아이콘명 (예: 'add', 'camera') */
  iconName: string;
  iconSize?: number;
  size?: number;
  background?: ColorKey;
  iconColor?: ColorKey;
  onPress?: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  style?: ViewStyle;
}
