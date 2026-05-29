import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/theme/colors';
import { typography, spacing, colors } from '../styles/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.inner}>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.subtitle}>현재는 준비 중입니다. 곧 업데이트 예정입니다.</Text>
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
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.subtleText,
    textAlign: 'center',
  },
});
