import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { CameraRoll, PhotoIdentifier } from '@react-native-camera-roll/camera-roll';

const PAGE_SIZE = 60;

async function requestAndroidPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  // Android 13+ (API 33+)
  if (Platform.Version >= 33) {
    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]);
    return (
      results['android.permission.READ_MEDIA_IMAGES'] === 'granted' ||
      results['android.permission.READ_MEDIA_VIDEO'] === 'granted'
    );
  }

  // Android 12 이하
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: '갤러리 접근 권한',
      message: '사진 및 영상을 업로드하려면 갤러리 접근이 필요해요.',
      buttonPositive: '허용',
      buttonNegative: '거부',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export interface GalleryPhoto {
  uri: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  durationMs?: number;
}

interface UseGalleryPhotosResult {
  photos: GalleryPhoto[];
  loading: boolean;
  hasMore: boolean;
  permissionDenied: boolean;
  loadMore: () => void;
  reload: () => void;
}

export function useGalleryPhotos(): UseGalleryPhotosResult {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const cursorRef = useRef<string | undefined>(undefined);
  const loadingRef = useRef(false);

  const mapAsset = (item: PhotoIdentifier): GalleryPhoto => ({
    uri: item.node.image.uri,
    type: item.node.type?.startsWith('video') ? 'video' : 'image',
    width: item.node.image.width,
    height: item.node.image.height,
    durationMs: item.node.image.playableDuration
      ? Math.round(item.node.image.playableDuration * 1000)
      : undefined,
  });

  const fetchPage = useCallback(async (after?: string) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const ok = await requestAndroidPermission();
      if (!ok) {
        setPermissionDenied(true);
        return;
      }

      const result = await CameraRoll.getPhotos({
        first: PAGE_SIZE,
        after,
        assetType: 'All',
        include: ['filename', 'fileSize', 'imageSize', 'playableDuration'],
      });

      const newPhotos = result.edges.map(mapAsset);
      setPhotos(prev => (after ? [...prev, ...newPhotos] : newPhotos));
      setHasMore(result.page_info.has_next_page);
      cursorRef.current = result.page_info.end_cursor;
    } catch (e) {
      Alert.alert('갤러리를 불러오지 못했어요', (e as Error).message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current) return;
    fetchPage(cursorRef.current);
  }, [hasMore, fetchPage]);

  const reload = useCallback(() => {
    cursorRef.current = undefined;
    setPhotos([]);
    setHasMore(true);
    fetchPage(undefined);
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(undefined);
  }, [fetchPage]);

  return { photos, loading, hasMore, permissionDenied, loadMore, reload };
}
