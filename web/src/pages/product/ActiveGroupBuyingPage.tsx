import { useMemo, useState } from 'react'
import {
  certificationMarks,
  groupBuyingStatusFilters,
  type GroupBuyingCampaign,
  type GroupBuyingStatus,
} from '../../config/productRegistrationConfig'

type ActiveGroupBuyingPageProps = {
  campaigns: GroupBuyingCampaign[]
}

const statusToneMap: Record<GroupBuyingStatus, string> = {
  모집중: 'recruiting',
  마감임박: 'urgent',
  성사: 'success',
  목표미달: 'failed',
  배송준비: 'delivery',
}

function formatPrice(value: number) {
  return `${value.toLocaleString('ko-KR')}원`
}

function formatQuantity(value: number, unit: string) {
  return `${value.toLocaleString('ko-KR')}${unit}`
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function getDday(value: string) {
  const targetDate = new Date(value)
  if (Number.isNaN(targetDate.getTime())) {
    return '일정 미정'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays === 0) {
    return '오늘 마감'
  }

  if (diffDays > 0) {
    return `D-${diffDays}`
  }

  return `D+${Math.abs(diffDays)}`
}

function getCampaignInitial(productName: string) {
  return productName.replace(/\s+/g, '').slice(0, 1) || '농'
}

function ActiveGroupBuyingPage({ campaigns }: ActiveGroupBuyingPageProps) {
  const [activeFilter, setActiveFilter] =
    useState<(typeof groupBuyingStatusFilters)[number]>('전체')

  const filteredCampaigns = useMemo(() => {
    if (activeFilter === '전체') {
      return campaigns
    }

    return campaigns.filter((campaign) => campaign.status === activeFilter)
  }, [activeFilter, campaigns])

  const campaignCounts = useMemo(
    () => ({
      total: campaigns.length,
      success: campaigns.filter((campaign) => campaign.status === '성사').length,
      urgent: campaigns.filter((campaign) => campaign.status === '마감임박')
        .length,
      delivery: campaigns.filter((campaign) => campaign.status === '배송준비')
        .length,
    }),
    [campaigns],
  )

  return (
    <section className="active-groupbuy-page" aria-label="진행 중 공동구매">
      <div className="active-groupbuy-page__lead">
        <div>
          <span>판매자 운영 화면</span>
          <h2>공동구매 모집 현황</h2>
          <p>
            등록한 잔여수확 공동구매의 목표 수량, 마감일, 배송 준비 대상을
            빠르게 확인하세요.
          </p>
        </div>
      </div>

      <div className="campaign-kpi-grid" aria-label="공동구매 요약">
        <div className="campaign-kpi-card">
          <span>전체 캠페인</span>
          <strong>{campaignCounts.total}</strong>
        </div>
        <div className="campaign-kpi-card">
          <span>성사</span>
          <strong>{campaignCounts.success}</strong>
        </div>
        <div className="campaign-kpi-card">
          <span>마감임박</span>
          <strong>{campaignCounts.urgent}</strong>
        </div>
        <div className="campaign-kpi-card">
          <span>배송준비</span>
          <strong>{campaignCounts.delivery}</strong>
        </div>
      </div>

      <div className="campaign-filter-bar" role="tablist" aria-label="상태 필터">
        {groupBuyingStatusFilters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={activeFilter === filter ? 'is-active' : undefined}
            aria-selected={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="campaign-list">
        {filteredCampaigns.map((campaign) => {
          const progress =
            campaign.minimumOrderQuantity > 0
              ? Math.round(
                  (campaign.currentOrderQuantity /
                    campaign.minimumOrderQuantity) *
                    100,
                )
              : 0
          const progressWidth = Math.min(progress, 100)
          const remainingForGoal = Math.max(
            campaign.minimumOrderQuantity - campaign.currentOrderQuantity,
            0,
          )
          const remainingForMax = Math.max(
            campaign.maximumOrderQuantity - campaign.currentOrderQuantity,
            0,
          )
          const certificationLabels = certificationMarks
            .filter((mark) => campaign.certificationMarkIds.includes(mark.id))
            .map((mark) => mark.label)

          return (
            <article className="campaign-card" key={campaign.id}>
              <div className="campaign-card__media" aria-hidden="true">
                {campaign.thumbnail ? (
                  <img src={campaign.thumbnail} alt="" />
                ) : (
                  <span>{getCampaignInitial(campaign.productName)}</span>
                )}
              </div>

              <div className="campaign-card__main">
                <div className="campaign-card__head">
                  <div>
                    <div className="campaign-card__meta">
                      <span>{campaign.category}</span>
                      <span>{campaign.source === 'saved' ? '저장됨' : '샘플'}</span>
                    </div>
                    <h3>{campaign.productName}</h3>
                  </div>
                  <span
                    className={`campaign-status campaign-status--${
                      statusToneMap[campaign.status]
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <div className="campaign-card__facts">
                  <div>
                    <span>공동구매가</span>
                    <strong>{formatPrice(campaign.groupBuyingPrice)}</strong>
                    <small>일반가 {formatPrice(campaign.regularPrice)}</small>
                  </div>
                  <div>
                    <span>현재 신청</span>
                    <strong>
                      {formatQuantity(campaign.currentOrderQuantity, '건')}
                    </strong>
                    <small>{campaign.orderCount}건 주문</small>
                  </div>
                  <div>
                    <span>성사 기준</span>
                    <strong>
                      {formatQuantity(campaign.minimumOrderQuantity, '건')}
                    </strong>
                    <small>최대 {formatQuantity(campaign.maximumOrderQuantity, '건')}</small>
                  </div>
                  <div>
                    <span>잔여 물량</span>
                    <strong>
                      {formatQuantity(campaign.surplusQuantity, 'kg')}
                    </strong>
                    <small>{campaign.portionUnit}</small>
                  </div>
                </div>

                <div className="campaign-progress">
                  <div className="campaign-progress__top">
                    <span>성사 진행률</span>
                    <strong>{progress}%</strong>
                  </div>
                  <div
                    className={
                      progress >= 100
                        ? 'campaign-progress__track is-complete'
                        : 'campaign-progress__track'
                    }
                  >
                    <span style={{ width: `${progressWidth}%` }} />
                  </div>
                  <div className="campaign-progress__bottom">
                    <span>목표까지 {formatQuantity(remainingForGoal, '건')}</span>
                    <span>최대 판매 잔여 {formatQuantity(remainingForMax, '건')}</span>
                  </div>
                </div>

                <div className="campaign-card__footer">
                  <div className="campaign-card__chips">
                    <span className="origin-tag">{campaign.origin}</span>
                    <span className="category-chip">{campaign.producerName}</span>
                    {certificationLabels.slice(0, 2).map((label) => (
                      <span className="category-chip" key={label}>
                        {label}
                      </span>
                    ))}
                    {certificationLabels.length > 2 && (
                      <span className="category-chip">
                        인증 +{certificationLabels.length - 2}
                      </span>
                    )}
                  </div>

                  <dl className="campaign-card__dates">
                    <div>
                      <dt>모집 마감</dt>
                      <dd>
                        {formatDate(campaign.recruitEndDate)}
                        <span>{getDday(campaign.recruitEndDate)}</span>
                      </dd>
                    </div>
                    <div>
                      <dt>배송 예정</dt>
                      <dd>{formatDate(campaign.groupShippingDate)}</dd>
                    </div>
                  </dl>

                  <div className="campaign-card__actions">
                    <button type="button" className="button button--muted">
                      상세 보기
                    </button>
                    <button type="button" className="button button--primary">
                      배송 준비
                    </button>
                    <button type="button" className="button button--ghost">
                      모집 종료
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export { ActiveGroupBuyingPage }
