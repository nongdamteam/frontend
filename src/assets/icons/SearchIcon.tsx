import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
}

export const SearchIcon: React.FC<IconProps> = ({
  color = '#8E8E93',
  size = 20,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="11"
        cy="11"
        r="7"
        stroke={color}
        strokeWidth="2"
      />
      <Path
        d="M20 20L16 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default SearchIcon;
