import { useEffect, useState } from 'react'
import { PartnerShell } from '../../components/layout/PartnerShell'
import type { AppView } from '../../app/appTypes'
import { storeProfile } from '../../services/mockDb/commerceDummyData'

type StoreInfoPageProps = {
  onNavigate?: (view: AppView) => void
}

type StoreDraft = {
  name: string
  owner: string
  phone: string
  address: string
  hours: string
  account: string
  introduction: string
}

const storeDraftKey = 'nongdam-store-info-draft'

function readStoreDraft(fallback: StoreDraft): StoreDraft {
  try {
    const raw = localStorage.getItem(storeDraftKey)
    if (!raw) {
      return fallback
    }

    return {
      ...fallback,
      ...(JSON.parse(raw) as Partial<StoreDraft>),
    }
  } catch {
    return fallback
  }
}

export function StoreInfoPage({ onNavigate }: StoreInfoPageProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [feedback, setFeedback] = useState('수정할 항목을 확인한 뒤 저장하세요.')
  const [draft, setDraft] = useState<StoreDraft>(() =>
    readStoreDraft({
      name: storeProfile.name,
      owner: storeProfile.owner,
      phone: storeProfile.phone,
      address: storeProfile.address,
      hours: storeProfile.openHours,
      account: storeProfile.accountNumber,
      introduction: storeProfile.introduction,
    }),
  )

  useEffect(() => {
    setDraft(
      readStoreDraft({
        name: storeProfile.name,
        owner: storeProfile.owner,
        phone: storeProfile.phone,
        address: storeProfile.address,
        hours: storeProfile.openHours,
        account: storeProfile.accountNumber,
        introduction: storeProfile.introduction,
      }),
    )
  }, [])

  const updateField = <Key extends keyof StoreDraft>(key: Key, value: StoreDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const saveDraft = (message: string) => {
    try {
      localStorage.setItem(storeDraftKey, JSON.stringify(draft))
    } catch {
      // localStorage may be unavailable in some environments.
    }

    setFeedback(message)
  }

  return (
    <PartnerShell
      activeSidebarItem="상점 정보"
      onNavigate={onNavigate}
      isSidebarCollapsed={isSidebarCollapsed}
    >
      <div className="product-edit-page store-info-page">
        <div className="page-header">
          <button
            type="button"
            className="back-button"
            aria-label={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            aria-pressed={isSidebarCollapsed}
            onClick={() => setIsSidebarCollapsed((current) => !current)}
          >
            <span
              className={isSidebarCollapsed ? 'chevron chevron--right' : 'chevron chevron--left'}
              aria-hidden="true"
            />
          </button>

          <div className="page-header__main">
            <div className="page-title-row">
              <h1>상점 정보</h1>
              <span className="required-guide">
                <span className="required-dot" aria-hidden="true" />
                필수항목
              </span>
            </div>

            <div className="page-actions">
              <button
                type="button"
                className="guide-button guide-button--muted"
                onClick={() => setFeedback('상점 정보는 상품 등록 기준과 맞춰 유지하세요.')}
              >
                상점 정보 가이드
              </button>
              <button
                type="button"
                className="guide-button guide-button--accent"
                onClick={() => setFeedback('운영 정보와 소개 문구를 바로 수정할 수 있습니다.')}
              >
                운영 가이드
              </button>
            </div>
          </div>

          <span className="feedback feedback--info" role="status">
            {feedback}
          </span>
        </div>

        <div className="product-form">
        <section className="store-info-preview">
          <div className="store-info-preview__media">
            <img src={storeProfile.representativeImage} alt={draft.name} />
          </div>

          <div className="store-info-preview__body">
            <span className="detail-status detail-status--active">상점 정보</span>
            <h2>{draft.name}</h2>
            <p>{draft.introduction}</p>

            <dl className="detail-definition-list">
              <div>
                <dt>운영자</dt>
                <dd>{draft.owner}</dd>
              </div>
              <div>
                <dt>연락처</dt>
                <dd>{draft.phone}</dd>
              </div>
              <div>
                <dt>영업시간</dt>
                <dd>{draft.hours}</dd>
              </div>
              <div>
                <dt>계좌</dt>
                <dd>{draft.account}</dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="form-stack" onSubmit={(event) => event.preventDefault()}>
          <article className="form-section">
            <header className="form-section__header">
              <div className="form-section__title">
                <h2>상점 기본 정보</h2>
              </div>
            </header>
            <div className="form-section__body">
              <div className="field-grid field-grid--two">
                <label className="field-card">
                  <span>상점명</span>
                  <input value={draft.name} onChange={(event) => updateField('name', event.target.value)} />
                </label>
                <label className="field-card">
                  <span>운영자</span>
                  <input value={draft.owner} onChange={(event) => updateField('owner', event.target.value)} />
                </label>
                <label className="field-card">
                  <span>연락처</span>
                  <input value={draft.phone} onChange={(event) => updateField('phone', event.target.value)} />
                </label>
                <label className="field-card">
                  <span>주소</span>
                  <input value={draft.address} onChange={(event) => updateField('address', event.target.value)} />
                </label>
              </div>
            </div>
          </article>

          <article className="form-section">
            <header className="form-section__header">
              <div className="form-section__title">
                <h2>운영 정보</h2>
              </div>
            </header>
            <div className="form-section__body">
              <div className="field-grid field-grid--two">
                <label className="field-card">
                  <span>영업시간</span>
                  <input value={draft.hours} onChange={(event) => updateField('hours', event.target.value)} />
                </label>
                <label className="field-card">
                  <span>계좌 정보</span>
                  <input value={draft.account} onChange={(event) => updateField('account', event.target.value)} />
                </label>
              </div>
            </div>
          </article>

          <article className="form-section">
            <header className="form-section__header">
              <div className="form-section__title">
                <h2>소개문구</h2>
              </div>
            </header>
            <div className="form-section__body">
              <label className="field-card field-card--full">
                <span>상점 소개</span>
                <textarea
                  rows={7}
                  value={draft.introduction}
                  onChange={(event) => updateField('introduction', event.target.value)}
                />
              </label>
            </div>
          </article>

          <div className="bottom-bar">
            <div className="bottom-bar__guide">
              <span>?</span>
              상점 정보는 상품 등록과 같은 기준으로 유지한 뒤 저장하세요.
            </div>
            <div className="bottom-bar__actions">
              <button type="button" className="button button--muted" onClick={() => onNavigate?.('product-inquiry')}>
                상품 목록
              </button>
              <button type="button" className="button button--muted" onClick={() => saveDraft('임시 저장이 완료되었습니다.')}>
                임시저장
              </button>
              <button type="button" className="button button--primary" onClick={() => saveDraft('상점 정보가 저장되었습니다.')}>
                저장하기
              </button>
              <button type="button" className="button button--ghost" onClick={() => onNavigate?.('product-register')}>
                취소
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </PartnerShell>
  )
}
