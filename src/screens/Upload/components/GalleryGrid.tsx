import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '@/components/common/Typography';
import { COLORS } from '@/constants/colors.local';
import { SCREEN, SPACING } from '@/constants/layout';
import { GalleryPhoto, useGalleryPhotos } from '../hooks/useGalleryPhotos';

const COLUMNS = 3;
const CELL_GAP = 2;
const CELL_SIZE = (SCREEN.width - CELL_GAP * (COLUMNS - 1)) / COLUMNS;

interface GalleryGridProps {
  selectedUri?: string | null;
  onSelect: (photo: GalleryPhoto) => void;
}

export function GalleryGrid({ selectedUri, onSelect }: GalleryGridProps) {
  const { photos, loading, hasMore, permissionDenied, loadMore, reload } =
    useGalleryPhotos();

  const renderItem = useCallback(
    ({ item }: { item: GalleryPhoto }) => {
      const isSelected = item.uri === selectedUri;
      return (
        <Pressable
          onPress={() => onSelect(item)}
          style={({ pressed }) => [
            styles.cell,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Image
            source={{ uri: item.uri }}
            style={[
              styles.cellImage,
              isSelected && styles.cellImageSelected,
            ]}
          />

          {/* 동영상 재생 아이콘 */}
          {item.type === 'video' && !isSelected && (
            <View style={styles.videoOverlay}>
              <Icon name="play-circle" size={22} color="#fff" />
            </View>
          )}

          {/* 선택됐을 때: 이미지 어둡게 + 우측 상단 체크 뱃지 */}
          {isSelected ? (
            <View style={styles.checkBadge}>
              <Icon name="checkmark" size={16} color="#fff" />
            </View>
          ) : (
            /* 선택 안 됐을 때: 우측 상단 빈 원 힌트 */
            <View style={styles.emptyBadge} />
          )}
        </Pressable>
      );
    },
    [selectedUri, onSelect],
  );

  if (permissionDenied) {
    return (
      <View style={styles.center}>
        <Icon name="lock-closed-outline" size={40} color={COLORS.textMuted} />
        <Typography variant="body" color="textMuted" align="center" style={styles.msg}>
          갤러리 접근 권한이 없어요.{'\n'}기기 설정에서 권한을 허용해주세요.
        </Typography>
      </View>
    );
  }

  if (loading && photos.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Typography variant="caption" color="textMuted" style={styles.msg}>
          사진을 불러오는 중...
        </Typography>
      </View>
    );
  }

  if (!loading && photos.length === 0) {
    return (
      <View style={styles.center}>
        <Icon name="images-outline" size={40} color={COLORS.textMuted} />
        <Typography variant="body" color="textMuted" align="center" style={styles.msg}>
          갤러리에 사진이 없어요.
        </Typography>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      keyExtractor={item => item.uri}
      numColumns={COLUMNS}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: CELL_GAP }} />}
      columnWrapperStyle={styles.row}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        loading && photos.length > 0 ? (
          <View style={styles.footer}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : null
      }
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: SPACING.xl,
  },
  row: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'relative',
    backgroundColor: COLORS.surfaceMuted,
  },
  cellImage: {
    width: '100%',
    height: '100%',
  },
  cellImageSelected: {
    opacity: 0.65,
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
  },
  /* 선택됨: 우측 상단 그린 체크 뱃지 */
  checkBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  /* 선택 안 됨: 우측 상단 빈 원 힌트 */
  emptyBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  center: {
    flex: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    padding: SPACING.xl,
  },
  msg: {
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
});
