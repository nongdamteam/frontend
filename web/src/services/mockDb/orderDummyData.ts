export type OrderStatus = '주문 확인' | '상품 준비' | '배송 준비' | '배송 중' | '배송 완료'

export type PaymentStatus = '결제완료' | '미결제'

export type OrderRow = {
  id: number
  orderNo: string
  orderedAt: string
  status: OrderStatus
  productName: string
  optionLabel: string
  quantity: number
  buyerName: string
  buyerPhone: string
  address: string
  paymentStatus: PaymentStatus
  paymentAmountText: string
  memo: string
}

const STORAGE_KEY = 'nongdam-order-db-v1'

const ORDER_SEED: OrderRow[] = [
  {
    id: 1,
    orderNo: 'ND-20260531-0001',
    orderedAt: '2026-05-31 09:12',
    status: '주문 확인',
    productName: '땅끝마을 해남 꿀 알배추',
    optionLabel: '1kg',
    quantity: 2,
    buyerName: '이수진',
    buyerPhone: '010-9988-1234',
    address: '서울 송파구 올림픽로 300',
    paymentStatus: '결제완료',
    paymentAmountText: '9,000원',
    memo: '문 앞 비대면 배송 요청',
  },
  {
    id: 2,
    orderNo: 'ND-20260531-0002',
    orderedAt: '2026-05-31 09:43',
    status: '상품 준비',
    productName: '햇 흙당근',
    optionLabel: '2kg',
    quantity: 1,
    buyerName: '박재민',
    buyerPhone: '010-2234-8899',
    address: '경기 성남시 분당구 판교로 235',
    paymentStatus: '결제완료',
    paymentAmountText: '8,900원',
    memo: '',
  },
  {
    id: 3,
    orderNo: 'ND-20260531-0003',
    orderedAt: '2026-05-31 10:08',
    status: '배송 준비',
    productName: '고랭지 무농약 감자',
    optionLabel: '4kg',
    quantity: 1,
    buyerName: '정유리',
    buyerPhone: '010-3141-2718',
    address: '부산 해운대구 센텀중앙로 48',
    paymentStatus: '결제완료',
    paymentAmountText: '12,900원',
    memo: '',
  },
  {
    id: 4,
    orderNo: 'ND-20260531-0004',
    orderedAt: '2026-05-31 10:21',
    status: '배송 중',
    productName: '강원도 찰옥수수',
    optionLabel: '10개입',
    quantity: 1,
    buyerName: '오현우',
    buyerPhone: '010-7788-2233',
    address: '대전 유성구 대덕대로 512',
    paymentStatus: '결제완료',
    paymentAmountText: '15,900원',
    memo: '경비실 맡김 가능',
  },
  {
    id: 5,
    orderNo: 'ND-20260531-0005',
    orderedAt: '2026-05-31 10:55',
    status: '배송 완료',
    productName: '유기농 양파',
    optionLabel: '5kg',
    quantity: 1,
    buyerName: '김하늘',
    buyerPhone: '010-1212-4545',
    address: '광주 북구 첨단과기로 208',
    paymentStatus: '결제완료',
    paymentAmountText: '13,500원',
    memo: '',
  },
  {
    id: 6,
    orderNo: 'ND-20260531-0006',
    orderedAt: '2026-05-31 11:07',
    status: '주문 확인',
    productName: '완숙 토마토',
    optionLabel: '3kg',
    quantity: 1,
    buyerName: '조민성',
    buyerPhone: '010-6677-8765',
    address: '인천 연수구 컨벤시아대로 165',
    paymentStatus: '미결제',
    paymentAmountText: '18,500원',
    memo: '결제 확인 후 출고',
  },
]

function readOrders(): OrderRow[] {
  if (typeof window === 'undefined') return ORDER_SEED

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ORDER_SEED))
      return ORDER_SEED
    }
    const parsed = JSON.parse(raw) as OrderRow[]
    if (!Array.isArray(parsed) || parsed.length === 0) return ORDER_SEED
    return parsed
  } catch {
    return ORDER_SEED
  }
}

function writeOrders(nextOrders: OrderRow[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders))
}

export const orderRows: OrderRow[] = readOrders()

export function updateOrderStatus(orderId: number, status: OrderStatus) {
  const current = readOrders()
  const next = current.map((row) => (row.id === orderId ? { ...row, status } : row))
  writeOrders(next)
  orderRows.splice(0, orderRows.length, ...next)
  return next.find((row) => row.id === orderId)
}
