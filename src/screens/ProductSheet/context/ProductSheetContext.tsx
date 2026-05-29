import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type SheetView =
  | { name: 'list' }
  | { name: 'detail'; productId: string; product?: any };

interface ProductSheetContextValue {
  view: SheetView;
  pushDetail: (productId: string, product?: any) => void;
  popToList: () => void;
  reset: () => void;
}

const ProductSheetContext = createContext<ProductSheetContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export function ProductSheetProvider({ children }: ProviderProps) {
  const [view, setView] = useState<SheetView>({ name: 'list' });

  const pushDetail = useCallback((productId: string, product?: any) => {
    setView({ name: 'detail', productId, product });
  }, []);

  const popToList = useCallback(() => {
    setView({ name: 'list' });
  }, []);

  const reset = useCallback(() => {
    setView({ name: 'list' });
  }, []);

  const value = useMemo(
    () => ({ view, pushDetail, popToList, reset }),
    [view, pushDetail, popToList, reset],
  );

  return (
    <ProductSheetContext.Provider value={value}>
      {children}
    </ProductSheetContext.Provider>
  );
}

export function useProductSheet() {
  const ctx = useContext(ProductSheetContext);
  if (!ctx) {
    throw new Error('useProductSheet must be used within ProductSheetProvider');
  }
  return ctx;
}
