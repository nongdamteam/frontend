import { useCallback } from 'react';
import { Alert } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType as PickerMediaType,
} from 'react-native-image-picker';
import { SelectedMedia } from '@/@types/upload';

interface PickOptions {
  /** 'photo' | 'video' | 'mixed' (기본: 'mixed') */
  mediaType?: PickerMediaType;
}

function inferType(uriOrName: string, providedType?: string): 'image' | 'video' {
  if (providedType?.startsWith('video')) return 'video';
  if (providedType?.startsWith('image')) return 'image';
  const ext = uriOrName.split('.').pop()?.toLowerCase() ?? '';
  return ['mp4', 'mov', 'webm', 'mkv', 'avi'].includes(ext) ? 'video' : 'image';
}

/**
 * 갤러리/카메라로 미디어 선택.
 * 사용자가 취소하거나 실패하면 null 반환.
 */
export function useMediaLibrary() {
  const pickFromLibrary = useCallback(
    async ({ mediaType = 'mixed' }: PickOptions = {}): Promise<SelectedMedia | null> => {
      const result = await launchImageLibrary({
        mediaType,
        selectionLimit: 1,
        includeExtra: true,
      });

      if (result.didCancel) return null;
      if (result.errorCode) {
        Alert.alert('미디어를 불러오지 못했어요', result.errorMessage ?? '');
        return null;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) return null;

      return {
        type: inferType(asset.fileName ?? asset.uri, asset.type),
        uri: asset.uri,
        width: asset.width ?? 0,
        height: asset.height ?? 0,
        durationMs: asset.duration ? Math.round(asset.duration * 1000) : undefined,
      };
    },
    [],
  );

  const captureFromCamera = useCallback(
    async ({ mediaType = 'photo' }: PickOptions = {}): Promise<SelectedMedia | null> => {
      const result = await launchCamera({
        mediaType,
        includeExtra: true,
        saveToPhotos: false,
      });

      if (result.didCancel) return null;
      if (result.errorCode) {
        Alert.alert('카메라를 열지 못했어요', result.errorMessage ?? '');
        return null;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) return null;

      return {
        type: inferType(asset.fileName ?? asset.uri, asset.type),
        uri: asset.uri,
        width: asset.width ?? 0,
        height: asset.height ?? 0,
        durationMs: asset.duration ? Math.round(asset.duration * 1000) : undefined,
      };
    },
    [],
  );

  return { pickFromLibrary, captureFromCamera };
}
