import { useMemo, useRef, useState } from 'react'
import { PartnerShell } from '../../components/layout/PartnerShell'
import type { AppView } from '../../app/appTypes'
import { getProductById } from '../../services/mockDb/commerceDummyData'

type ProductDetailPageProps = {
  productId: number
  onNavigate?: (view: AppView) => void
}

type TabId = 'description' | 'details' | 'reviews' | 'inquiries'

const DEFAULT_WEIGHT_OPTIONS = [
  { label: '1kg', price: 4500 },
  { label: '2kg', price: 8900 },
  { label: '4.5kg', price: 19900 },
]

const STATIC_REVIEWS = [
  {
    author: '김하연',
    rating: 5,
    content: '배송 빠르고 상태가 정말 좋아요. 겉잎은 단단하고 속은 달큰합니다.',
    date: '2026-05-24',
  },
  {
    author: '박지수',
    rating: 5,
    content: '쌈으로 먹어도 아삭하고, 겉절이 해도 물이 적게 나와서 좋았습니다.',
    date: '2026-05-22',
  },
  {
    author: '이동현',
    rating: 4,
    content: '신선도는 만족합니다. 포장도 깔끔했어요.',
    date: '2026-05-20',
  },
]

const STATIC_INQUIRIES = [
  {
    author: '문의자',
    date: '2026-05-21',
    question: '4.5kg은 몇 포기 정도인가요?',
    answer: '작황에 따라 차이는 있지만 보통 알배추 기준 6~8포기 내외로 구성됩니다.',
  },
  {
    author: '문의자',
    date: '2026-05-19',
    question: '수령 후 보관은 어떻게 하는 게 좋나요?',
    answer: '비닐 포장 상태 그대로 냉장 보관하시고, 손질 후 키친타월로 감싸 보관하면 신선도가 오래 유지됩니다.',
  },
]

function toWon(price: number) {
  return `${price.toLocaleString('ko-KR')}원`
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const product = getProductById(productId)
  const weightOptions = product.weightOptions?.length ? product.weightOptions : DEFAULT_WEIGHT_OPTIONS

  const [activeTab, setActiveTab] = useState<TabId>('description')
  const [selectedWeight, setSelectedWeight] = useState(weightOptions[0].label)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isOptionOpen, setIsOptionOpen] = useState(false)

  const sectionRefs = {
    description: useRef<HTMLElement | null>(null),
    details: useRef<HTMLElement | null>(null),
    reviews: useRef<HTMLElement | null>(null),
    inquiries: useRef<HTMLElement | null>(null),
  }

  const galleryImages = useMemo(
    () => [
      product.imageSrc,
      'https://images.unsplash.com/photo-1603046891744-02487f16a4fc?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1600&q=80',
    ],
    [product.imageSrc],
  )

  const selectedOption = weightOptions.find((item) => item.label === selectedWeight) ?? weightOptions[0]
  const totalPrice = selectedOption.price * quantity

  const moveToTab = (tabId: TabId) => {
    setActiveTab(tabId)
    sectionRefs[tabId].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const applyWeight = (weight: string) => {
    setSelectedWeight(weight)
    setQuantity(1)
    setIsOptionOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((index) => (index + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((index) => (index - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <PartnerShell activeSidebarItem="상품 조회/수정" onNavigate={onNavigate}>
      <div className="detail-showcase-page">
        <section className="detail-showcase-hero">
          <div className="detail-showcase-gallery">
            <div className="detail-showcase-main-image">
              <img src={galleryImages[currentImageIndex]} alt={product.name} />
              <div className="detail-showcase-main-image__controls">
                <button type="button" onClick={prevImage} aria-label="이전 이미지">
                  ‹
                </button>
                <span>
                  {currentImageIndex + 1} / {galleryImages.length}
                </span>
                <button type="button" onClick={nextImage} aria-label="다음 이미지">
                  ›
                </button>
              </div>
            </div>

            <div className="detail-showcase-thumbs detail-showcase-thumbs--row">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={index === currentImageIndex ? 'detail-showcase-thumb is-active' : 'detail-showcase-thumb'}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>

          <aside className="detail-showcase-panel">
            <div className="detail-showcase-panel__top">
              <span className="detail-showcase-badge">GAP 인증 농산물</span>
              <div className="detail-showcase-title-group">
                <h1>{product.name}</h1>
                <p>{product.shortDescription}</p>
              </div>
              <div className="detail-showcase-price-row">
                <strong className="detail-showcase-price">{toWon(selectedOption.price)}</strong>
                <span>당일 수확 · 산지 직송 · 30,000원 이상 무료배송</span>
              </div>
            </div>

            <div className="detail-showcase-seller">
              <div className="detail-showcase-seller__avatar">
                농가
                <span>대표</span>
              </div>
              <div className="detail-showcase-seller__body">
                <strong>땅끝마을 김농부</strong>
                <span>평점 4.9 · 단골 1,204명 · 산지 직송</span>
              </div>
              <button type="button" className="detail-showcase-link-button" onClick={() => onNavigate?.('store-info')}>
                이 판매자의 상점 가기
              </button>
            </div>

            <div className="detail-showcase-block">
              <span className="detail-showcase-block__label">배송정보</span>
              <p>{product.shippingText}</p>
            </div>

            <div className="detail-showcase-option">
              <button
                type="button"
                className="detail-showcase-option__button"
                onClick={() => setIsOptionOpen((current) => !current)}
              >
                <strong>중량 선택</strong>
                <span>{selectedOption.label}</span>
                <span
                  className={isOptionOpen ? 'detail-showcase-option__chevron is-open' : 'detail-showcase-option__chevron'}
                  aria-hidden="true"
                />
              </button>
              {isOptionOpen && (
                <div className="detail-showcase-option__menu">
                  {weightOptions.map((option) => (
                    <button
                      type="button"
                      key={option.label}
                      className={selectedWeight === option.label ? 'is-selected' : undefined}
                      onClick={() => applyWeight(option.label)}
                    >
                      <span>{option.label}</span>
                      <strong>{toWon(option.price)}</strong>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="detail-showcase-cart">
              <div className="detail-showcase-cart__item-title">
                <strong>
                  {product.name} ({selectedOption.label})
                </strong>
              </div>
              <div className="detail-showcase-quantity">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  -
                </button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                  +
                </button>
              </div>
              <div className="detail-showcase-cart__price">{toWon(totalPrice)}</div>
            </div>

            <div className="detail-showcase-total">
              <span>총 상품금액</span>
              <strong>{toWon(totalPrice)}</strong>
            </div>

            <div className="detail-showcase-actions">
              <button type="button" className="detail-showcase-button detail-showcase-button--light">
                장바구니 담기
              </button>
              <button type="button" className="detail-showcase-button detail-showcase-button--dark">
                바로 구매하기
              </button>
            </div>
          </aside>
        </section>

        <nav className="detail-showcase-tabs">
          <button type="button" className={activeTab === 'description' ? 'is-active' : ''} onClick={() => moveToTab('description')}>
            상품설명
          </button>
          <button type="button" className={activeTab === 'details' ? 'is-active' : ''} onClick={() => moveToTab('details')}>
            상세정보
          </button>
          <button type="button" className={activeTab === 'reviews' ? 'is-active' : ''} onClick={() => moveToTab('reviews')}>
            리뷰 (128)
          </button>
          <button type="button" className={activeTab === 'inquiries' ? 'is-active' : ''} onClick={() => moveToTab('inquiries')}>
            상품문의
          </button>
        </nav>

        <section ref={sectionRefs.description} className="detail-section detail-section--body">
          <h2>상품설명</h2>
          <p>
            해남 해풍을 맞고 자란 알배추는 잎 결이 촘촘하고 단맛이 안정적으로 올라옵니다. 본 상품은 새벽 수확 후 당일 선별, 예냉
            보관, 오후 출고 루트를 고정해 신선도를 우선으로 운영합니다.
          </p>
          <p>
            주로 겉절이, 쌈채소, 샤브샤브용으로 활용되며, 수분 과다로 쉽게 물러지는 개체는 출고 단계에서 제외합니다. 포장은 충격
            완화재와 통기성 비닐을 함께 사용해 이동 중 눌림을 줄였습니다.
          </p>
          <img
            src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1800&q=80"
            alt="알배추 상세 이미지"
          />
          <p>
            수령 후에는 비닐을 완전히 밀봉하지 말고 냉장 보관하시길 권장합니다. 손질 후에는 키친타월로 감싸 밀폐용기에 넣으면 수분
            균형을 유지해 식감 저하를 줄일 수 있습니다.
          </p>
        </section>

        <section ref={sectionRefs.details} className="detail-section">
          <h2>상세정보</h2>
          <dl className="detail-definition-list">
            <div>
              <dt>원산지</dt>
              <dd>전라남도 해남</dd>
            </div>
            <div>
              <dt>수확/출고</dt>
              <dd>당일 수확 · 당일 출고</dd>
            </div>
            <div>
              <dt>중량 옵션</dt>
              <dd>{weightOptions.map((item) => item.label).join(' / ')}</dd>
            </div>
            <div>
              <dt>보관 방법</dt>
              <dd>냉장 보관(0~4°C)</dd>
            </div>
          </dl>
        </section>

        <section ref={sectionRefs.reviews} className="detail-section">
          <h2>리뷰</h2>
          <div className="detail-review-list">
            {STATIC_REVIEWS.map((review) => (
              <article key={`${review.author}-${review.date}`} className="detail-review-card">
                <header>
                  <strong>{review.author}</strong>
                  <span>{review.date}</span>
                </header>
                <p>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </p>
                <p>{review.content}</p>
              </article>
            ))}
          </div>
        </section>

        <section ref={sectionRefs.inquiries} className="detail-section">
          <h2>상품문의</h2>
          <div className="detail-inquiry-list">
            {STATIC_INQUIRIES.map((inquiry) => (
              <article key={`${inquiry.author}-${inquiry.date}`} className="detail-inquiry-card">
                <header>
                  <strong>Q. {inquiry.question}</strong>
                  <span>
                    {inquiry.author} · {inquiry.date}
                  </span>
                </header>
                <p>A. {inquiry.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PartnerShell>
  )
}
