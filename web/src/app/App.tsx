import { useState } from 'react'
import { ProductInquiryPage } from '../pages/product/ProductInquiryPage'
import { ProductRegistrationPage } from '../pages/product/ProductRegistrationPage'
import { ProductReviewManagementPage } from '../pages/product/ProductReviewManagementPage'
import { ProductEditPage } from '../pages/product/ProductEditPage'
import { StoreInfoPage } from '../pages/store/StoreInfoPage'
import { OrderManagementPage } from '../pages/order/OrderManagementPage'
import { featuredProductId } from '../services/mockDb/commerceDummyData'
import type { AppView } from './appTypes'
import '../styles/App.css'

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
    return <ProductReviewManagementPage productId={selectedProductId} onNavigate={setView} />
  }

  if (view === 'product-edit') {
    return <ProductEditPage productId={selectedProductId} onNavigate={setView} />
  }

  if (view === 'store-info') {
    return <StoreInfoPage onNavigate={setView} />
  }

  if (view === 'order-management') {
    return <OrderManagementPage onNavigate={setView} />
  }

  return (
    <ProductRegistrationPage
      initialMode={view === 'group-buy-register' ? '잔여수확 공동구매' : '일반판매'}
      initialActiveView={view === 'group-buy-progress' ? 'activeGroupBuys' : 'registration'}
      onNavigate={setView}
    />
  )
}

export default App
