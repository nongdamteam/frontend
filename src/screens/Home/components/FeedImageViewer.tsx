import { StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';

interface FeedImageViewerProps {
  uri: string;
}

export function FeedImageViewer({ uri }: FeedImageViewerProps) {
  return (
    <FastImage
      source={{ uri, priority: FastImage.priority.high }}
      style={StyleSheet.absoluteFillObject}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
}
