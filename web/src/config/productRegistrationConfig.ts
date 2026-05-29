import animalWelfareCertification from '../assets/certifications/animal_welfare.jpg'
import gapCertification from '../assets/certifications/gap.jpg'
import foodMasterCertification from '../assets/certifications/grand_master.jpg'
import liquorQualityCertification from '../assets/certifications/granted_alcohol.jpg'
import haccpCertification from '../assets/certifications/haccp.jpg'
import processedFoodKsCertification from '../assets/certifications/ks_food.jpg'
import lowCarbonCertification from '../assets/certifications/low_carbon.jpg'
import antibioticFreeCertification from '../assets/certifications/non_antibiotic.jpg'
import pesticideFreeCertification from '../assets/certifications/non_pesticide.jpg'
import organicCertification from '../assets/certifications/organic.jpg'
import organicProcessedCertification from '../assets/certifications/organic_processed.jpg'
import geographicalIndicationCertification from '../assets/certifications/pgi.jpg'
import traditionalFoodCertification from '../assets/certifications/traditional_food.jpg'
import onionGroupPurchase from '../assets/group-purchase/onion.jpg'
import persimmonGroupPurchase from '../assets/group-purchase/persimmon.jpg'
import potatoGroupPurchase from '../assets/group-purchase/potato.jpg'
import strawberryGroupPurchase from '../assets/group-purchase/strawberry.jpg'
import tomatoGroupPurchase from '../assets/group-purchase/tomato.jpg'

export type ProductStatus = '판매중' | '판매대기'
export type DeliveryMethod = '택배배송' | '직접배송' | '예약수령'
export type SalesMethod = '일반판매' | '잔여수확 공동구매'
export type FailurePolicy = '목표 미달 시 자동 취소' | '판매자 확인 후 진행'
export type CategoryMode = 'search' | 'select' | 'template'
export type GroupBuyingStatus =
  | '모집중'
  | '마감임박'
  | '성사'
  | '목표미달'
  | '배송준비'
export type CertificationMarkId =
  | 'organic'
  | 'pesticideFree'
  | 'gap'
  | 'antibioticFree'
  | 'animalWelfare'
  | 'haccp'
  | 'organicProcessed'
  | 'geographicalIndication'
  | 'traditionalFood'
  | 'foodMaster'
  | 'processedFoodKs'
  | 'lowCarbon'
  | 'liquorQuality'

export type SectionId =
  | 'category'
  | 'product'
  | 'media'
  | 'sales'
  | 'groupBuy'
  | 'local'
  | 'delivery'
  | 'detail'

export type ProductForm = {
  category: string
  name: string
  price: string
  stock: string
  status: ProductStatus
  salesMethod: SalesMethod
  groupBuyingPrice: string
  surplusQuantity: string
  portionUnit: string
  minimumOrderQuantity: string
  maximumOrderQuantity: string
  recruitEndDate: string
  groupShippingDate: string
  purchaseLimit: string
  failurePolicy: FailurePolicy
  origin: string
  farmName: string
  harvestDate: string
  certificationMarkIds: CertificationMarkId[]
  deliveryMethod: DeliveryMethod
  shippingFee: string
  videoTitle: string
  description: string
}

export type GroupBuyingCampaign = {
  id: string
  source: 'mock' | 'saved'
  status: GroupBuyingStatus
  productName: string
  category: string
  origin: string
  producerName: string
  certificationMarkIds: CertificationMarkId[]
  regularPrice: number
  groupBuyingPrice: number
  surplusQuantity: number
  portionUnit: string
  minimumOrderQuantity: number
  maximumOrderQuantity: number
  currentOrderQuantity: number
  orderCount: number
  recruitEndDate: string
  groupShippingDate: string
  purchaseLimit: number
  failurePolicy: FailurePolicy
  deliveryMethod: DeliveryMethod
  deliveryFee: number
  thumbnail?: string
  createdAt: string
  description?: string
}

export const draftStorageKey = 'nongdam-product-registration-draft'
export const groupBuyingCampaignStorageKey = 'nongdam-group-buying-campaigns'

export const initialProductForm: ProductForm = {
  category: '',
  name: '',
  price: '',
  stock: '',
  status: '판매중',
  salesMethod: '일반판매',
  groupBuyingPrice: '',
  surplusQuantity: '',
  portionUnit: '3kg 박스',
  minimumOrderQuantity: '',
  maximumOrderQuantity: '',
  recruitEndDate: '',
  groupShippingDate: '',
  purchaseLimit: '2',
  failurePolicy: '목표 미달 시 자동 취소',
  origin: '국산',
  farmName: '',
  harvestDate: '',
  certificationMarkIds: [],
  deliveryMethod: '택배배송',
  shippingFee: '3000',
  videoTitle: '',
  description: '',
}

export const topNavigationItems = [
  '상점 정보',
  '상품관리',
  '공동구매',
  '주문관리',
  '정산관리',
]

export const sidebarItems = [
  { label: '상점 정보', icon: 'store' },
  { label: '상품 등록', icon: 'product' },
  { label: '공동구매 등록', icon: 'groupBuy' },
  { label: '상품 조회/수정', icon: 'inventory' },
  { label: '진행중 공동구매', icon: 'chart' },
  { label: '성사/배송 관리', icon: 'delivery' },
  { label: '주문 확인', icon: 'order' },
  { label: '사진 보관함', icon: 'image' },
  { label: '설정', icon: 'settings' },
]

export const quickLinks = [
  { label: '알림', mark: 'A', badge: true, tone: 'slate' },
  { label: '할 일', mark: 'V', badge: true, tone: 'yellow' },
  { label: '가이드', mark: 'G', badge: true, tone: 'mixed' },
  { label: '도움말', mark: '!', badge: false, tone: 'yellow' },
  { label: '문의', mark: 'Q', badge: false, tone: 'brown' },
]

export const categoryModes: Array<{ value: CategoryMode; label: string }> = [
  { value: 'search', label: '카테고리명 검색' },
  { value: 'select', label: '카테고리명 선택' },
  { value: 'template', label: '카테고리 템플릿' },
]

export const categoryOptions = [
  '농산물 > 채소 > 잎채소',
  '농산물 > 채소 > 뿌리채소',
  '농산물 > 과일 > 제철과일',
  '농산물 > 곡물 > 쌀/잡곡',
  '가공식품 > 반찬/절임',
  '가공식품 > 음료/청',
  '축산물 > 정육 > 한우',
  '수산물 > 생선 > 제철생선',
]

export const certificationMarks: Array<{
  id: CertificationMarkId
  label: string
  description: string
  imageSrc: string
}> = [
  {
    id: 'organic',
    label: '친환경농산물(유기농)',
    description: '합성농약과 화학비료를 사용하지 않고 재배한 농산물 인증',
    imageSrc: organicCertification,
  },
  {
    id: 'pesticideFree',
    label: '친환경농산물(무농약)',
    description: '합성농약은 사용하지 않고 화학비료를 최소화한 농산물 인증',
    imageSrc: pesticideFreeCertification,
  },
  {
    id: 'gap',
    label: '농산물우수관리(GAP)',
    description: '농약, 중금속, 미생물 등 위해요소를 사전 관리하는 인증',
    imageSrc: gapCertification,
  },
  {
    id: 'antibioticFree',
    label: '친환경축산물(무항생제)',
    description: '항생제, 항균제, 성장촉진제 사용을 제한한 축산물 인증',
    imageSrc: antibioticFreeCertification,
  },
  {
    id: 'animalWelfare',
    label: '동물복지 축산농장',
    description: '동물의 고통과 스트레스를 최소화한 사육환경 인증',
    imageSrc: animalWelfareCertification,
  },
  {
    id: 'haccp',
    label: 'HACCP',
    description: '생산, 가공, 유통 단계 위해요소를 중점 관리하는 안전관리 인증',
    imageSrc: haccpCertification,
  },
  {
    id: 'organicProcessed',
    label: '유기가공식품',
    description: '유기농산물, 유기축산물 원료로 제조·가공한 식품 인증',
    imageSrc: organicProcessedCertification,
  },
  {
    id: 'geographicalIndication',
    label: '지리적표시제도',
    description: '품질과 명성이 특정 지역의 지리적 특성에 기인함을 표시',
    imageSrc: geographicalIndicationCertification,
  },
  {
    id: 'traditionalFood',
    label: '전통식품 품질 인증',
    description: '국내산 농수산물을 주원료로 만든 우수 전통식품 인증',
    imageSrc: traditionalFoodCertification,
  },
  {
    id: 'foodMaster',
    label: '한국식품명인제도',
    description: '전통식품 계승과 가공기능인의 가치를 인정하는 제도',
    imageSrc: foodMasterCertification,
  },
  {
    id: 'processedFoodKs',
    label: '가공식품 KS인증',
    description: '가공식품 품질과 관련 서비스 표준을 보증하는 인증',
    imageSrc: processedFoodKsCertification,
  },
  {
    id: 'lowCarbon',
    label: '저탄소 농축산물 인증',
    description: '온실가스 배출량을 줄이는 저탄소 농업기술 적용 인증',
    imageSrc: lowCarbonCertification,
  },
  {
    id: 'liquorQuality',
    label: '술 품질인증',
    description: '막걸리, 약주, 청주 등 우리 술의 품질을 보증하는 인증',
    imageSrc: liquorQualityCertification,
  },
]

export const productStatusOptions: Array<{
  value: ProductStatus
  label: string
}> = [
  { value: '판매중', label: '판매중' },
  { value: '판매대기', label: '판매대기' },
]

export const deliveryMethodOptions: Array<{
  value: DeliveryMethod
  label: string
}> = [
  { value: '택배배송', label: '택배배송' },
  { value: '직접배송', label: '직접배송' },
  { value: '예약수령', label: '예약수령' },
]

export const failurePolicyOptions: Array<{
  value: FailurePolicy
  label: string
}> = [
  { value: '목표 미달 시 자동 취소', label: '목표 미달 시 자동 취소' },
  { value: '판매자 확인 후 진행', label: '판매자 확인 후 진행' },
]

export const groupBuyingStatusFilters: Array<GroupBuyingStatus | '전체'> = [
  '전체',
  '모집중',
  '마감임박',
  '성사',
  '목표미달',
  '배송준비',
]

export const mockGroupBuyingCampaigns: GroupBuyingCampaign[] = [
  {
    id: 'mock-tomato-001',
    source: 'mock',
    status: '모집중',
    productName: '못난이 토마토 잔여수확 공동구매',
    category: '농산물 > 채소 > 과채류',
    origin: '전남 담양',
    producerName: '담양 새벽농장',
    certificationMarkIds: ['gap'],
    regularPrice: 18000,
    groupBuyingPrice: 12900,
    surplusQuantity: 120,
    portionUnit: '2kg 박스',
    minimumOrderQuantity: 40,
    maximumOrderQuantity: 60,
    currentOrderQuantity: 32,
    orderCount: 28,
    recruitEndDate: '2026-06-02',
    groupShippingDate: '2026-06-04',
    purchaseLimit: 2,
    failurePolicy: '목표 미달 시 자동 취소',
    deliveryMethod: '택배배송',
    deliveryFee: 3000,
    thumbnail: tomatoGroupPurchase,
    createdAt: '2026-05-28T09:00:00.000Z',
    description: '담양 새벽농장에서 수확한 완숙 토마토를 2kg 단위로 소분 배송합니다.',
  },
  {
    id: 'mock-potato-001',
    source: 'mock',
    status: '성사',
    productName: '햇감자 잔여수확 공동구매',
    category: '농산물 > 채소 > 뿌리채소',
    origin: '전남 담양',
    producerName: '담양 새벽농장',
    certificationMarkIds: ['lowCarbon'],
    regularPrice: 22000,
    groupBuyingPrice: 15900,
    surplusQuantity: 200,
    portionUnit: '5kg 박스',
    minimumOrderQuantity: 30,
    maximumOrderQuantity: 40,
    currentOrderQuantity: 36,
    orderCount: 31,
    recruitEndDate: '2026-05-30',
    groupShippingDate: '2026-06-01',
    purchaseLimit: 1,
    failurePolicy: '판매자 확인 후 진행',
    deliveryMethod: '택배배송',
    deliveryFee: 3500,
    thumbnail: potatoGroupPurchase,
    createdAt: '2026-05-25T11:30:00.000Z',
    description: '같은 농가 밭에서 수확한 중소과 감자를 가정용 박스로 구성했습니다.',
  },
  {
    id: 'mock-apple-001',
    source: 'mock',
    status: '목표미달',
    productName: '못난이 단감 소분 공동구매',
    category: '농산물 > 과일 > 제철과일',
    origin: '전남 담양',
    producerName: '담양 새벽농장',
    certificationMarkIds: ['organic', 'gap'],
    regularPrice: 24000,
    groupBuyingPrice: 17900,
    surplusQuantity: 150,
    portionUnit: '3kg 박스',
    minimumOrderQuantity: 50,
    maximumOrderQuantity: 70,
    currentOrderQuantity: 18,
    orderCount: 16,
    recruitEndDate: '2026-05-27',
    groupShippingDate: '2026-05-31',
    purchaseLimit: 2,
    failurePolicy: '목표 미달 시 자동 취소',
    deliveryMethod: '택배배송',
    deliveryFee: 3000,
    thumbnail: persimmonGroupPurchase,
    createdAt: '2026-05-23T13:10:00.000Z',
    description: '담양 새벽농장 과수 구역에서 수확한 크기 혼합 단감입니다.',
  },
  {
    id: 'mock-strawberry-001',
    source: 'mock',
    status: '마감임박',
    productName: '완숙 딸기 당일수확 공동구매',
    category: '농산물 > 과일 > 제철과일',
    origin: '전남 담양',
    producerName: '담양 새벽농장',
    certificationMarkIds: ['pesticideFree'],
    regularPrice: 26000,
    groupBuyingPrice: 19900,
    surplusQuantity: 80,
    portionUnit: '1kg 박스',
    minimumOrderQuantity: 45,
    maximumOrderQuantity: 55,
    currentOrderQuantity: 41,
    orderCount: 39,
    recruitEndDate: '2026-05-29',
    groupShippingDate: '2026-05-30',
    purchaseLimit: 3,
    failurePolicy: '판매자 확인 후 진행',
    deliveryMethod: '택배배송',
    deliveryFee: 3000,
    thumbnail: strawberryGroupPurchase,
    createdAt: '2026-05-27T08:20:00.000Z',
    description: '마감 후 바로 선별해 익일 도착을 목표로 발송합니다.',
  },
  {
    id: 'mock-onion-001',
    source: 'mock',
    status: '배송준비',
    productName: '양파 잔여수확 공동구매',
    category: '농산물 > 채소 > 뿌리채소',
    origin: '전남 담양',
    producerName: '담양 새벽농장',
    certificationMarkIds: [],
    regularPrice: 17000,
    groupBuyingPrice: 11900,
    surplusQuantity: 300,
    portionUnit: '5kg 망',
    minimumOrderQuantity: 35,
    maximumOrderQuantity: 50,
    currentOrderQuantity: 50,
    orderCount: 46,
    recruitEndDate: '2026-05-26',
    groupShippingDate: '2026-05-29',
    purchaseLimit: 2,
    failurePolicy: '목표 미달 시 자동 취소',
    deliveryMethod: '택배배송',
    deliveryFee: 3000,
    thumbnail: onionGroupPurchase,
    createdAt: '2026-05-22T10:00:00.000Z',
    description: '소분 포장 후 배송 준비 중인 담양 새벽농장 양파 공동구매입니다.',
  },
]
