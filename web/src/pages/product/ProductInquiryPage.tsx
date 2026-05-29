import { useEffect, useMemo, useState } from 'react'
import { PartnerShell } from '../../components/layout/PartnerShell'
import type { AppView } from '../../app/appTypes'
import { commerceProducts } from '../../services/mockDb/commerceDummyData'

type ProductInquiryPageProps = {
  onNavigate?: (view: AppView) => void
  onOpenProductDetail?: (productId: number) => void
  onOpenProductEdit?: (productId: number) => void
}

type ProductStatus = '전체' | '판매중' | '판매대기'

const PAGE_SIZE = 8

function ProductInquiryPage({ onNavigate, onOpenProductDetail, onOpenProductEdit }: ProductInquiryPageProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus>('전체')
  const [feedback, setFeedback] = useState('수정할 상품을 확인한 뒤 선택하세요.')

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return commerceProducts.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.shortDescription.toLowerCase().includes(normalizedQuery)
      const matchesStatus = statusFilter === '전체' || product.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [searchQuery, statusFilter])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [searchQuery, statusFilter])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMoreProducts = visibleCount < filteredProducts.length

  return (
    <PartnerShell
      activeSidebarItem="상품 조회/수정"
      onNavigate={onNavigate}
      isSidebarCollapsed={isSidebarCollapsed}
    >
      <div className="product-edit-page inquiry-page">
        <div className="page-header">
          <button
            type="button"
            className="back-button"
            aria-label={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            aria-pressed={isSidebarCollapsed}
            onClick={() => setIsSidebarCollapsed((current) => !current)}
          >
            <span className="chevron chevron--left" aria-hidden="true" />
          </button>

          <div className="page-header__main">
            <div className="page-title-row">
              <h1>상품 조회/수정</h1>
              <span className="required-guide">
                <span className="required-dot" aria-hidden="true" />
                필수항목
              </span>
            </div>

            <div className="page-actions">
              <button
                type="button"
                className="guide-button guide-button--muted"
                onClick={() => setFeedback('조회 결과에서 상품을 선택하면 상세/수정으로 이동합니다.')}
              >
                상품 조회 가이드
              </button>
              <button
                type="button"
                className="guide-button guide-button--accent"
                onClick={() => setFeedback('판매 상태, 가격, 재고를 먼저 확인하고 수정하세요.')}
              >
                상품 운영 가이드
              </button>
            </div>
          </div>

          <span className="feedback feedback--info" role="status">
            {feedback}
          </span>
        </div>

        <div className="product-form">
          <section className="inquiry-shot-card">
            <header className="inquiry-shot-head">
              <h2>상품 목록</h2>
              <button type="button" className="inquiry-shot-primary" onClick={() => onNavigate?.('product-register')}>
                상품 등록
              </button>
            </header>

            <div className="inquiry-toolbar">
              <label className="inquiry-toolbar__field">
                <span>상품 검색</span>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="상품명, 카테고리, 소개문구"
                />
              </label>

              <label className="inquiry-toolbar__field">
                <span>판매 상태</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ProductStatus)}>
                  <option value="전체">전체</option>
                  <option value="판매중">판매중</option>
                  <option value="판매대기">판매대기</option>
                </select>
              </label>

              <div className="inquiry-toolbar__summary">
                <strong>{filteredProducts.length}</strong>
                <span>개 상품</span>
              </div>
            </div>

            <div className="inquiry-shot-product-grid">
              {visibleProducts.map((product) => (
                <article key={product.id} className="inquiry-shot-product-card">
                  <button type="button" className="inquiry-shot-product-media" onClick={() => onOpenProductDetail?.(product.id)}>
                    <img src={product.imageSrc} alt={product.name} />
                  </button>

                  <div className="inquiry-shot-product-lines">
                    <strong>{product.name}</strong>
                    <div className="inquiry-shot-product-meta">
                      <span>카테고리 {product.category}</span>
                      <em>가격 {product.priceText}</em>
                    </div>
                    <small>{product.shortDescription}</small>
                  </div>

                  <div className="inquiry-shot-product-actions">
                    <button type="button" onClick={() => onOpenProductDetail?.(product.id)}>
                      상세보기
                    </button>
                    <button type="button" onClick={() => onOpenProductEdit?.(product.id)}>
                      수정
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && <div className="inquiry-empty-state">조건에 맞는 상품이 없습니다.</div>}

            {hasMoreProducts && (
              <button
                type="button"
                className="inquiry-shot-more"
                onClick={() => setVisibleCount((current) => Math.min(current + PAGE_SIZE, filteredProducts.length))}
              >
                더보기
              </button>
            )}
          </section>
        </div>
      </div>
    </PartnerShell>
  )
}

export { ProductInquiryPage }
