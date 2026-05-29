import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';

interface FeedVideoPlayerProps {
  uri: string;
  posterUri?: string;
  paused: boolean;
}

export function FeedVideoPlayer({ uri, posterUri, paused }: FeedVideoPlayerProps) {
  const ref = useRef<VideoRef>(null);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Video
        ref={ref}
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        repeat
        muted={false}
        paused={paused}
        poster={posterUri ? { source: { uri: posterUri }, resizeMode: 'cover' } : undefined}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
      />
    </View>
  );
}
