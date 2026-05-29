import { View } from 'react-native';
import { COLORS } from '@/constants/colors.local';
import { RADIUS, SPACING } from '@/constants/layout';
import { Typography } from '@/components/common/Typography';
import { ChipProps } from './types';

export function Chip({
  label,
  background = 'accent',
  color = 'accentText',
}: ChipProps) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS[background],
      }}
    >
      <Typography variant="captionStrong" color={color}>
        {label}
      </Typography>
    </View>
  );
}
