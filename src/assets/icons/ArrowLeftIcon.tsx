import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
}

export const ArrowLeftIcon: React.FC<IconProps> = ({
  color = '#111111',
  size = 24,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 19L8 12L15 5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ArrowLeftIcon;
