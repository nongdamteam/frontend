import { useEffect, useState } from 'react'
import { PartnerShell } from '../../components/layout/PartnerShell'
import type { AppView } from '../../app/appTypes'
import { getProductById } from '../../services/mockDb/commerceDummyData'

type ProductEditPageProps = {
  productId: number
  onNavigate?: (view: AppView) => void
}

type FeedbackTone = 'info' | 'success' | 'error'

type FeedbackState = {
  tone: FeedbackTone
  text: string
}

type EditDraft = {
  name: string
  status: string
  priceText: string
  stockText: string
  shippingText: string
  subtitle: string
  description: string
}

function draftKey(productId: number) {
  return `product-edit-draft-${productId}`
}

function readDraft(productId: number, fallback: EditDraft): EditDraft {
  try {
    const raw = localStorage.getItem(draftKey(productId))
    if (!raw) {
      return fallback
    }

    return {
      ...fallback,
      ...(JSON.parse(raw) as Partial<EditDraft>),
    }
  } catch {
    return fallback
  }
}

function parsePrice(value: string) {
  const numeric = Number(value.replace(/[^\d]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

function formatPrice(value: string) {
  const numeric = parsePrice(value)
  return numeric > 0 ? `${numeric.toLocaleString('ko-KR')}원` : value
}

export function ProductEditPage({ productId, onNavigate }: ProductEditPageProps) {
  const product = getProductById(productId)
  const [feedback, setFeedback] = useState<FeedbackState>({
    tone: 'info',
    text: '수정할 항목을 확인한 뒤 저장하세요.',
  })
  const [draft, setDraft] = useState<EditDraft>(() =>
    readDraft(productId, {
      name: product.name,
      status: product.status,
      priceText: product.priceText,
      stockText: product.stockText,
      shippingText: product.shippingText,
      subtitle: product.shortDescription,
      description: product.detailDescription,
    }),
  )

  useEffect(() => {
    setDraft(
      readDraft(productId, {
        name: product.name,
        status: product.status,
        priceText: product.priceText,
        stockText: product.stockText,
        shippingText: product.shippingText,
        subtitle: product.shortDescription,
        description: product.detailDescription,
      }),
    )
  }, [product, productId])

  const updateField = <K extends keyof EditDraft>(key: K, value: EditDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const saveDraft = (tone: FeedbackTone, text: string) => {
    try {
      localStorage.setItem(draftKey(productId), JSON.stringify(draft))
    } catch {
      // localStorage unavailable in some environments; ignore and continue.
    }

    setFeedback({ tone, text })
  }

  return (
    <PartnerShell activeSidebarItem="상품 조회/수정" onNavigate={onNavigate}>
      <div className="product-edit-page product-form">
        <div className="page-header">
          <button
            type="button"
            className="back-button"
            aria-label="상품 조회/수정으로 돌아가기"
            onClick={() => onNavigate?.('product-inquiry')}
          >
            <span className="chevron chevron--left" aria-hidden="true" />
          </button>

          <div className="page-header__main">
            <div className="page-title-row">
              <h1>상품 수정</h1>
              <span className="required-guide">
                <span className="required-dot" aria-hidden="true" />
                필수항목
              </span>
            </div>

            <div className="page-actions">
              <button type="button" className="guide-button guide-button--muted" onClick={() => setFeedback({ tone: 'info', text: '상품 등록 가이드를 확인했습니다. 수정 전 노출 범위를 다시 점검하세요.' })}>
                상품 등록 가이드
              </button>
              <button type="button" className="guide-button guide-button--accent" onClick={() => setFeedback({ tone: 'info', text: '상세 설명과 대표 이미지를 함께 맞춰두면 수정 후 전환율 확인이 쉽습니다.' })}>
                상품 운영 가이드
              </button>
            </div>
          </div>

          <span className={`feedback feedback--${feedback.tone}`} role="status">
            {feedback.text}
          </span>
        </div>

        <form className="form-stack" onSubmit={(event) => event.preventDefault()}>
          <article className="form-section">
            <header className="form-section__header">
              <div className="form-section__title">
                <h2>상품 기본 정보</h2>
              </div>
            </header>
            <div className="form-section__body">
              <div className="field-grid field-grid--two">
                <label className="field-card">
                  <span>상품명</span>
                  <input value={draft.name} onChange={(event) => updateField('name', event.target.value)} />
                </label>
                <label className="field-card">
                  <span>판매 상태</span>
                  <select value={draft.status} onChange={(event) => updateField('status', event.target.value)}>
                    <option value="판매중">판매중</option>
                    <option value="판매대기">판매대기</option>
                  </select>
                </label>
                <label className="field-card">
                  <span>판매가</span>
                  <input value={draft.priceText} onChange={(event) => updateField('priceText', event.target.value)} />
                </label>
                <label className="field-card">
                  <span>재고</span>
                  <input value={draft.stockText} onChange={(event) => updateField('stockText', event.target.value)} />
                </label>
              </div>
            </div>
          </article>

          <article className="form-section">
            <header className="form-section__header">
              <div className="form-section__title">
                <h2>판매 안내</h2>
              </div>
            </header>
            <div className="form-section__body">
              <div className="field-grid field-grid--two">
                <label className="field-card field-card--full">
                  <span>한 줄 소개</span>
                  <input
                    value={draft.subtitle}
                    onChange={(event) => updateField('subtitle', event.target.value)}
                    placeholder="상품의 핵심 특징을 한 문장으로 입력하세요."
                  />
                </label>
                <label className="field-card field-card--full">
                  <span>배송 정보</span>
                  <input
                    value={draft.shippingText}
                    onChange={(event) => updateField('shippingText', event.target.value)}
                    placeholder="예: 일반 택배 / 3,000원 (30,000원 이상 무료)"
                  />
                </label>
                <label className="field-card field-card--full">
                  <span>상세 설명</span>
                  <textarea
                    rows={8}
                    value={draft.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    placeholder="상품의 산지, 선별 기준, 보관 방법, 추천 활용법을 자세히 적어주세요."
                  />
                </label>
              </div>
            </div>
          </article>

          <article className="preview-card product-edit-preview">
            <div className="product-edit-preview__image">
              <img src={product.imageSrc} alt={draft.name} />
            </div>
            <div className="product-edit-preview__body">
              <span className={draft.status === '판매중' ? 'detail-status detail-status--active' : 'detail-status'}>
                {draft.status}
              </span>
              <h3>{draft.name}</h3>
              <p>{draft.subtitle}</p>
              <dl className="detail-definition-list">
                <div>
                  <dt>판매가</dt>
                  <dd>{formatPrice(draft.priceText)}</dd>
                </div>
                <div>
                  <dt>재고</dt>
                  <dd>{draft.stockText}</dd>
                </div>
                <div>
                  <dt>배송</dt>
                  <dd>{draft.shippingText}</dd>
                </div>
              </dl>
              <div className="detail-action-row">
                <button type="button" className="button button--muted" onClick={() => onNavigate?.('product-detail')}>
                  미리보기
                </button>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={() => saveDraft('success', '수정 내용이 저장되었습니다. 미리보기에서 노출 상태를 확인하세요.')}
                >
                  저장 반영
                </button>
              </div>
            </div>
          </article>

          <div className="bottom-bar">
            <div className="bottom-bar__guide">
              <span>?</span>
              필수 정보와 노출 문구를 함께 확인한 뒤 저장하세요.
            </div>
            <div className="bottom-bar__actions">
              <button type="button" className="button button--muted" onClick={() => onNavigate?.('product-detail')}>
                미리보기
              </button>
              <button type="button" className="button button--muted" onClick={() => saveDraft('info', '임시 저장이 완료되었습니다.')}>
                임시저장
              </button>
              <button
                type="button"
                className="button button--primary"
                onClick={() => saveDraft('success', '수정 내용이 저장되었습니다.')}
              >
                저장하기
              </button>
              <button type="button" className="button button--ghost" onClick={() => onNavigate?.('product-inquiry')}>
                취소
              </button>
            </div>
          </div>
        </form>
      </div>
    </PartnerShell>
  )
}
