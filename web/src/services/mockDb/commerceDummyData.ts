import seed from './mockDbSeed.json'

export type CommerceProductStatus = '판매중' | '판매대기' | '비공개' | '예약 판매'

export type CommerceProductOption = {
  label: string
  price: number
  stock: number
}

export type CommerceProduct = {
  id: number
  name: string
  category: string
  status: CommerceProductStatus
  priceText: string
  stockText: string
  shippingText: string
  shortDescription: string
  detailDescription: string
  weightOptions?: CommerceProductOption[]
  imageSrc: string
}

export type StoreProfile = {
  name: string
  owner: string
  phone: string
  address: string
  openHours: string
  accountNumber: string
  introduction: string
  representativeImage: string
}

type MockDbSeed = {
  storeProfile: StoreProfile
  featuredProductId: number
  products: CommerceProduct[]
}

const STORAGE_KEY = 'nongdam-mock-db-v1'
const mockSeed: MockDbSeed = seed as MockDbSeed

function readMockDb(): MockDbSeed {
  if (typeof window === 'undefined') return mockSeed

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeed))
      return mockSeed
    }
    const parsed = JSON.parse(raw) as Partial<MockDbSeed>
    return {
      storeProfile: parsed.storeProfile ?? mockSeed.storeProfile,
      featuredProductId: parsed.featuredProductId ?? mockSeed.featuredProductId,
      products: parsed.products ?? mockSeed.products,
    }
  } catch {
    return mockSeed
  }
}

function writeMockDb(nextDb: MockDbSeed) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDb))
}

function toNumber(value: string | number) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const parsed = Number(String(value).replace(/[^\d]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function formatWon(value: string | number) {
  return `${toNumber(value).toLocaleString('ko-KR')}원`
}

function nextProductId(products: CommerceProduct[]) {
  return products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1
}

function normalizeOptions(
  options: Array<{ label: string; price: string; stock: string }> | undefined,
  fallbackPrice: string,
  fallbackStock: string,
): CommerceProductOption[] {
  const normalized =
    options
      ?.map((option) => ({
        label: option.label.trim(),
        price: toNumber(option.price),
        stock: toNumber(option.stock),
      }))
      .filter((option) => option.label.length > 0) ?? []

  if (normalized.length > 0) {
    return normalized
  }

  return [
    {
      label: '기본',
      price: toNumber(fallbackPrice),
      stock: toNumber(fallbackStock),
    },
  ]
}

function buildPriceAndStockText(options: CommerceProductOption[]) {
  const first = options[0]
  const totalStock = options.reduce((sum, option) => sum + option.stock, 0)
  return {
    priceText: formatWon(first?.price ?? 0),
    stockText: `${totalStock.toLocaleString('ko-KR')}개`,
  }
}

const db = readMockDb()

export const commerceProducts: CommerceProduct[] = [...db.products]
export const storeProfile: StoreProfile = db.storeProfile
export const featuredProductId = db.featuredProductId

export function getProductById(productId: number): CommerceProduct {
  const product = commerceProducts.find((item) => item.id === productId)
  return product ?? commerceProducts[0]
}

export function appendCommerceProduct(input: {
  name: string
  category: string
  status: CommerceProductStatus
  price: string
  stock: string
  shippingFee: string
  shortDescription: string
  detailDescription: string
  imageSrc: string
  weightOptions?: Array<{ label: string; price: string; stock: string }>
}) {
  const current = readMockDb()
  const shippingFee = toNumber(input.shippingFee)
  const nextOptions = normalizeOptions(input.weightOptions, input.price, input.stock)
  const { priceText, stockText } = buildPriceAndStockText(nextOptions)

  const nextProduct: CommerceProduct = {
    id: nextProductId(current.products),
    name: input.name.trim(),
    category: input.category.trim(),
    status: input.status,
    priceText,
    stockText,
    shippingText:
      shippingFee <= 0
        ? '일반 택배 / 무료배송'
        : `일반 택배 / ${shippingFee.toLocaleString('ko-KR')}원`,
    shortDescription: input.shortDescription.trim(),
    detailDescription: input.detailDescription.trim(),
    imageSrc: input.imageSrc,
    weightOptions: nextOptions,
  }

  const nextDb: MockDbSeed = {
    ...current,
    products: [nextProduct, ...current.products],
    featuredProductId: current.featuredProductId ?? nextProduct.id,
  }

  writeMockDb(nextDb)
  commerceProducts.splice(0, commerceProducts.length, ...nextDb.products)
  return nextProduct
}

export function updateCommerceProduct(
  productId: number,
  input: {
    name: string
    category: string
    status: CommerceProductStatus
    price: string
    stock: string
    shippingFee: string
    shortDescription: string
    detailDescription: string
    imageSrc: string
    weightOptions?: Array<{ label: string; price: string; stock: string }>
  },
) {
  const current = readMockDb()
  const shippingFee = toNumber(input.shippingFee)
  const nextOptions = normalizeOptions(input.weightOptions, input.price, input.stock)
  const { priceText, stockText } = buildPriceAndStockText(nextOptions)

  const nextProducts = current.products.map((product) => {
    if (product.id !== productId) return product

    return {
      ...product,
      name: input.name.trim(),
      category: input.category.trim(),
      status: input.status,
      priceText,
      stockText,
      shippingText:
        shippingFee <= 0
          ? '일반 택배 / 무료배송'
          : `일반 택배 / ${shippingFee.toLocaleString('ko-KR')}원`,
      shortDescription: input.shortDescription.trim(),
      detailDescription: input.detailDescription.trim(),
      imageSrc: input.imageSrc,
      weightOptions: nextOptions,
    }
  })

  const nextDb: MockDbSeed = {
    ...current,
    products: nextProducts,
  }

  writeMockDb(nextDb)
  commerceProducts.splice(0, commerceProducts.length, ...nextProducts)
  return nextProducts.find((product) => product.id === productId) ?? nextProducts[0]
}

export function resetMockDb() {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeed))
  commerceProducts.splice(0, commerceProducts.length, ...mockSeed.products)
}

export function deleteCommerceProduct(productId: number) {
  const current = readMockDb()
  const nextProducts = current.products.filter((product) => product.id !== productId)
  if (nextProducts.length === current.products.length) return false

  const nextFeaturedProductId = nextProducts.length
    ? nextProducts.some((product) => product.id === current.featuredProductId)
      ? current.featuredProductId
      : nextProducts[0].id
    : current.featuredProductId

  const nextDb: MockDbSeed = {
    ...current,
    featuredProductId: nextFeaturedProductId,
    products: nextProducts,
  }

  writeMockDb(nextDb)
  commerceProducts.splice(0, commerceProducts.length, ...nextProducts)
  return true
}
