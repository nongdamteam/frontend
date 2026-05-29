import { GestureResponderEvent, ViewStyle } from 'react-native';
import { ColorKey } from '@/constants/colors.local';

export interface IconButtonProps {
  name: string;
  size?: number;
  color?: ColorKey;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}
