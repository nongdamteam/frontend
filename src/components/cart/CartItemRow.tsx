import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radius, spacing, typography } from '../../styles/theme';
import { COLORS } from '../../theme/colors';

export interface CartItem {
  id: string;
  farmId: string;
  title: string;
  option: string;
  recipeSource?: string;
  unitPrice: number;
  originalUnitPrice?: number;
  quantity: number;
  checked: boolean;
  isSoldOut?: boolean;
  priceChangedNote?: string;
  duplicateWarning?: {
    message: string;
    show: boolean;
  };
  image?: ImageSourcePropType | string;
}

interface CartItemRowProps {
  item: CartItem;
  onToggleItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, increment: number) => void;
  onMergeQuantity: (itemId: string) => void;
  onSeparatePurchase: (itemId: string) => void;
}

const CheckIcon = ({ checked, disabled }: { checked: boolean; disabled?: boolean }) => {
  const activeColor = disabled ? colors.placeholder : COLORS.primary;
  return (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <Rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="5"
        fill={checked ? activeColor : 'none'}
        stroke={checked ? activeColor : colors.placeholderDark}
        strokeWidth="2"
      />
      {checked && (
        <Path
          d="M7 12L10.5 15.5L17 8.5"
          stroke={colors.surface}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
};

const CloseIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={colors.mutedText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

function imageSource(image: ImageSourcePropType | string) {
  return typeof image === 'string' ? { uri: image } : image;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onToggleItem,
  onDeleteItem,
  onUpdateQuantity,
  onMergeQuantity,
  onSeparatePurchase,
}) => {
  const formatPrice = (price: number) => `${price.toLocaleString()}원`;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemMainRow}>
        {/* Checkbox */}
        <Pressable
          style={styles.itemCheckButton}
          onPress={() => !item.isSoldOut && onToggleItem(item.id)}
          disabled={item.isSoldOut}
        >
          <CheckIcon checked={item.checked} disabled={item.isSoldOut} />
        </Pressable>

        {/* Product Image */}
        {item.image ? (
          <View style={[styles.imageContainer, item.isSoldOut && styles.imageDisabled]}>
            <Image
              source={imageSource(item.image)}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={[styles.imagePlaceholder, item.isSoldOut && styles.imagePlaceholderDisabled]}>
            <Text style={[styles.imagePlaceholderText, item.isSoldOut && styles.imagePlaceholderTextDisabled]}>
              IMG{'\n'}{item.title.split(' ')[1]}
            </Text>
          </View>
        )}

        {/* Product Details */}
        <View style={styles.itemDetails}>
          <Text style={[styles.itemTitle, item.isSoldOut && styles.itemTitleDisabled]}>
            {item.title}
          </Text>
          <Text style={styles.itemOption}>{item.option}</Text>

          {item.recipeSource && (
            <View style={styles.recipeTag}>
              <Text style={styles.recipeTagText}>{item.recipeSource}</Text>
            </View>
          )}
        </View>

        {/* Close / Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteItem(item.id)}>
          <CloseIcon />
        </TouchableOpacity>
      </View>

      {/* Warning/Alert banners inside item card */}
      {item.duplicateWarning && item.duplicateWarning.show && (
        <View style={styles.duplicateBox}>
          <Text style={styles.duplicateBoxText}>{item.duplicateWarning.message}</Text>
          <View style={styles.duplicateBoxButtons}>
            <TouchableOpacity
              style={styles.mergeButton}
              onPress={() => onMergeQuantity(item.id)}
            >
              <Text style={styles.mergeButtonText}>수량 합치기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.separateButton}
              onPress={() => onSeparatePurchase(item.id)}
            >
              <Text style={styles.separateButtonText}>별도 구매</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {item.priceChangedNote && (
        <View style={styles.priceChangeBox}>
          <Text style={styles.priceChangeText}>
            가격 변경: {item.priceChangedNote}
          </Text>
        </View>
      )}

      {item.isSoldOut && (
        <View style={styles.soldOutBox}>
          <Text style={styles.soldOutText}>
            품절되어 결제할 수 없습니다. 삭제하거나 재입고 알림을 확인하세요.
          </Text>
        </View>
      )}

      {/* Quantity Control and Price Row */}
      <View style={styles.itemPriceRow}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.qtyButton, item.isSoldOut && styles.qtyButtonDisabled]}
            onPress={() => !item.isSoldOut && onUpdateQuantity(item.id, -1)}
            disabled={item.isSoldOut}
          >
            <Text style={styles.qtyButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity
            style={[styles.qtyButton, item.isSoldOut && styles.qtyButtonDisabled]}
            onPress={() => !item.isSoldOut && onUpdateQuantity(item.id, 1)}
            disabled={item.isSoldOut}
          >
            <Text style={styles.qtyButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          {item.originalUnitPrice && (
            <Text style={styles.originalPriceText}>
              {formatPrice(item.originalUnitPrice * item.quantity)}
            </Text>
          )}
          <Text style={styles.activePriceText}>
            {formatPrice(item.unitPrice * item.quantity)}
          </Text>
        </View>
      </View>

      <View style={styles.itemDivider} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: spacing.md,
  },
  itemMainRow: {
    flexDirection: 'row',
    position: 'relative',
    paddingRight: spacing.xl,
  },
  itemCheckButton: {
    justifyContent: 'center',
    paddingRight: spacing.sm,
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderColor: COLORS.border,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    height: 74,
    justifyContent: 'center',
    width: 74,
  },
  imagePlaceholderDisabled: {
    opacity: 0.5,
  },
  imagePlaceholderText: {
    ...typography.badge,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 14,
  },
  imagePlaceholderTextDisabled: {
    color: colors.placeholderDark,
  },
  imageContainer: {
    height: 74,
    width: 74,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderColor: COLORS.border,
    borderWidth: 1,
    backgroundColor: '#FAFAF8',
  },
  productImage: {
    height: 74,
    width: 74,
  },
  imageDisabled: {
    opacity: 0.4,
  },
  itemDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  itemTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
    fontSize: 14.5,
  },
  itemTitleDisabled: {
    color: colors.placeholderDark,
    textDecorationLine: 'line-through',
  },
  itemOption: {
    ...typography.caption,
    color: colors.mutedText,
    marginTop: 3,
    fontWeight: '500',
  },
  recipeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F3F3',
    borderRadius: radius.xs,
    marginTop: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  recipeTagText: {
    ...typography.badge,
    color: colors.subtleText,
    fontSize: 10,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: spacing.xs,
  },
  duplicateBox: {
    backgroundColor: colors.softSurface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    marginTop: spacing.md,
    marginLeft: 28,
    padding: spacing.md,
  },
  duplicateBoxText: {
    ...typography.caption,
    color: colors.subtleText,
    fontWeight: '700',
  },
  duplicateBoxButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  mergeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mergeButtonText: {
    ...typography.badge,
    color: colors.surface,
  },
  separateButton: {
    borderColor: COLORS.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  separateButtonText: {
    ...typography.badge,
    color: colors.subtleText,
  },
  priceChangeBox: {
    backgroundColor: '#FFF0F1',
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    marginLeft: 28,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  priceChangeText: {
    ...typography.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },
  soldOutBox: {
    backgroundColor: '#FFF0F1',
    borderRadius: radius.sm,
    marginTop: spacing.sm,
    marginLeft: 28,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  soldOutText: {
    ...typography.caption,
    color: COLORS.primary,
    fontWeight: '700',
    lineHeight: 16,
  },
  itemPriceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginLeft: 28,
  },
  quantityContainer: {
    alignItems: 'center',
    borderColor: COLORS.border,
    borderRadius: radius.xs,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 30,
    width: 90,
  },
  qtyButton: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  qtyButtonDisabled: {
    opacity: 0.3,
  },
  qtyButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.subtleText,
  },
  qtyValue: {
    ...typography.body,
    fontWeight: '700',
    textAlign: 'center',
    width: 30,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPriceText: {
    ...typography.caption,
    color: colors.placeholderDark,
    textDecorationLine: 'line-through',
    fontSize: 11,
    marginBottom: 1,
  },
  activePriceText: {
    ...typography.title,
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
  },
  itemDivider: {
    backgroundColor: colors.softSurface,
    height: 1,
    marginTop: spacing.lg,
  },
});
