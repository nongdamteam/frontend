import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/constants/colors';

type BackHeaderProps = {
  title?: string;
  center?: React.ReactNode;
  right?: React.ReactNode;
  onBack?: () => void;
};

export default function BackHeader({ title, center, right, onBack }: BackHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const canGoBack = typeof navigation.canGoBack === 'function' ? navigation.canGoBack() : false;
  const showBackButton = Boolean(onBack) || canGoBack;

  const handleBack = () => {
    if (onBack) return onBack();
    // @ts-ignore
    if (canGoBack) navigation.goBack();
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top, height: 52 + insets.top }]}>
      {showBackButton ? (
        <TouchableOpacity style={styles.headerButton} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}

      {center ? (
        <View style={styles.centerWrapper}>{center}</View>
      ) : (
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={styles.rightPlaceholder}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS?.white || '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS?.text || '#222222',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS?.text || '#222222',
  },
  rightPlaceholder: {
    width: 36,
    alignItems: 'flex-end',
  },
  centerWrapper: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
