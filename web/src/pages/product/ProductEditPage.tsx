import { ProductRegistrationPage } from './ProductRegistrationPage'
import type { AppView } from '../../app/appTypes'
import type { ProductForm } from '../../config/productRegistrationConfig'
import {
  deleteCommerceProduct,
  getProductById,
  updateCommerceProduct,
} from '../../services/mockDb/commerceDummyData'

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
  const options =
    product.weightOptions?.length
      ? product.weightOptions.map((option) => ({
          label: option.label,
          price: String(option.price),
          stock: String(option.stock ?? 0),
        }))
      : [
          {
            label: '기본',
            price: toDigits(product.priceText),
            stock: toDigits(product.stockText),
          },
        ]

  const first = options[0]

  return {
    category: product.category,
    name: product.name,
    price: first?.price ?? '',
    stock: first?.stock ?? '',
    purchaseOptions: options,
    status: product.status as ProductForm['status'],
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
    parsed[String(productId)] = form
    localStorage.setItem(PRODUCT_EDIT_FORM_STORAGE_KEY, JSON.stringify(parsed))
  } catch {
    // no-op
  }
}

function removeSavedEditForm(productId: number) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(PRODUCT_EDIT_FORM_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Record<string, Partial<ProductForm>>
    delete parsed[String(productId)]
    localStorage.setItem(PRODUCT_EDIT_FORM_STORAGE_KEY, JSON.stringify(parsed))
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
      deleteButtonLabel="삭제"
      submitButtonLabel="저장 반영"
      disableDraftPersistence
      onDeleteProduct={() => {
        const ok = window.confirm('이 상품을 삭제할까요? 삭제 후에는 복구할 수 없습니다.')
        if (!ok) return

        const deleted = deleteCommerceProduct(productId)
        if (!deleted) {
          window.alert('삭제할 상품을 찾지 못했습니다.')
          return
        }

        removeSavedEditForm(productId)
        onNavigate?.('product-inquiry')
      }}
      onSubmitProduct={({ form, representativeImageUrl }) => {
        writeSavedEditForm(productId, form)
        updateCommerceProduct(productId, {
          name: form.name,
          category: form.category,
          status: form.status as any,
          price: form.price,
          stock: form.stock,
          shippingFee: form.shippingFee,
          shortDescription: form.description || form.name,
          detailDescription: form.description || form.name,
          imageSrc: representativeImageUrl,
          weightOptions: form.purchaseOptions,
        })
      }}
      onNavigate={onNavigate}
    />
  )
}
