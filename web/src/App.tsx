import { useState } from 'react'
import { ProductInquiryPage } from './ProductInquiryPage'
import { ProductRegistrationPage } from './ProductRegistrationPage'
import { ProductDetailPage } from './screens/ProductDetailPage'
import { ProductEditPage } from './screens/ProductEditPage'
import { StoreInfoPage } from './screens/StoreInfoPage'
import { featuredProductId } from './data/commerceDummyData'
import type { AppView } from './appTypes'
import './App.css'

function App() {
  const [view, setView] = useState<AppView>('product-inquiry')
  const [selectedProductId, setSelectedProductId] = useState(featuredProductId)

  const handleOpenProductDetail = (productId: number) => {
    setSelectedProductId(productId)
    setView('product-detail')
  }

  const handleOpenProductEdit = (productId: number) => {
    setSelectedProductId(productId)
    setView('product-edit')
  }

  if (view === 'product-inquiry') {
    return (
      <ProductInquiryPage
        onNavigate={setView}
        onOpenProductDetail={handleOpenProductDetail}
        onOpenProductEdit={handleOpenProductEdit}
      />
    )
  }

  if (view === 'product-detail') {
    return <ProductDetailPage productId={selectedProductId} onNavigate={setView} />
  }

  if (view === 'product-edit') {
    return <ProductEditPage productId={selectedProductId} onNavigate={setView} />
  }

  if (view === 'store-info') {
    return <StoreInfoPage onNavigate={setView} />
  }

  return (
    <ProductRegistrationPage
      initialMode={view === 'group-buy-register' ? '잔여수확 공동구매' : '일반판매'}
      onNavigate={setView}
    />
  )
}

export default App
