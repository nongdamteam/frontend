import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../styles/theme';
import { COLORS } from '../../theme/colors';

export interface OrderItem {
  id: string;
  title: string;
  option: string;
  quantity: number;
  price: number;
  image: ImageSourcePropType | string;
}

interface OrderItemRowProps {
  item: OrderItem;
  showReviewButton: boolean;
  onReorder: (itemTitle: string) => void;
  onWriteReview: (itemTitle: string) => void;
}

function imageSource(image: ImageSourcePropType | string) {
  return typeof image === 'string' ? { uri: image } : image;
}

export default function OrderItemRow({
  item,
  showReviewButton,
  onReorder,
  onWriteReview,
}: OrderItemRowProps) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemMain}>
        <Image
          source={imageSource(item.image)}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemOption}>{item.option}</Text>
          <Text style={styles.itemPrice}>
            {item.price.toLocaleString()}원 · {item.quantity}개
          </Text>
        </View>
      </View>

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.subActionButton}
          onPress={() => onReorder(item.title)}
        >
          <Text style={styles.subActionText}>다시 담기</Text>
        </TouchableOpacity>
        {showReviewButton && (
          <TouchableOpacity
            style={[styles.subActionButton, styles.reviewButton]}
            onPress={() => onWriteReview(item.title)}
          >
            <Text style={[styles.subActionText, styles.reviewButtonText]}>리뷰 작성</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    marginTop: spacing.md,
  },
  itemMain: {
    flexDirection: 'row',
  },
  productImage: {
    backgroundColor: '#FAFAF8',
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 64,
    width: 64,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  itemTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  itemOption: {
    ...typography.caption,
    color: colors.mutedText,
    marginTop: 2,
    fontWeight: '500',
  },
  itemPrice: {
    ...typography.body,
    color: colors.text,
    marginTop: 4,
    fontWeight: '800',
    fontSize: 13,
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    paddingLeft: 74,
  },
  subActionButton: {
    borderColor: COLORS.border,
    borderRadius: radius.xs,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  subActionText: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '700',
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reviewButtonText: {
    color: colors.surface,
  },
});
