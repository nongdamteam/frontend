import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import {
  categoryModes,
  categoryOptions,
  certificationMarks,
  deliveryMethodOptions,
  draftStorageKey,
  failurePolicyOptions,
  initialProductForm,
  mockGroupBuyingCampaigns,
  productStatusOptions,
  quickLinks,
  sidebarItems,
  topNavigationItems,
} from '../../config/productRegistrationConfig'
import type {
  CategoryMode,
  CertificationMarkId,
  DeliveryMethod,
  FailurePolicy,
  GroupBuyingCampaign,
  ProductForm,
  ProductStatus,
  SalesMethod,
  SectionId,
} from '../../config/productRegistrationConfig'
import nongdamLogo from '../../assets/nongdam-logo.svg'
import { ActiveGroupBuyingPage } from './ActiveGroupBuyingPage'
import {
  prependStoredGroupBuyingCampaign,
  readStoredGroupBuyingCampaigns,
} from '../../services/storage/groupBuyingCampaignStorage'
import type { AppView } from '../../app/appTypes'
import { appendCommerceProduct } from '../../services/mockDb/commerceDummyData'

type FeedbackTone = 'info' | 'success' | 'error'

type Feedback = {
  tone: FeedbackTone
  text: string
}

type FormSectionProps = {
  id: SectionId
  title: string
  required?: boolean
  help?: string
  summary?: string
  isOpen: boolean
  onToggle: (id: SectionId) => void
  children: ReactNode
}

type FormLineProps = {
  label: string
  required?: boolean
  children: ReactNode
}

type MediaItem = {
  id: string
  name: string
  url: string
}

type SidebarItem = (typeof sidebarItems)[number]
type ActiveView = 'registration' | 'activeGroupBuys'

let mediaIdSequence = 0

const defaultOpenSections = new Set<SectionId>([
  'category',
  'product',
  'media',
  'sales',
  'groupBuy',
  'local',
  'delivery',
  'detail',
])

function readDraft(): ProductForm {
  try {
    const savedDraft = localStorage.getItem(draftStorageKey)
    if (!savedDraft) {
      return initialProductForm
    }

    return {
      ...initialProductForm,
      ...(JSON.parse(savedDraft) as Partial<ProductForm>),
    }
  } catch {
    return initialProductForm
  }
}

function toNumber(value: string) {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function createCampaignId() {
  return `saved-groupbuy-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`
}

function createGroupBuyingCampaignFromForm(
  form: ProductForm,
  thumbnail?: string,
): GroupBuyingCampaign {
  return {
    id: createCampaignId(),
    source: 'saved',
    status: '모집중',
    productName: form.name.trim(),
    category: form.category,
    origin: form.origin.trim(),
    producerName: form.farmName.trim() || '농담 판매자',
    certificationMarkIds: form.certificationMarkIds,
    regularPrice: toNumber(form.price),
    groupBuyingPrice: toNumber(form.groupBuyingPrice),
    surplusQuantity: toNumber(form.surplusQuantity),
    portionUnit: form.portionUnit.trim(),
    minimumOrderQuantity: toNumber(form.minimumOrderQuantity),
    maximumOrderQuantity: toNumber(form.maximumOrderQuantity),
    currentOrderQuantity: 0,
    orderCount: 0,
    recruitEndDate: form.recruitEndDate,
    groupShippingDate: form.groupShippingDate,
    purchaseLimit: toNumber(form.purchaseLimit),
    failurePolicy: form.failurePolicy,
    deliveryMethod: form.deliveryMethod,
    deliveryFee: toNumber(form.shippingFee),
    thumbnail,
    createdAt: new Date().toISOString(),
    description: form.description.trim(),
  }
}

function RequiredDot() {
  return (
    <>
      <span className="required-dot" aria-hidden="true" />
      <span className="sr-only">필수</span>
    </>
  )
}

function GlobalHeader({ onNavigate }: { onNavigate?: (view: AppView) => void }) {
  return (
    <header className="global-header">
      <div className="global-header__brand">
        <img src={nongdamLogo} alt="" />
        <strong>농담 파트너센터</strong>
      </div>
      <nav className="global-nav" aria-label="상단 메뉴">
        {topNavigationItems.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => {
              if (item === '상점 정보') {
                onNavigate?.('store-info')
              }
              if (item === '상품관리') {
                onNavigate?.('product-register')
              }
              if (item === '공동구매') {
                onNavigate?.('group-buy-register')
              }
            }}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="global-user">
        <strong>woonggi4283</strong>
        <span>님</span>
        <button type="button" className="user-badge">
          내정보
        </button>
        <button type="button" className="logout-button">
          로그아웃
        </button>
      </div>
    </header>
  )
}

function SidebarIcon({ name }: { name: SidebarItem['icon'] }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
  }

  return (
    <svg
      className="side-nav__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...commonProps}
    >
      {name === 'product' && (
        <>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6.5 9.5V20h11V9.5" />
          <path d="M10 20v-6h4v6" />
        </>
      )}
      {name === 'groupBuy' && (
        <>
          <path d="M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M3.5 20a4.5 4.5 0 0 1 7 0" />
          <path d="M13.5 20a4.5 4.5 0 0 1 7 0" />
        </>
      )}
      {name === 'inventory' && (
        <>
          <path d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z" />
          <path d="M4 7.5v9L12 21l8-4.5v-9" />
          <path d="M12 12v9" />
        </>
      )}
      {name === 'chart' && (
        <>
          <path d="M4 19h16" />
          <path d="M7 16v-4" />
          <path d="M12 16V7" />
          <path d="M17 16v-7" />
        </>
      )}
      {name === 'delivery' && (
        <>
          <path d="M4 7h10v9H4z" />
          <path d="M14 10h3l3 3v3h-6" />
          <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </>
      )}
      {name === 'order' && (
        <>
          <path d="M7 5h10v16H7z" />
          <path d="M9 3h6l1 2H8l1-2Z" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
        </>
      )}
      {name === 'image' && (
        <>
          <path d="M4 5h16v14H4z" />
          <path d="m4 16 4.5-4.5 3.5 3.5 2-2 6 6" />
          <path d="M16 9.5h.01" />
        </>
      )}
      {name === 'settings' && (
        <>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19 12h2" />
          <path d="M3 12h2" />
          <path d="m17 17 1.4 1.4" />
          <path d="m5.6 5.6 1.4 1.4" />
          <path d="m17 7 1.4-1.4" />
          <path d="m5.6 18.4 1.4-1.4" />
        </>
      )}
      {name === 'store' && (
        <>
          <path d="M5 10.5h14" />
          <path d="M6 10.5V19h12v-8.5" />
          <path d="M4.5 10.5 6 5h12l1.5 5.5" />
          <path d="M8.2 14h7.6" />
        </>
      )}
    </svg>
  )
}

function Sidebar({
  activeItem,
  onSelectItem,
}: {
  activeItem: string
  onSelectItem: (item: string) => void
}) {
  return (
    <aside className="side-panel" aria-label="상품 관리 메뉴">
      <div className="side-profile-card">
        <div className="side-profile-card__avatar" aria-hidden="true">
          웅
        </div>
        <div className="side-profile-card__text">
          <strong>웅찬하리보</strong>
          <span>통합 매니저</span>
        </div>
        <button type="button" aria-label="내정보">
          내정보
        </button>
      </div>

      <nav className="side-nav">
        {sidebarItems.map((item) => (
          <button
            type="button"
            key={item.label}
            className={item.label === activeItem ? 'side-nav__item is-active' : 'side-nav__item'}
            aria-current={item.label === activeItem ? 'page' : undefined}
            onClick={() => onSelectItem(item.label)}
          >
            <SidebarIcon name={item.icon} />
            <span>{item.label}</span>
            {item.label === activeItem && (
              <span className="side-nav__arrow" aria-hidden="true">
                ›
              </span>
            )}
          </button>
        ))}
      </nav>

      <button type="button" className="side-visit-button">
        사이트 방문
      </button>
    </aside>
  )
}

function QuickRail() {
  return (
    <aside className="quick-rail" aria-label="바로가기">
      {quickLinks.map((link) => (
        <button type="button" key={link.label} className="quick-rail__item">
          <span className={`quick-rail__icon quick-rail__icon--${link.tone}`}>
            {link.mark}
            {link.badge && <span className="new-badge">NEW</span>}
          </span>
          <span>{link.label}</span>
        </button>
      ))}
    </aside>
  )
}

function PageHeader({
  title,
  feedback,
  showRegistrationActions,
  isSidebarCollapsed,
  onToggleSidebar,
}: {
  title: string
  feedback: Feedback
  showRegistrationActions: boolean
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}) {
  return (
    <div className="page-header">
      <button
        type="button"
        className="back-button"
        aria-label={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
        aria-pressed={isSidebarCollapsed}
        onClick={onToggleSidebar}
      >
        <span
          className={
            isSidebarCollapsed
              ? 'chevron chevron--right'
              : 'chevron chevron--left'
          }
          aria-hidden="true"
        />
      </button>

      <div className="page-header__main">
        <div className="page-title-row">
          <h1>{title}</h1>
          {showRegistrationActions && (
            <span className="required-guide">
              <RequiredDot />
              필수항목
            </span>
          )}
        </div>

        {showRegistrationActions && (
          <div className="page-actions">
            <button type="button" className="guide-button guide-button--muted">
              {title === '공동구매 등록'
                ? '수확 잔량 계산 가이드'
                : '상품 등록 가이드'}
            </button>
            <button type="button" className="guide-button guide-button--accent">
              {title === '공동구매 등록'
                ? '공동구매 운영 가이드'
                : '상품 운영 가이드'}
            </button>
          </div>
        )}
      </div>

      <span className={`feedback feedback--${feedback.tone}`} role="status">
        {feedback.text}
      </span>
    </div>
  )
}

function FormSection({
  id,
  title,
  required,
  help,
  summary,
  isOpen,
  onToggle,
  children,
}: FormSectionProps) {
  const panelId = `${id}-section-panel`

  return (
    <section className="form-section">
      <header className="form-section__header">
        <div className="form-section__title">
          <h2>
            {title}
            {required && <RequiredDot />}
          </h2>
          {help && (
            <button type="button" className="help-button" title={help}>
              ?
            </button>
          )}
        </div>
        <div className="form-section__tools">
          {summary && <span>{summary}</span>}
          <button
            type="button"
            className="section-toggle"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => onToggle(id)}
          >
            <span
              className={
                isOpen ? 'chevron chevron--up' : 'chevron chevron--down'
              }
              aria-hidden="true"
            />
          </button>
        </div>
      </header>
      {isOpen && (
        <div className="form-section__body" id={panelId}>
          {children}
        </div>
      )}
    </section>
  )
}

function FormLine({ label, required, children }: FormLineProps) {
  return (
    <div className="form-line">
      <div className="form-line__label">
        <span>{label}</span>
        {required && <RequiredDot />}
      </div>
      <div className="form-line__control">{children}</div>
    </div>
  )
}

type SegmentedControlProps<T extends string> = {
  name: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}

function SegmentedControl<T extends string>({
  name,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented-control" role="group" aria-label={name}>
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          className={value === option.value ? 'is-active' : undefined}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function createMediaItemId(file: File) {
  const randomId =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${mediaIdSequence++}`

  return `${file.name}-${file.size}-${file.lastModified}-${randomId}`
}

function createMediaItems(files: File[]) {
  return files.map((file) => ({
    id: createMediaItemId(file),
    name: file.name,
    url: URL.createObjectURL(file),
  }))
}

function MediaUploadTile({
  id,
  label,
  multiple,
  accept,
  onChange,
}: {
  id: string
  label: string
  multiple?: boolean
  accept: string
  onChange: (files: File[]) => void
}) {
  return (
    <label className="media-upload-tile" htmlFor={id}>
      <span aria-hidden="true">+</span>
      <strong>{label}</strong>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          onChange(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
      />
    </label>
  )
}

function MediaPreviewTile({
  item,
  type = 'image',
  onRemove,
}: {
  item: MediaItem
  type?: 'image' | 'video'
  onRemove: () => void
}) {
  return (
    <div className="media-preview-tile">
      {type === 'video' ? (
        <video src={item.url} muted playsInline controls />
      ) : (
        <img src={item.url} alt="" />
      )}
      <div className="media-preview-tile__meta">
        <span>{item.name}</span>
        <button type="button" onClick={onRemove}>
          삭제
        </button>
      </div>
    </div>
  )
}

function ProductRegistrationPage({
  initialMode = '일반판매',
  onNavigate,
}: {
  initialMode?: SalesMethod
  onNavigate?: (view: AppView) => void
}) {
  const [form, setForm] = useState<ProductForm>(readDraft)
  const [activeView, setActiveView] = useState<ActiveView>('registration')
  const [storedGroupBuyingCampaigns, setStoredGroupBuyingCampaigns] = useState<
    GroupBuyingCampaign[]
  >(readStoredGroupBuyingCampaigns)
  const objectUrls = useRef<Set<string>>(new Set())
  const [openSections, setOpenSections] = useState(defaultOpenSections)
  const [categoryMode, setCategoryMode] = useState<CategoryMode>('search')
  const [categoryKeyword, setCategoryKeyword] = useState('')
  const [useTemplate, setUseTemplate] = useState(false)
  const [representativeImage, setRepresentativeImage] =
    useState<MediaItem | null>(null)
  const [additionalImages, setAdditionalImages] = useState<MediaItem[]>([])
  const [productVideo, setProductVideo] = useState<MediaItem | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>({
    tone: 'info',
    text: '필수 정보를 입력한 뒤 저장하세요.',
  })

  const filteredCategories = useMemo(() => {
    const keyword = categoryKeyword.trim()
    if (!keyword) {
      return categoryOptions
    }

    return categoryOptions.filter((category) => category.includes(keyword))
  }, [categoryKeyword])

  const formattedPrice = form.price
    ? `${Number(form.price).toLocaleString('ko-KR')}원`
    : '판매가 미입력'

  const formattedShippingFee =
    form.shippingFee === '0'
      ? '무료배송'
      : form.shippingFee
        ? `${Number(form.shippingFee).toLocaleString('ko-KR')}원`
        : '배송비 미입력'

  const isGroupBuying = form.salesMethod === '잔여수확 공동구매'
  const activeSidebarItem =
    activeView === 'activeGroupBuys'
      ? '진행중 공동구매'
      : isGroupBuying
        ? '공동구매 등록'
        : '상품 등록'
  const pageTitle =
    activeView === 'activeGroupBuys'
      ? '진행 중 공동구매'
      : isGroupBuying
        ? '공동구매 등록'
        : '상품 등록'

  const formattedGroupBuyingPrice = form.groupBuyingPrice
    ? `${Number(form.groupBuyingPrice).toLocaleString('ko-KR')}원`
    : '공동구매가 미입력'

  const groupBuyingSummary = isGroupBuying
    ? `${form.minimumOrderQuantity || '-'}건 성사 · ${form.portionUnit || '소분 단위 미정'}`
    : '일반판매'

  const selectedCertificationLabels = certificationMarks
    .filter((mark) => form.certificationMarkIds.includes(mark.id))
    .map((mark) => mark.label)

  const mediaSummary = representativeImage
    ? `대표 1개 · 추가 ${additionalImages.length}/9`
    : `대표 미등록 · 추가 ${additionalImages.length}/9`
  const activeGroupBuyingCampaigns = useMemo(
    () => [...storedGroupBuyingCampaigns, ...mockGroupBuyingCampaigns],
    [storedGroupBuyingCampaigns],
  )

  useEffect(() => {
    const objectUrlSet = objectUrls.current

    return () => {
      objectUrlSet.forEach((url) => URL.revokeObjectURL(url))
      objectUrlSet.clear()
    }
  }, [])

  useEffect(() => {
    setForm((currentForm) => {
      if (currentForm.salesMethod === initialMode) {
        return currentForm
      }

      return {
        ...currentForm,
        salesMethod: initialMode,
      }
    })
  }, [initialMode])

  const updateField = <Field extends keyof ProductForm>(
    field: Field,
    value: ProductForm[Field],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const registerMediaItems = (items: MediaItem[]) => {
    items.forEach((item) => objectUrls.current.add(item.url))
    return items
  }

  const revokeMediaItem = (item: MediaItem) => {
    URL.revokeObjectURL(item.url)
    objectUrls.current.delete(item.url)
  }

  const clearRegisteredMedia = () => {
    if (representativeImage) {
      revokeMediaItem(representativeImage)
    }

    additionalImages.forEach(revokeMediaItem)

    if (productVideo) {
      revokeMediaItem(productVideo)
    }

    setRepresentativeImage(null)
    setAdditionalImages([])
    setProductVideo(null)
  }

  const resetRegistrationForm = (salesMethod: SalesMethod) => {
    clearRegisteredMedia()
    localStorage.removeItem(draftStorageKey)
    setForm({
      ...initialProductForm,
      salesMethod,
    })
    setCategoryKeyword('')
    setCategoryMode('search')
    setUseTemplate(false)
    setShowPreview(false)
    setOpenSections(
      new Set(
        salesMethod === '잔여수확 공동구매'
          ? defaultOpenSections
          : [...defaultOpenSections].filter((section) => section !== 'groupBuy'),
      ),
    )
  }

  const toggleSection = (sectionId: SectionId) => {
    setOpenSections((currentSections) => {
      const nextSections = new Set(currentSections)
      if (nextSections.has(sectionId)) {
        nextSections.delete(sectionId)
      } else {
        nextSections.add(sectionId)
      }
      return nextSections
    })
  }

  const saveDraft = () => {
    localStorage.setItem(draftStorageKey, JSON.stringify(form))
    setFeedback({ tone: 'success', text: '임시저장되었습니다.' })
  }

  const handlePreview = () => {
    setShowPreview((currentValue) => !currentValue)
    setFeedback({
      tone: 'info',
      text: showPreview ? '미리보기를 닫았습니다.' : '미리보기를 표시합니다.',
    })
  }

  const handleSidebarSelect = (item: string) => {
    if (item === '상품 등록') {
      setActiveView('registration')
      resetRegistrationForm('일반판매')
      setFeedback({
        tone: 'info',
        text: '새 상품 등록을 시작합니다.',
      })
      return
    }

    if (item === '공동구매 등록') {
      setActiveView('registration')
      resetRegistrationForm('잔여수확 공동구매')
      setFeedback({
        tone: 'info',
        text: '새 공동구매 등록을 시작합니다.',
      })
      return
    }

    if (item === '진행중 공동구매') {
      setStoredGroupBuyingCampaigns(readStoredGroupBuyingCampaigns())
      setActiveView('activeGroupBuys')
      setFeedback({
        tone: 'info',
        text: '진행 중인 공동구매 모집 현황을 확인합니다.',
      })
      return
    }

    if (item === '상점 정보') {
      onNavigate?.('store-info')
      setFeedback({
        tone: 'info',
        text: '상점 정보 화면으로 이동합니다.',
      })
      return
    }

    if (item === '상품 조회/수정') {
      onNavigate?.('product-inquiry')
      setFeedback({
        tone: 'info',
        text: '상품 조회/수정 화면으로 이동합니다.',
      })
      return
    }

    setFeedback({
      tone: 'info',
      text: `${item} 기능은 MVP 범위 밖입니다.`,
    })
  }

  const toggleCertificationMark = (markId: CertificationMarkId) => {
    setForm((currentForm) => {
      const hasMark = currentForm.certificationMarkIds.includes(markId)

      return {
        ...currentForm,
        certificationMarkIds: hasMark
          ? currentForm.certificationMarkIds.filter((id) => id !== markId)
          : [...currentForm.certificationMarkIds, markId],
      }
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (
      !form.category ||
      !form.name.trim() ||
      !representativeImage ||
      !form.price ||
      !form.stock ||
      !form.origin.trim()
    ) {
      setFeedback({
        tone: 'error',
        text: '카테고리, 상품명, 대표이미지, 판매가, 재고, 원산지는 필수입니다.',
      })
      setOpenSections((currentSections) => {
        const nextSections = new Set(currentSections)
        nextSections.add('category')
        nextSections.add('product')
        nextSections.add('media')
        nextSections.add('sales')
        nextSections.add('local')
        return nextSections
      })
      return
    }

    if (
      isGroupBuying &&
      (!form.groupBuyingPrice ||
        !form.surplusQuantity ||
        !form.portionUnit.trim() ||
        !form.minimumOrderQuantity ||
        !form.maximumOrderQuantity ||
        !form.recruitEndDate ||
        !form.groupShippingDate)
    ) {
      setFeedback({
        tone: 'error',
        text: '공동구매가, 잔여 물량, 소분 단위, 성사 기준, 모집 마감일, 배송 예정일은 필수입니다.',
      })
      setOpenSections((currentSections) => {
        const nextSections = new Set(currentSections)
        nextSections.add('groupBuy')
        return nextSections
      })
      return
    }

    if (
      isGroupBuying &&
      Number(form.minimumOrderQuantity) > Number(form.maximumOrderQuantity)
    ) {
      setFeedback({
        tone: 'error',
        text: '최소 성사 수량은 최대 판매 수량보다 클 수 없습니다.',
      })
      setOpenSections((currentSections) => {
        const nextSections = new Set(currentSections)
        nextSections.add('groupBuy')
        return nextSections
      })
      return
    }

    appendCommerceProduct({
      name: form.name,
      category: form.category,
      status: form.status as '판매중' | '판매대기',
      price: isGroupBuying ? form.groupBuyingPrice || form.price : form.price,
      stock: form.stock,
      shippingFee: form.shippingFee,
      shortDescription: form.description || form.name,
      detailDescription: form.description || form.name,
      imageSrc: representativeImage.url,
    })

    if (isGroupBuying) {
      const nextCampaign = createGroupBuyingCampaignFromForm(
        form,
        representativeImage.url,
      )
      prependStoredGroupBuyingCampaign(nextCampaign)
      setStoredGroupBuyingCampaigns((currentCampaigns) => [
        nextCampaign,
        ...currentCampaigns,
      ])
      setActiveView('activeGroupBuys')
      setShowPreview(false)
    } else {
      setShowPreview(true)
    }

    localStorage.removeItem(draftStorageKey)
    setFeedback({
      tone: 'success',
      text: isGroupBuying
        ? '공동구매가 저장되어 진행 중 공동구매에 추가되었습니다.'
        : '상품 등록 정보가 저장되었습니다.',
    })
  }

  return (
    <div className="commerce-shell">
      <GlobalHeader onNavigate={onNavigate} />
      <div
        className={
          isSidebarCollapsed
            ? 'commerce-body is-sidebar-collapsed'
            : 'commerce-body'
        }
      >
        <Sidebar
          activeItem={activeSidebarItem}
          onSelectItem={handleSidebarSelect}
        />
        <main className="product-workspace">
          <PageHeader
            title={pageTitle}
            feedback={feedback}
            showRegistrationActions={activeView === 'registration'}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() =>
              setIsSidebarCollapsed((currentValue) => !currentValue)
            }
          />

          {activeView === 'activeGroupBuys' ? (
            <ActiveGroupBuyingPage campaigns={activeGroupBuyingCampaigns} />
          ) : (
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-stack">
              <FormSection
                id="category"
                title="카테고리"
                required
                help="상품과 가장 잘 맞는 최종 카테고리를 선택하세요."
                isOpen={openSections.has('category')}
                onToggle={toggleSection}
              >
                <div className="category-toolbar">
                  <div className="category-tabs" role="tablist">
                    {categoryModes.map((mode) => (
                      <button
                        type="button"
                        key={mode.value}
                        className={
                          categoryMode === mode.value ? 'is-active' : undefined
                        }
                        onClick={() => setCategoryMode(mode.value)}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                  <label className="check-option">
                    <input
                      type="checkbox"
                      checked={useTemplate}
                      onChange={(event) => setUseTemplate(event.target.checked)}
                    />
                    템플릿 추가
                  </label>
                </div>

                <label className="sr-only" htmlFor="categoryKeyword">
                  카테고리명 입력
                </label>
                <div className="search-field">
                  <input
                    id="categoryKeyword"
                    value={categoryKeyword}
                    onChange={(event) => setCategoryKeyword(event.target.value)}
                    placeholder="카테고리명 입력"
                  />
                  <span aria-hidden="true" />
                </div>

                <p className="field-alert">
                  최종 카테고리까지 선택해 주세요.
                </p>
                <p className="field-note field-note--accent">
                  상품과 맞지 않는 카테고리에 등록할 경우 강제 이동되거나
                  판매중지, 판매금지 될 수 있습니다.
                </p>

                <div className="category-result-list">
                  {filteredCategories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={
                        form.category === category
                          ? 'category-result is-selected'
                          : 'category-result'
                      }
                      onClick={() => updateField('category', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {form.category && (
                  <div className="selected-category">
                    <span>선택 카테고리</span>
                    <strong>{form.category}</strong>
                  </div>
                )}
              </FormSection>

              <FormSection
                id="product"
                title="상품명"
                required
                help="검색 최적화 가이드에 맞춰 정확한 상품명을 입력하세요."
                isOpen={openSections.has('product')}
                onToggle={toggleSection}
              >
                <FormLine label="상품명" required>
                  <div className="count-input">
                    <input
                      value={form.name}
                      maxLength={100}
                      onChange={(event) =>
                        updateField('name', event.target.value)
                      }
                      placeholder="상품명을 입력하세요"
                    />
                    <span>
                      <strong>{form.name.length}</strong>/100
                    </span>
                  </div>
                  <p className="field-note field-note--accent">
                    상품명을 검색최적화 가이드에 맞게 입력하면 검색 노출에
                    도움이 될 수 있으며, 가이드에 맞지 않을 경우 별도 고지 없이
                    제재될 수 있습니다.
                  </p>
                  <button type="button" className="text-link">
                    검색 SEO 가이드
                  </button>
                </FormLine>
              </FormSection>

              <FormSection
                id="media"
                title="상품이미지/동영상"
                required
                help="대표이미지는 검색과 목록에서 가장 먼저 보이는 이미지입니다."
                summary={mediaSummary}
                isOpen={openSections.has('media')}
                onToggle={toggleSection}
              >
                <div className="media-section-grid">
                  <FormLine label="대표이미지" required>
                    <div className="media-upload-row media-upload-row--single">
                      {representativeImage ? (
                        <MediaPreviewTile
                          item={representativeImage}
                          onRemove={() => {
                            revokeMediaItem(representativeImage)
                            setRepresentativeImage(null)
                          }}
                        />
                      ) : (
                        <MediaUploadTile
                          id="representativeImage"
                          label="대표이미지 등록"
                          accept="image/*"
                          onChange={(files) => {
                            const [firstFile] = files
                            if (!firstFile) {
                              return
                            }

                            const [nextImage] = registerMediaItems(
                              createMediaItems([firstFile]),
                            )
                            setRepresentativeImage((currentImage) => {
                              if (currentImage) {
                                revokeMediaItem(currentImage)
                              }
                              return nextImage
                            })
                          }}
                        />
                      )}
                    </div>
                    <div className="media-guide">
                      <strong>권장 크기</strong>
                      <span>1000 x 1000, 최소 300 x 300 이상</span>
                      <span>상품이 선명하게 보이는 정사각형 이미지를 권장합니다.</span>
                    </div>
                  </FormLine>

                  <FormLine label={`추가이미지 (${additionalImages.length}/9)`}>
                    <div className="media-upload-row">
                      {additionalImages.map((image) => (
                        <MediaPreviewTile
                          key={image.id}
                          item={image}
                          onRemove={() => {
                            revokeMediaItem(image)
                            setAdditionalImages((currentImages) =>
                              currentImages.filter(
                                (currentImage) => currentImage.id !== image.id,
                              ),
                            )
                          }}
                        />
                      ))}
                      {additionalImages.length < 9 && (
                        <MediaUploadTile
                          id="additionalImages"
                          label="추가이미지"
                          accept="image/*"
                          multiple
                          onChange={(files) => {
                            const availableCount = 9 - additionalImages.length
                            const acceptedFiles = files.slice(0, availableCount)
                            if (acceptedFiles.length === 0) {
                              return
                            }

                            const nextImages = registerMediaItems(
                              createMediaItems(acceptedFiles),
                            )
                            setAdditionalImages((currentImages) => [
                              ...currentImages,
                              ...nextImages,
                            ])

                            if (files.length > availableCount) {
                              setFeedback({
                                tone: 'error',
                                text: '추가이미지는 최대 9개까지 등록할 수 있습니다.',
                              })
                            }
                          }}
                        />
                      )}
                    </div>
                    <div className="media-guide">
                      <span>추가이미지는 최대 9개까지 설정할 수 있습니다.</span>
                      <span>jpg, jpeg, png, gif, bmp 형식을 권장합니다.</span>
                    </div>
                  </FormLine>

                  <FormLine label="동영상">
                    <div className="media-upload-row media-upload-row--single">
                      {productVideo ? (
                        <MediaPreviewTile
                          item={productVideo}
                          type="video"
                          onRemove={() => {
                            revokeMediaItem(productVideo)
                            setProductVideo(null)
                          }}
                        />
                      ) : (
                        <MediaUploadTile
                          id="productVideo"
                          label="동영상 등록"
                          accept="video/*"
                          onChange={(files) => {
                            const [firstFile] = files
                            if (!firstFile) {
                              return
                            }

                            const [nextVideo] = registerMediaItems(
                              createMediaItems([firstFile]),
                            )
                            setProductVideo((currentVideo) => {
                              if (currentVideo) {
                                revokeMediaItem(currentVideo)
                              }
                              return nextVideo
                            })
                          }}
                        />
                      )}
                    </div>
                    <div className="inline-control media-title-control">
                      <input
                        className="text-input"
                        maxLength={20}
                        value={form.videoTitle}
                        disabled={!productVideo}
                        onChange={(event) =>
                          updateField('videoTitle', event.target.value)
                        }
                        placeholder="동영상 타이틀 입력"
                      />
                      <span className="input-count">
                        <strong>{form.videoTitle.length}</strong>/20
                      </span>
                    </div>
                    <div className="media-guide">
                      <span>권장 동영상 길이: 최대 1분</span>
                      <span>상품 특징, 수확 과정, 포장 상태를 짧게 보여주세요.</span>
                    </div>
                  </FormLine>
                </div>
              </FormSection>

              <FormSection
                id="sales"
                title="판매 정보"
                required
                summary={formattedPrice}
                isOpen={openSections.has('sales')}
                onToggle={toggleSection}
              >
                <FormLine label="판매가" required>
                  <div className="price-input">
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) =>
                        updateField('price', event.target.value)
                      }
                      placeholder="숫자만 입력"
                    />
                    <span>원</span>
                  </div>
                  <p className="field-note field-note--accent">
                    농담 마켓을 통한 거래 시 주문관리/판매 수수료 및 그 외
                    수수료가 부과될 수 있습니다.
                  </p>
                </FormLine>

                <FormLine label="재고수량" required>
                  <div className="price-input quantity-input">
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(event) => updateField('stock', event.target.value)}
                      placeholder="숫자만 입력"
                    />
                    <span>개</span>
                  </div>
                </FormLine>

                <FormLine label="판매상태">
                  <SegmentedControl<ProductStatus>
                    name="productStatus"
                    value={form.status}
                    options={productStatusOptions}
                    onChange={(value) => updateField('status', value)}
                  />
                </FormLine>
              </FormSection>

              {isGroupBuying && (
                <FormSection
                  id="groupBuy"
                  title="공동구매 설정"
                  required
                  help="공판장 납품 후 남은 수확량을 목표 수요가 모였을 때 소분 배송하는 방식입니다."
                  summary={groupBuyingSummary}
                  isOpen={openSections.has('groupBuy')}
                  onToggle={toggleSection}
                >
                  <div className="groupbuy-intro">
                    <strong>잔여수확 공동구매</strong>
                    <span>
                      정해진 수요 이상이 모이면 공동구매가 성사되고, 판매자가
                      소분 포장 후 개별 배송합니다.
                    </span>
                  </div>

                  <FormLine label="공동구매가" required>
                    <div className="price-input">
                      <input
                        type="number"
                        min="0"
                        value={form.groupBuyingPrice}
                        onChange={(event) =>
                          updateField('groupBuyingPrice', event.target.value)
                        }
                        placeholder="숫자만 입력"
                      />
                      <span>원</span>
                    </div>
                  </FormLine>

                    <FormLine label="잔여 물량" required>
                      <div className="field-grid field-grid--two">
                        <input
                          className="text-input"
                          type="number"
                          min="0"
                          value={form.surplusQuantity}
                          onChange={(event) =>
                            updateField('surplusQuantity', event.target.value)
                          }
                          placeholder="총 잔여 물량"
                        />
                        <input
                          className="text-input"
                          value={form.portionUnit}
                          onChange={(event) =>
                            updateField('portionUnit', event.target.value)
                          }
                          placeholder="소분 단위 예: 3kg 박스"
                        />
                      </div>
                      <p className="field-note">
                        공판장 납품 후 남는 물량과 소비자에게 보낼 포장 단위를
                        입력합니다.
                      </p>
                    </FormLine>

                    <FormLine label="성사 기준" required>
                      <div className="field-grid field-grid--two">
                        <div className="price-input quantity-input">
                          <input
                            type="number"
                            min="0"
                            value={form.minimumOrderQuantity}
                            onChange={(event) =>
                              updateField(
                                'minimumOrderQuantity',
                                event.target.value,
                              )
                            }
                            placeholder="최소 성사 수량"
                          />
                          <span>건</span>
                        </div>
                        <div className="price-input quantity-input">
                          <input
                            type="number"
                            min="0"
                            value={form.maximumOrderQuantity}
                            onChange={(event) =>
                              updateField(
                                'maximumOrderQuantity',
                                event.target.value,
                              )
                            }
                            placeholder="최대 판매 수량"
                          />
                          <span>건</span>
                        </div>
                      </div>
                    </FormLine>

                    <FormLine label="모집/배송 일정" required>
                      <div className="field-grid field-grid--two">
                        <label className="date-field">
                          <span>모집 마감일</span>
                          <input
                            className="text-input"
                            type="date"
                            value={form.recruitEndDate}
                            onChange={(event) =>
                              updateField('recruitEndDate', event.target.value)
                            }
                          />
                        </label>
                        <label className="date-field">
                          <span>배송 예정일</span>
                          <input
                            className="text-input"
                            type="date"
                            value={form.groupShippingDate}
                            onChange={(event) =>
                              updateField('groupShippingDate', event.target.value)
                            }
                          />
                        </label>
                      </div>
                    </FormLine>

                    <FormLine label="구매 제한">
                      <div className="price-input quantity-input">
                        <input
                          type="number"
                          min="0"
                          value={form.purchaseLimit}
                          onChange={(event) =>
                            updateField('purchaseLimit', event.target.value)
                          }
                          placeholder="1인 최대 수량"
                        />
                        <span>건</span>
                      </div>
                    </FormLine>

                    <FormLine label="실패 처리">
                      <SegmentedControl<FailurePolicy>
                        name="failurePolicy"
                        value={form.failurePolicy}
                        options={failurePolicyOptions}
                        onChange={(value) => updateField('failurePolicy', value)}
                      />
                    </FormLine>

                  <div className="groupbuy-summary-card">
                    <div>
                      <span>성사 기준</span>
                      <strong>
                        {form.minimumOrderQuantity || '-'} /{' '}
                        {form.maximumOrderQuantity || '-'}건
                      </strong>
                    </div>
                    <div>
                      <span>소분 단위</span>
                      <strong>{form.portionUnit || '-'}</strong>
                    </div>
                    <div>
                      <span>공동구매가</span>
                      <strong>{formattedGroupBuyingPrice}</strong>
                    </div>
                  </div>
                </FormSection>
              )}

              <FormSection
                id="local"
                title="원산지/상품 주요정보"
                required
                help="농산물 등록에 필요한 산지와 입고 정보를 입력합니다."
                summary={
                  selectedCertificationLabels.length > 0
                    ? `${form.origin} · 인증 ${selectedCertificationLabels.length}개`
                    : form.origin
                }
                isOpen={openSections.has('local')}
                onToggle={toggleSection}
              >
                <FormLine label="원산지" required>
                  <input
                    className="text-input text-input--medium"
                    value={form.origin}
                    onChange={(event) => updateField('origin', event.target.value)}
                    placeholder="예: 국산, 전남 담양"
                  />
                </FormLine>

                <FormLine label="농장/판매자명">
                  <input
                    className="text-input text-input--medium"
                    value={form.farmName}
                    onChange={(event) =>
                      updateField('farmName', event.target.value)
                    }
                    placeholder="예: 담양 새벽농장"
                  />
                </FormLine>

                <FormLine label="수확/입고일">
                  <input
                    className="text-input text-input--medium"
                    type="date"
                    value={form.harvestDate}
                    onChange={(event) =>
                      updateField('harvestDate', event.target.value)
                    }
                  />
                  <div className="local-chip-row" aria-label="상품 주요정보 예시">
                    <span className="origin-tag">국산</span>
                    <span className="category-chip">제철상품</span>
                    <span className="origin-tag">로컬 산지직송</span>
                  </div>
                </FormLine>

                <FormLine label="농식품 인증마크">
                  <div className="certification-grid">
                    {certificationMarks.map((mark) => (
                      <label
                        key={mark.id}
                        className={
                          form.certificationMarkIds.includes(mark.id)
                            ? 'certification-option is-selected'
                            : 'certification-option'
                        }
                      >
                        <input
                          type="checkbox"
                          checked={form.certificationMarkIds.includes(mark.id)}
                          onChange={() => toggleCertificationMark(mark.id)}
                        />
                        <img
                          className="certification-option__mark"
                          src={mark.imageSrc}
                          alt=""
                          loading="lazy"
                        />
                        <span>
                          <strong>{mark.label}</strong>
                          <small>{mark.description}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="field-note">
                    상품에 실제 적용되는 인증만 선택하세요. 인증서 확인은 추후
                    검수 단계에서 처리합니다.
                  </p>
                  {selectedCertificationLabels.length > 0 && (
                    <div
                      className="local-chip-row"
                      aria-label="선택된 농식품 인증마크"
                    >
                      {selectedCertificationLabels.map((label) => (
                        <span key={label} className="category-chip">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </FormLine>
              </FormSection>

              <FormSection
                id="delivery"
                title="배송"
                summary={`${form.deliveryMethod} · ${formattedShippingFee}`}
                isOpen={openSections.has('delivery')}
                onToggle={toggleSection}
              >
                <FormLine label="배송방식">
                  <SegmentedControl<DeliveryMethod>
                    name="deliveryMethod"
                    value={form.deliveryMethod}
                    options={deliveryMethodOptions}
                    onChange={(value) => updateField('deliveryMethod', value)}
                  />
                </FormLine>

                <FormLine label="배송비">
                  <div className="price-input quantity-input">
                    <input
                      type="number"
                      min="0"
                      value={form.shippingFee}
                      onChange={(event) =>
                        updateField('shippingFee', event.target.value)
                      }
                      placeholder="무료배송은 0"
                    />
                    <span>원</span>
                  </div>
                  <p className="field-note">
                    묶음배송, 반품/교환비는 운영 설정에서 공통값으로 처리합니다.
                  </p>
                </FormLine>
              </FormSection>

              <FormSection
                id="detail"
                title="상품 설명"
                isOpen={openSections.has('detail')}
                onToggle={toggleSection}
              >
                <FormLine label="간단 설명">
                  <textarea
                    className="text-area"
                    value={form.description}
                    onChange={(event) =>
                      updateField('description', event.target.value)
                    }
                    placeholder="상품 특징, 원산지, 보관 방법 등을 입력하세요"
                    rows={5}
                  />
                </FormLine>
              </FormSection>

              {showPreview && (
                <section className="preview-card" aria-label="상품 미리보기">
                  <div className="preview-card__media">
                    {representativeImage ? (
                      <img src={representativeImage.url} alt="" />
                    ) : (
                      '상품 이미지'
                    )}
                  </div>
                  <div className="preview-card__content">
                    <span>{form.category || '카테고리 미선택'}</span>
                    <h2>{form.name || '상품명 미입력'}</h2>
                    <strong>
                      {isGroupBuying ? formattedGroupBuyingPrice : formattedPrice}
                    </strong>
                    <dl>
                      <div>
                        <dt>판매방식</dt>
                        <dd>{form.salesMethod}</dd>
                      </div>
                      <div>
                        <dt>재고</dt>
                        <dd>{form.stock ? `${form.stock}개` : '미입력'}</dd>
                      </div>
                      <div>
                        <dt>원산지</dt>
                        <dd>{form.origin || '미입력'}</dd>
                      </div>
                      <div>
                        <dt>배송</dt>
                        <dd>{form.deliveryMethod}</dd>
                      </div>
                      {isGroupBuying && (
                        <>
                          <div>
                            <dt>성사 기준</dt>
                            <dd>
                              {form.minimumOrderQuantity || '-'}건 이상
                            </dd>
                          </div>
                          <div>
                            <dt>소분 단위</dt>
                            <dd>{form.portionUnit || '미입력'}</dd>
                          </div>
                        </>
                      )}
                    </dl>
                    <div className="preview-card__tags">
                      {form.farmName && <span>{form.farmName}</span>}
                      {form.harvestDate && <span>{form.harvestDate}</span>}
                      {isGroupBuying && form.recruitEndDate && (
                        <span>마감 {form.recruitEndDate}</span>
                      )}
                      {isGroupBuying && form.groupShippingDate && (
                        <span>배송 {form.groupShippingDate}</span>
                      )}
                      {selectedCertificationLabels.slice(0, 3).map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                      {selectedCertificationLabels.length > 3 && (
                        <span>인증 +{selectedCertificationLabels.length - 3}</span>
                      )}
                      <span>{formattedShippingFee}</span>
                    </div>
                    <p>{form.description || '상품 설명이 여기에 표시됩니다.'}</p>
                  </div>
                </section>
              )}
            </div>

            <div className="bottom-bar">
              <div className="bottom-bar__guide">
                <span>?</span>
                임시저장 가이드 안내
              </div>
              <div className="bottom-bar__actions">
                <button
                  type="button"
                  className="button button--muted"
                  onClick={handlePreview}
                >
                  미리보기
                </button>
                <button
                  type="button"
                  className="button button--muted"
                  onClick={saveDraft}
                >
                  임시저장
                </button>
                <button type="submit" className="button button--primary">
                  저장하기
                </button>
                <button type="button" className="button button--ghost">
                  취소
                </button>
              </div>
            </div>
          </form>
          )}
        </main>
        <QuickRail />
      </div>
    </div>
  )
}

export { ProductRegistrationPage }
