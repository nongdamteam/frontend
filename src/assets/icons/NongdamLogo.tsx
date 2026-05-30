import React from 'react';
import { View, Image, StyleProp, ViewStyle } from 'react-native';

const logo1 = require('../images/logo1.png');
const logo2 = require('../images/logo2.png');

interface CroppedImageProps {
  source: any;
  cropLeft: number;
  cropTop: number;
  cropWidth: number;
  cropHeight: number;
  imageWidth: number;
  imageHeight: number;
  targetHeight: number;
  style?: StyleProp<ViewStyle>;
}

const CroppedImage: React.FC<CroppedImageProps> = ({
  source,
  cropLeft,
  cropTop,
  cropWidth,
  cropHeight,
  imageWidth,
  imageHeight,
  targetHeight,
  style,
}) => {
  const scale = targetHeight / cropHeight;
  const targetWidth = cropWidth * scale;

  const displayImageWidth = imageWidth * scale;
  const displayImageHeight = imageHeight * scale;

  const leftOffset = -cropLeft * scale;
  const topOffset = -cropTop * scale;

  return (
    <View style={[{
      width: targetWidth,
      height: targetHeight,
      overflow: 'hidden',
      position: 'relative',
    }, style]}>
      <Image
        source={source}
        style={{
          width: displayImageWidth,
          height: displayImageHeight,
          position: 'absolute',
          left: leftOffset,
          top: topOffset,
        }}
        resizeMode="stretch"
      />
    </View>
  );
};

interface NongdamLogoProps {
  width?: number;
  height?: number;
  mode?: 'all' | 'horizontal' | 'icon';
  style?: StyleProp<ViewStyle>;
}

export const NongdamLogo: React.FC<NongdamLogoProps> = ({
  width,
  height,
  mode = 'icon',
  style,
}) => {
  if (mode === 'horizontal') {
    const targetHeight = height || 36;
    return (
      <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
        <CroppedImage
          source={logo2}
          cropLeft={349.0}
          cropTop={224.5}
          cropWidth={550.8}
          cropHeight={517.5}
          imageWidth={1254}
          imageHeight={1254}
          targetHeight={targetHeight}
        />
        <CroppedImage
          source={logo2}
          cropLeft={350.2}
          cropTop={751.1}
          cropWidth={546.3}
          cropHeight={320.6}
          imageWidth={1254}
          imageHeight={1254}
          targetHeight={targetHeight * (320.6 / 517.5)}
          style={{ marginLeft: targetHeight * 0.25 }}
        />
      </View>
    );
  }

  if (mode === 'all') {
    const defaultWidth = width || 200;
    const defaultHeight = height || 290;
    return (
      <Image
        source={logo1}
        style={[{ width: defaultWidth, height: defaultHeight }, style]}
        resizeMode="contain"
      />
    );
  }

  // default mode === 'icon'
  const defaultWidth = width || 120;
  const defaultHeight = height || 120;
  return (
    <Image
      source={logo1}
      style={[{ width: defaultWidth, height: defaultHeight }, style]}
      resizeMode="contain"
    />
  );
};

export default NongdamLogo;

