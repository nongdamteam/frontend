import { Image, StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { MediaSource } from '@/@types/feed';

interface FeedImageViewerProps {
  source: MediaSource;
}

export function FeedImageViewer({ source }: FeedImageViewerProps) {
  // 로컬 require()(number)는 RN 기본 Image가 안정적,
  // 원격 URL은 FastImage(캐싱) 사용
  if (typeof source === 'number') {
    return (
      <Image
        source={source}
        style={styles.full}
        resizeMode="cover"
      />
    );
  }

  return (
    <FastImage
      source={{ uri: source, priority: FastImage.priority.high }}
      style={styles.full}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
}

const styles = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%',
  },
});
