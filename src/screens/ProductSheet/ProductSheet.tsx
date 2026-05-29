import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { COLORS } from '@/constants/colors.local';
import { RADIUS } from '@/constants/layout';
import { ProductSheetProvider, useProductSheet } from './context/ProductSheetContext';
import { ProductListContent } from '@/screens/ProductList/ProductListScreen';
import { useProducts } from '@/screens/ProductList/hooks/useProducts';
import SearchBar from '@/components/common/SearchBar';
import { ProductDetailScreen } from '@/screens/ProductDetail';
import { IProduct } from '@/screens/ProductList/types';
import { PRODUCTS_MOCK } from '@/assets/mock/products';

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
      console.log('[ProductSheet] open keyword:', kw);
      setKeyword(kw);
      modalRef.current?.present();
    },
    close: () => modalRef.current?.dismiss(),
  }));

  // 시트가 닫힐 때마다 ProductSheetProvider가 언마운트되도록 key 변경 → list 상태로 리셋
  const [resetKey, setResetKey] = useState(0);
  const handleDismiss = useCallback(() => {
    setResetKey(k => k + 1);
    setKeyword('');
  }, []);

  const snapPoints = useMemo(() => ['72%', '85%'], []);

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
          <SheetRouter keyword={keyword} onCloseModal={() => modalRef.current?.dismiss()} />
        </ProductSheetProvider>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ProductSheet.displayName = 'ProductSheet';

/** Provider 내부에서 view 분기 */
function SheetRouter({ keyword, onCloseModal }: { keyword: string; onCloseModal: () => void }) {
  const { view, pushDetail, popToList } = useProductSheet();

  if (view.name === 'list') {
    return (
      <ProductListModalWrapper
        keyword={keyword}
        onProductPress={(product) => pushDetail(product.id, product)}
      />
    );
  }
  return (
    <ProductDetailScreen
      product={view.product}
      entryPoint="modal"
      onBackPress={popToList}
      onCloseModal={onCloseModal}
    />
  );
}

function ProductListModalWrapper({
  keyword,
  onProductPress,
}: {
  keyword: string;
  onProductPress: (product: any) => void;
}) {
  // PRODUCTS_MOCK 데이터를 IProduct 규격에 맞게 실시간 변환하는 어댑터 적용
  const adaptedProducts: IProduct[] = useMemo(() => {
    return PRODUCTS_MOCK.map((prod) => {
      const rawImage = prod.thumbnailUrl ?? prod.images?.[0] ?? require('@/assets/images/bomdong_fresh.png');
      const image = typeof rawImage === 'string' ? { uri: rawImage } : rawImage;
      
      const rawImages = prod.images && prod.images.length > 0 ? prod.images : [rawImage];
      const images = rawImages.map(img => typeof img === 'string' ? { uri: img } : img);

      return {
        id: prod.id,
        title: prod.name,
        pricePer100g: prod.pricePerUnit,
        tags: prod.badges?.map((b) => b.label) ?? [],
        isGroupPurchase: prod.badges?.some((b) => b.id === 'groupbuy') ?? false,
        distance: prod.distanceKm ?? 0,
        participantsCount: prod.reviewCount ?? 0,
        image: image as any,
        images: images as any[],
      };
    });
  }, []);

  const productState = useProducts(keyword, false, 'distance', undefined, adaptedProducts);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <SearchBar
          value={productState.searchQuery}
          onChangeText={productState.setSearchQuery}
        />
      </View>
      <ProductListContent
        productState={productState}
        onProductPress={onProductPress}
      />
    </View>
  );
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
  content: {
    flex: 1,
    height: '100%',
  },
});
