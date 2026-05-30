import seed from './mockDbSeed.json'

export type CommerceProductStatus = '판매중' | '판매대기'

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
  weightOptions?: Array<{
    label: string
    price: number
  }>
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
  if (typeof window === 'undefined') {
    return mockSeed
  }

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
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDb))
}

function toNumber(value: string) {
  const onlyDigits = value.replace(/[^\d]/g, '')
  const parsed = Number(onlyDigits)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatWon(value: string) {
  const amount = toNumber(value)
  return `${amount.toLocaleString('ko-KR')}원`
}

function nextProductId(products: CommerceProduct[]) {
  return products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1
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
}) {
  const current = readMockDb()
  const shippingFee = toNumber(input.shippingFee)
  const nextProduct: CommerceProduct = {
    id: nextProductId(current.products),
    name: input.name.trim(),
    category: input.category.trim(),
    status: input.status,
    priceText: formatWon(input.price),
    stockText: `${toNumber(input.stock)}개`,
    shippingText:
      shippingFee <= 0
        ? '일반 택배 / 무료배송'
        : `일반 택배 / ${shippingFee.toLocaleString('ko-KR')}원`,
    shortDescription: input.shortDescription.trim(),
    detailDescription: input.detailDescription.trim(),
    imageSrc: input.imageSrc,
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
  },
) {
  const current = readMockDb()
  const shippingFee = toNumber(input.shippingFee)

  const nextProducts = current.products.map((product) => {
    if (product.id !== productId) {
      return product
    }
    return {
      ...product,
      name: input.name.trim(),
      category: input.category.trim(),
      status: input.status,
      priceText: formatWon(input.price),
      stockText: `${toNumber(input.stock)}개`,
      shippingText:
        shippingFee <= 0
          ? '일반 택배 / 무료배송'
          : `일반 택배 / ${shippingFee.toLocaleString('ko-KR')}원`,
      shortDescription: input.shortDescription.trim(),
      detailDescription: input.detailDescription.trim(),
      imageSrc: input.imageSrc,
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
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockSeed))
  commerceProducts.splice(0, commerceProducts.length, ...mockSeed.products)
}

