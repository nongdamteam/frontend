import { useMemo, useState } from 'react'
import { PartnerShell } from '../../components/layout/PartnerShell'
import type { AppView } from '../../app/appTypes'
import {
  orderRows,
  updateOrderStatus,
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
  }, [paymentFilter, searchQuery, statusFilter])

  const statusSummary = useMemo(() => {
    const base = {
      '주문 확인': 0,
      '상품 준비': 0,
      '배송 준비': 0,
      '배송 중': 0,
      '배송 완료': 0,
    } as Record<OrderStatus, number>

    orders.forEach((row) => {
      base[row.status] += 1
    })
    return base
  }, [orders])

  const handleStatusChange = (orderId: number, nextStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, nextStatus)
    if (!updated) return
    setOrders([...orderRows])
    setFeedback(`${updated.orderNo} 상태를 "${nextStatus}"(으)로 변경했습니다.`)
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
                onClick={() => setFeedback('주문 확인 → 상품 준비 → 배송 준비 → 배송 중 → 배송 완료 순서로 진행하세요.')}
              >
                주문 처리 가이드
              </button>
              <button type="button" className="guide-button guide-button--accent" onClick={() => onNavigate?.('product-inquiry')}>
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
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value as OrderStatus | '전체')}
                    >
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

                <div className="order-list">
                  {filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} />
                  ))}
                </div>

                {filteredOrders.length === 0 && (
                  <div className="inquiry-empty-state">조건에 맞는 주문이 없습니다.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </PartnerShell>
  )
}

function OrderCard({
  order,
  onStatusChange,
}: {
  order: OrderRow
  onStatusChange: (orderId: number, status: OrderStatus) => void
}) {
  return (
    <article className="order-card">
      <header className="order-card__header">
        <div>
          <strong>{order.orderNo}</strong>
          <span>{order.orderedAt}</span>
        </div>
        <select value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
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

      {order.memo.trim().length > 0 && <p className="order-card__memo">메모: {order.memo}</p>}
    </article>
  )
}
