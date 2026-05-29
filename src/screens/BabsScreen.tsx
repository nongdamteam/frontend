import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/theme/colors';
import { typography, spacing } from '../styles/theme';

export default function BabsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.inner}>
        <Text style={styles.title}>밥스</Text>
        <Text style={styles.subtitle}>밥스 섹션은 곧 공개됩니다.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.headline,
    fontWeight: '800',
    marginBottom: spacing.md,
    color: COLORS.text,
  },
  subtitle: {
    ...typography.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
