import { ProductRegistrationPage } from './ProductRegistrationPage'
import type { AppView } from '../../app/appTypes'
import type { ProductForm } from '../../config/productRegistrationConfig'
import { getProductById, updateCommerceProduct } from '../../services/mockDb/commerceDummyData'

type ProductEditPageProps = {
  productId: number
  onNavigate?: (view: AppView) => void
}

const PRODUCT_EDIT_FORM_STORAGE_KEY = 'nongdam-product-edit-form-v1'

function toDigits(value: string) {
  return String(Number(value.replace(/[^\d]/g, '')) || '')
}

function shippingTextToFee(shippingText: string) {
  const match = shippingText.match(/([\d,]+)\s*원/)
  if (!match) return '3000'
  return String(Number(match[1].replace(/,/g, '')) || 3000)
}

function mapProductToForm(productId: number): Partial<ProductForm> {
  const product = getProductById(productId)
  return {
    category: product.category,
    name: product.name,
    price: toDigits(product.priceText),
    stock: toDigits(product.stockText),
    status: product.status,
    salesMethod: '일반판매',
    shippingFee: shippingTextToFee(product.shippingText),
    origin: '국산',
    description: product.detailDescription || product.shortDescription || product.name,
  }
}

function readSavedEditForm(productId: number): Partial<ProductForm> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PRODUCT_EDIT_FORM_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, Partial<ProductForm>>
    return parsed[String(productId)] ?? {}
  } catch {
    return {}
  }
}

function writeSavedEditForm(productId: number, form: ProductForm) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(PRODUCT_EDIT_FORM_STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, Partial<ProductForm>>) : {}
    const next: Record<string, Partial<ProductForm>> = {
      ...parsed,
      [String(productId)]: form,
    }
    localStorage.setItem(PRODUCT_EDIT_FORM_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // no-op
  }
}

export function ProductEditPage({ productId, onNavigate }: ProductEditPageProps) {
  const product = getProductById(productId)
  const initialForm = {
    ...mapProductToForm(productId),
    ...readSavedEditForm(productId),
  }

  return (
    <ProductRegistrationPage
      initialMode="일반판매"
      initialActiveView="registration"
      pageTitleOverride="상품 수정"
      sidebarItemOverride="상품 조회/수정"
      initialFormOverride={initialForm}
      initialRepresentativeImageSrc={product.imageSrc}
      submitButtonLabel="저장 변경"
      disableDraftPersistence
      onSubmitProduct={({ form, representativeImageUrl }) => {
        writeSavedEditForm(productId, form)
        updateCommerceProduct(productId, {
          name: form.name,
          category: form.category,
          status: form.status as '판매중' | '판매대기',
          price: form.price,
          stock: form.stock,
          shippingFee: form.shippingFee,
          shortDescription: form.description || form.name,
          detailDescription: form.description || form.name,
          imageSrc: representativeImageUrl,
        })
      }}
      onNavigate={onNavigate}
    />
  )
}
