import { StyleSheet, View } from 'react-native';
import { IconButton } from '@/components/common/IconButton';
import { Typography } from '@/components/common/Typography';
import { SPACING } from '@/constants/layout';
import { formatNumber } from '@/utils/format';

interface FeedSideActionsProps {
  likeCount: number;
  commentCount: number;
  liked?: boolean;
  onLikePress?: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
}

export function FeedSideActions({
  likeCount,
  commentCount,
  liked,
  onLikePress,
  onCommentPress,
  onSharePress,
}: FeedSideActionsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <IconButton
          name={liked ? 'heart' : 'heart-outline'}
          size={28}
          color={liked ? 'primary' : 'white'}
          onPress={onLikePress}
          accessibilityLabel="좋아요"
        />
        <Typography variant="captionStrong" color="white">
          {formatNumber(likeCount)}
        </Typography>
      </View>

      <View style={styles.item}>
        <IconButton
          name="chatbubble-outline"
          size={26}
          color="white"
          onPress={onCommentPress}
          accessibilityLabel="댓글"
        />
        <Typography variant="captionStrong" color="white">
          {formatNumber(commentCount)}
        </Typography>
      </View>

      <View style={styles.item}>
        <IconButton
          name="share-outline"
          size={26}
          color="white"
          onPress={onSharePress}
          accessibilityLabel="공유"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
});
