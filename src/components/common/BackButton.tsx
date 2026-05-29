import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../../styles/theme';

interface BackButtonProps {
  onPress: () => void;
  color?: string;
}

export default function BackButton({ onPress, color }: BackButtonProps) {
  const strokeColor = color ?? colors.mutedText;

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 19L8 12L15 5"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.xs,
  },
});
