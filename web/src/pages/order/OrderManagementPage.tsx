import { useMemo, useState } from 'react'
import type { AppView } from '../../app/appTypes'
import { PartnerShell } from '../../components/layout/PartnerShell'
import {
  bulkUpdateOrderStatus,
  orderRows,
  updateOrderStatus,
  updateOrderTrackingNumber,
  type OrderRow,
  type OrderStatus,
  type PaymentStatus,
} from '../../services/mockDb/orderDummyData'

type OrderManagementPageProps = {
  onNavigate?: (view: AppView) => void
}

const ORDER_STATUSES: OrderStatus[] = ['주문 확인', '상품 준비', '배송 준비', '배송 중', '배송 완료']
const PAYMENT_FILTERS: Array<'전체' | PaymentStatus> = ['전체', '결제완료', '미결제']

export function OrderManagementPage({ onNavigate }: OrderManagementPageProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [orders, setOrders] = useState<OrderRow[]>([...orderRows])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | '전체'>('전체')
  const [paymentFilter, setPaymentFilter] = useState<'전체' | PaymentStatus>('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [feedback, setFeedback] = useState('신규 주문부터 확인하고 출고 단계를 순서대로 변경하세요.')
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([])
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>('상품 준비')
  const [detailOrder, setDetailOrder] = useState<OrderRow | null>(null)
  const [trackingDrafts, setTrackingDrafts] = useState<Record<number, string>>({})

  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return orders.filter((order) => {
      const matchesStatus = statusFilter === '전체' || order.status === statusFilter
      const matchesPayment = paymentFilter === '전체' || order.paymentStatus === paymentFilter
      const matchesQuery =
        !normalizedQuery ||
        order.orderNo.toLowerCase().includes(normalizedQuery) ||
        order.productName.toLowerCase().includes(normalizedQuery) ||
        order.buyerName.toLowerCase().includes(normalizedQuery)
      return matchesStatus && matchesPayment && matchesQuery
    })
  }, [orders, paymentFilter, searchQuery, statusFilter])

  const statusSummary = useMemo(() => {
    const base: Record<OrderStatus, number> = {
      '주문 확인': 0,
      '상품 준비': 0,
      '배송 준비': 0,
      '배송 중': 0,
      '배송 완료': 0,
    }
    orders.forEach((row) => {
      base[row.status] += 1
    })
    return base
  }, [orders])

  const visibleOrderIds = useMemo(() => filteredOrders.map((row) => row.id), [filteredOrders])
  const allVisibleSelected =
    visibleOrderIds.length > 0 && visibleOrderIds.every((id) => selectedOrderIds.includes(id))

  const refreshOrders = () => setOrders([...orderRows])

  const handleStatusChange = (orderId: number, nextStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, nextStatus)
    if (!updated) return
    refreshOrders()
    setFeedback(`${updated.orderNo} 상태를 "${nextStatus}"(으)로 변경했습니다.`)
    if (detailOrder?.id === orderId) setDetailOrder(updated)
  }

  const handleTrackingSave = (orderId: number) => {
    const draft = (trackingDrafts[orderId] ?? '').trim()
    if (draft.length === 0) {
      setFeedback('운송장 번호를 입력한 뒤 저장하세요.')
      return
    }
    const updated = updateOrderTrackingNumber(orderId, draft)
    if (!updated) return
    refreshOrders()
    setFeedback(`${updated.orderNo} 운송장 번호를 저장했습니다.`)
    setTrackingDrafts((current) => ({ ...current, [orderId]: updated.trackingNumber }))
    if (detailOrder?.id === orderId) setDetailOrder(updated)
  }

  const handleToggleSelect = (orderId: number, checked: boolean) => {
    setSelectedOrderIds((current) => {
      if (checked) return current.includes(orderId) ? current : [...current, orderId]
      return current.filter((id) => id !== orderId)
    })
  }

  const handleToggleSelectAllVisible = (checked: boolean) => {
    if (!checked) {
      setSelectedOrderIds((current) => current.filter((id) => !visibleOrderIds.includes(id)))
      return
    }
    setSelectedOrderIds((current) => {
      const next = new Set(current)
      visibleOrderIds.forEach((id) => next.add(id))
      return [...next]
    })
  }

  const handleBulkStatusChange = () => {
    if (selectedOrderIds.length === 0) {
      setFeedback('일괄 변경할 주문을 먼저 선택하세요.')
      return
    }
    const updated = bulkUpdateOrderStatus(selectedOrderIds, bulkStatus)
    refreshOrders()
    setFeedback(`${updated.length}건 주문 상태를 "${bulkStatus}"(으)로 일괄 변경했습니다.`)
    if (detailOrder && selectedOrderIds.includes(detailOrder.id)) {
      const nextDetail = updated.find((row) => row.id === detailOrder.id)
      if (nextDetail) setDetailOrder(nextDetail)
    }
  }

  return (
    <PartnerShell activeSidebarItem="주문 확인" onNavigate={onNavigate} isSidebarCollapsed={isSidebarCollapsed}>
      <div className="product-edit-page order-management-page">
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
              <h1>주문 처리</h1>
              <span className="required-guide">
                <span className="required-dot" aria-hidden="true" />
                판매자 운영
              </span>
            </div>
            <div className="page-actions">
              <button
                type="button"
                className="guide-button guide-button--muted"
                onClick={() =>
                  setFeedback('주문 확인 → 상품 준비 → 배송 준비 → 배송 중 → 배송 완료 순서로 진행하세요.')
                }
              >
                주문 처리 가이드
              </button>
              <button
                type="button"
                className="guide-button guide-button--accent"
                onClick={() => onNavigate?.('product-inquiry')}
              >
                상품 조회/수정
              </button>
            </div>
          </div>
          <span className="feedback feedback--info" role="status">
            {feedback}
          </span>
        </div>

        <div className="product-form">
          <div className="form-stack">
            <section className="form-section order-summary-card">
              <header className="form-section__header">
                <div className="form-section__title">
                  <h2>주문 현황</h2>
                </div>
              </header>
              <div className="form-section__body">
                <div className="order-summary-grid">
                  {ORDER_STATUSES.map((status) => (
                    <article key={status} className="order-summary-item">
                      <strong>{status}</strong>
                      <span>{statusSummary[status]}건</span>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="form-section">
              <header className="form-section__header">
                <div className="form-section__title">
                  <h2>주문 목록</h2>
                </div>
              </header>
              <div className="form-section__body">
                <div className="order-toolbar">
                  <label className="order-toolbar__field">
                    <span>검색</span>
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="주문번호, 상품명, 구매자명"
                    />
                  </label>

                  <label className="order-toolbar__field">
                    <span>주문 상태</span>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OrderStatus | '전체')}>
                      <option value="전체">전체</option>
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="order-toolbar__field">
                    <span>결제 여부</span>
                    <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value as '전체' | PaymentStatus)}>
                      {PAYMENT_FILTERS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="order-bulk-toolbar">
                  <label className="order-bulk-toolbar__checkbox">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(event) => handleToggleSelectAllVisible(event.target.checked)}
                    />
                    <span>현재 목록 전체 선택</span>
                  </label>

                  <div className="order-bulk-toolbar__actions">
                    <span>{selectedOrderIds.length}건 선택됨</span>
                    <select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value as OrderStatus)}>
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="guide-button guide-button--accent" onClick={handleBulkStatusChange}>
                      일괄 상태 변경
                    </button>
                  </div>
                </div>

                <div className="order-list">
                  {filteredOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      checked={selectedOrderIds.includes(order.id)}
                      trackingValue={trackingDrafts[order.id] ?? order.trackingNumber}
                      onToggleSelect={handleToggleSelect}
                      onStatusChange={handleStatusChange}
                      onTrackingChange={(value) =>
                        setTrackingDrafts((current) => ({
                          ...current,
                          [order.id]: value,
                        }))
                      }
                      onTrackingSave={handleTrackingSave}
                      onOpenDetail={() => setDetailOrder(order)}
                    />
                  ))}
                </div>

                {filteredOrders.length === 0 && (
                  <div className="inquiry-empty-state">조건에 맞는 주문이 없습니다.</div>
                )}
              </div>
            </section>
          </div>
        </div>

        {detailOrder ? (
          <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} onStatusChange={handleStatusChange} />
        ) : null}
      </div>
    </PartnerShell>
  )
}

function OrderCard({
  order,
  checked,
  trackingValue,
  onToggleSelect,
  onStatusChange,
  onTrackingChange,
  onTrackingSave,
  onOpenDetail,
}: {
  order: OrderRow
  checked: boolean
  trackingValue: string
  onToggleSelect: (orderId: number, checked: boolean) => void
  onStatusChange: (orderId: number, status: OrderStatus) => void
  onTrackingChange: (value: string) => void
  onTrackingSave: (orderId: number) => void
  onOpenDetail: () => void
}) {
  return (
    <article className="order-card">
      <header className="order-card__header">
        <label className="order-card__select">
          <input type="checkbox" checked={checked} onChange={(event) => onToggleSelect(order.id, event.target.checked)} />
          <span>{order.orderNo}</span>
        </label>

        <div className="order-card__header-right">
          <span>{order.orderedAt}</span>
          <select value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="order-card__grid">
        <div>
          <span className="order-card__label">주문 상품</span>
          <p>
            {order.productName} / {order.optionLabel} / {order.quantity}개
          </p>
        </div>
        <div>
          <span className="order-card__label">구매자</span>
          <p>
            {order.buyerName} ({order.buyerPhone})
          </p>
        </div>
        <div>
          <span className="order-card__label">배송지</span>
          <p>{order.address}</p>
        </div>
        <div>
          <span className="order-card__label">결제</span>
          <p>
            {order.paymentStatus} / {order.paymentAmountText}
          </p>
        </div>
      </div>

      <div className="order-card__tracking">
        <label>
          <span className="order-card__label">운송장 번호</span>
          <input
            value={trackingValue}
            onChange={(event) => onTrackingChange(event.target.value)}
            placeholder="예: CJ-1234-5678"
          />
        </label>
        <button type="button" onClick={() => onTrackingSave(order.id)}>
          운송장 저장
        </button>
        <button type="button" className="order-card__detail-button" onClick={onOpenDetail}>
          주문 상세
        </button>
      </div>

      {order.memo.trim().length > 0 && <p className="order-card__memo">메모: {order.memo}</p>}
    </article>
  )
}

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: OrderRow
  onClose: () => void
  onStatusChange: (orderId: number, status: OrderStatus) => void
}) {
  return (
    <div className="order-modal-backdrop" role="dialog" aria-modal="true" aria-label="주문 상세">
      <div className="order-modal">
        <header className="order-modal__header">
          <h2>주문 상세</h2>
          <button type="button" onClick={onClose} aria-label="팝업 닫기">
            ×
          </button>
        </header>

        <div className="order-modal__body">
          <dl className="order-modal__grid">
            <div>
              <dt>주문번호</dt>
              <dd>{order.orderNo}</dd>
            </div>
            <div>
              <dt>주문일시</dt>
              <dd>{order.orderedAt}</dd>
            </div>
            <div>
              <dt>상품</dt>
              <dd>
                {order.productName} / {order.optionLabel} / {order.quantity}개
              </dd>
            </div>
            <div>
              <dt>구매자</dt>
              <dd>
                {order.buyerName} ({order.buyerPhone})
              </dd>
            </div>
            <div>
              <dt>배송지</dt>
              <dd>{order.address}</dd>
            </div>
            <div>
              <dt>결제</dt>
              <dd>
                {order.paymentStatus} / {order.paymentAmountText}
              </dd>
            </div>
            <div>
              <dt>운송장 번호</dt>
              <dd>{order.trackingNumber || '-'}</dd>
            </div>
            <div>
              <dt>요청사항</dt>
              <dd>{order.memo || '-'}</dd>
            </div>
          </dl>

          <div className="order-modal__timeline">
            {ORDER_STATUSES.map((status) => {
              const currentIndex = ORDER_STATUSES.indexOf(order.status)
              const stepIndex = ORDER_STATUSES.indexOf(status)
              const isDone = stepIndex <= currentIndex
              return (
                <button
                  type="button"
                  key={status}
                  className={isDone ? 'is-done' : ''}
                  onClick={() => onStatusChange(order.id, status)}
                >
                  {status}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

