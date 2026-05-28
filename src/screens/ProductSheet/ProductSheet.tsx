import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { COLORS } from '@/constants/colors.local';
import { RADIUS } from '@/constants/layout';
import { ProductSheetProvider, useProductSheet } from './context/ProductSheetContext';
import { ProductListView } from './components/ProductListView';
import { ProductDetailView } from './components/ProductDetailView';

export interface ProductSheetRef {
  open: (keyword: string) => void;
  close: () => void;
}

/**
 * 외부에서 ref.open(keyword)로 띄우는 상품 바텀시트.
 * 내부에서 list ↔ detail 전환은 ProductSheetContext가 담당.
 */
export const ProductSheet = forwardRef<ProductSheetRef>((_props, ref) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [keyword, setKeyword] = useState<string>('');

  useImperativeHandle(ref, () => ({
    open: (kw: string) => {
      setKeyword(kw);
      modalRef.current?.present();
    },
    close: () => modalRef.current?.dismiss(),
  }));

  // 시트가 닫힐 때마다 ProductSheetProvider가 언마운트되도록 key 변경 → list 상태로 리셋
  const [resetKey, setResetKey] = useState(0);
  const handleDismiss = useCallback(() => {
    setResetKey(k => k + 1);
  }, []);

  const snapPoints = useMemo(() => ['65%', '92%'], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        <ProductSheetProvider key={resetKey}>
          <SheetRouter keyword={keyword} />
        </ProductSheetProvider>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ProductSheet.displayName = 'ProductSheet';

/** Provider 내부에서 view 분기 */
function SheetRouter({ keyword }: { keyword: string }) {
  const { view } = useProductSheet();

  if (view.name === 'list') {
    return <ProductListView keyword={keyword} />;
  }
  return <ProductDetailView productId={view.productId} />;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  handle: {
    backgroundColor: COLORS.border,
    width: 40,
  },
  content: { flex: 1 },
});
