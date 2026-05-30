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
            pressed && { opacity: 0.75 },
          ]}
        >
          <Image source={{ uri: item.uri }} style={styles.cellImage} />

          {/* 동영상 표시 */}
          {item.type === 'video' && (
            <View style={styles.videoOverlay}>
              <Icon name="play-circle" size={22} color="#fff" />
            </View>
          )}

          {/* 선택된 사진 표시 */}
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <View style={styles.selectedCheck}>
                <Icon name="checkmark" size={14} color="#fff" />
              </View>
            </View>
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
  videoOverlay: {
    position: 'absolute',
    bottom: 6,
    left: 6,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(168, 201, 158, 0.35)',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    padding: 6,
  },
  selectedCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
